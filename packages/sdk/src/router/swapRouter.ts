/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import invariant from "tiny-invariant";
import { encodeFunctionData, toHex } from "viem";

import {
  aerodromeAbi,
  swapRouter02ABI,
  swapRouter02NewABI,
  swapRouter03,
  swapRouter03WDeadline,
} from "@x7/contracts";
import {
  ETH_ADDRESS_02 as ADDRESS_THIS,
  ChainId,
  CurrencyAmount,
  Fraction,
  Implementation,
  LogCodes,
  ETH_ADDRESS_01 as MSG_SENDER,
  Percent,
  Protocol,
  TradeType,
  WETH9,
  ZERO,
} from "@x7/utils";
import type { Currency } from "@x7/utils";

import { BASIS_POINTS, ONE, validateAndParseAddress } from "../core";
import { WETH_ADDRESS } from "../universal-router/utils/constants";
import { log } from "../utils/logger";
import type { TradeV2 } from "../v2";
import { TradeV2 as V2Trade } from "../v2";
import type {
  FeeOptions,
  MethodParameters,
  PermitOptions,
  TradeV3,
} from "../v3";
import {
  encodeRouteToPath,
  Payments,
  Pool,
  Position,
  SelfPermit,
  TradeV3 as V3Trade,
} from "../v3";
import type { CondensedAddLiquidityOptions } from "./approveAndCall";
import { ApprovalTypes, ApproveAndCall } from "./approveAndCall";
import { encodeMixedRouteToPath } from "./encodeMixedRouteToPath";
import { MixedRouteSDK } from "./entities/mixedRoute/route";
import { MixedRouteTrade } from "./entities/mixedRoute/trade";
import type { RouteV2Wrapper, RouteV3Wrapper } from "./entities/route";
import { MixedRoute } from "./entities/route";
import { Trade } from "./entities/trade";
import { MulticallExtended } from "./multicallExtended";
import { PaymentsExtended } from "./paymentsExtended";
import { getOutputOfPools, partitionMixedRouteByProtocol } from "./utils";

const REFUND_ETH_PRICE_IMPACT_THRESHOLD = new Percent(BigInt(50), BigInt(100));

/**
 * Options for producing the arguments to send calls to the router.
 */
export interface SwapOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  slippageTolerance: Percent;

  /**
   * The account that should receive the output. If omitted, output is sent to msg.sender.
   */
  recipient?: `0x${string}`;

  /**
   * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
   */
  deadlineOrPreviousBlockhash?: number;

  /**
   * The optional permit parameters for spending the input.
   */
  inputTokenPermit?: PermitOptions;

  /**
   * Optional information for taking a fee on output.
   */
  fee?: FeeOptions;
}

export interface SwapAndAddOptions extends SwapOptions {
  /**
   * The optional permit parameters for pulling in remaining output token.
   */
  outputTokenPermit?: PermitOptions;
}

type AnyTradeType =
  | Trade<Currency, Currency, TradeType>
  | V2Trade<Currency, Currency, TradeType>
  | V3Trade<Currency, Currency, TradeType>
  | MixedRouteTrade<Currency, Currency, TradeType>
  | (
      | V2Trade<Currency, Currency, TradeType>
      | V3Trade<Currency, Currency, TradeType>
      | MixedRouteTrade<Currency, Currency, TradeType>
    )[];

/**
 * Represents the Uniswap V2 + V3 SwapRouter02, and has static methods for helping execute trades.
 */
export abstract class SwapRouter {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * @notice Generates the calldata for a Swap with a V2 Route.
   * @param trade The V2Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeV2Swap(
    trade: V2Trade<Currency, Currency, TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): string {
    const amountIn: string = toHex(
      trade.maximumAmountIn(options.slippageTolerance).quotient,
    );
    const amountOut: string = toHex(
      trade.minimumAmountOut(options.slippageTolerance).quotient,
    );

    const chainId = trade.route.chainId;
    const imp =
      (trade.route as RouteV2Wrapper<Currency, Currency>).pairs[0]!.pairType ??
      Implementation.UNISWAP;
    const path = trade.route.path.map((token) => token.address);
    const recipient =
      routerMustCustody &&
      trade.route.chainId === ChainId.ETHEREUM &&
      imp === Implementation.UNISWAP
        ? ADDRESS_THIS
        : typeof options.recipient === "undefined"
          ? MSG_SENDER
          : validateAndParseAddress(options.recipient);

    const etherIn =
      trade.inputAmount.currency.isNative ||
      trade.inputAmount.currency.address === WETH_ADDRESS(chainId);
    const etherOut =
      trade.outputAmount.currency.isNative ||
      trade.outputAmount.currency.address === WETH_ADDRESS(chainId);

    const inputTokenWithFess =
      trade.route.pairs?.[0]?.token0.address ===
      trade.inputAmount.currency.wrapped.address
        ? trade.route.pairs?.[0]?.token0
        : trade.route.pairs?.[0]?.token1;

    const outputTokenWithFess =
      trade.route.pairs?.[0]?.token1.address ===
      trade.outputAmount.currency.wrapped.address
        ? trade.route.pairs?.[0]?.token1
        : trade.route.pairs?.[0]?.token0;

    const inHasFeesSelling = !!inputTokenWithFess?.sellFeeBps;
    const outHasBuyFees = !!outputTokenWithFess?.buyFeeBps;

    const hasFees = inHasFeesSelling || outHasBuyFees;

    let amountOutMin = trade.minimumAmountOut(
      options.slippageTolerance,
    ).quotient;

    if (hasFees) {
      if (inHasFeesSelling) {
        amountOutMin = new Fraction(ONE)
          .add(new Percent(inputTokenWithFess?.sellFeeBps ?? 0, BASIS_POINTS))
          .invert()
          .multiply(
            trade.minimumAmountOut(options.slippageTolerance).quotient,
          ).quotient;
      }

      if (outHasBuyFees) {
        amountOutMin = new Fraction(ONE)
          .add(new Percent(outputTokenWithFess?.buyFeeBps ?? 0, BASIS_POINTS))
          .invert()
          .multiply(
            trade.minimumAmountOut(options.slippageTolerance).quotient,
          ).quotient;
      }
    }

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      if ((!etherIn && !etherOut) || imp === Implementation.UNISWAP) {
        return encodeFunctionData({
          abi:
            imp === Implementation.UNISWAP
              ? swapRouter02ABI
              : swapRouter02NewABI,
          functionName:
            imp !== Implementation.UNISWAP && hasFees
              ? "swapExactTokensForTokensSupportingFeeOnTransferTokens"
              : "swapExactTokensForTokens",
          args:
            imp === Implementation.UNISWAP
              ? [
                  BigInt(amountIn),
                  BigInt(performAggregatedSlippageCheck ? 0 : amountOutMin),
                  path,
                  recipient,
                ]
              : [
                  BigInt(amountIn),
                  BigInt(performAggregatedSlippageCheck ? 0 : amountOutMin),
                  path,
                  recipient,
                  BigInt(options.deadlineOrPreviousBlockhash!),
                ],
        });
      }
      if (etherIn) {
        if (imp === Implementation.AERODROME) {
          return encodeFunctionData({
            abi: aerodromeAbi,
            functionName: hasFees
              ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
              : "swapExactETHForTokens",
            args: [
              BigInt(amountOutMin),
              [
                {
                  from: trade.inputAmount.currency.wrapped.address,
                  to: trade.outputAmount.currency.wrapped.address,
                  stable: false,
                  factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
                },
              ],
              recipient,
              BigInt(options.deadlineOrPreviousBlockhash!),
            ],
          });
        }
        return encodeFunctionData({
          abi: swapRouter02NewABI,
          functionName: hasFees
            ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
            : "swapExactETHForTokens",
          args: [
            BigInt(amountOutMin),
            path,
            recipient,
            BigInt(options.deadlineOrPreviousBlockhash!),
          ],
        });
      } else if (etherOut) {
        if (imp === Implementation.AERODROME) {
          return encodeFunctionData({
            abi: aerodromeAbi,
            functionName: hasFees
              ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
              : "swapExactTokensForETH",
            args: [
              BigInt(amountIn),
              BigInt(amountOutMin),
              [
                {
                  from: trade.inputAmount.currency.wrapped.address,
                  to: trade.outputAmount.currency.wrapped.address,
                  stable: false,
                  factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
                },
              ],
              recipient,
              BigInt(options.deadlineOrPreviousBlockhash!),
            ],
          });
        }
        return encodeFunctionData({
          abi: swapRouter02NewABI,
          functionName: hasFees
            ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
            : "swapExactTokensForETH",
          args: [
            BigInt(amountIn),
            BigInt(amountOutMin),
            path,
            recipient,
            BigInt(options.deadlineOrPreviousBlockhash!),
          ],
        });
      }

      return "HANDLEME";
    } else {
      if ((!etherIn && !etherOut) || imp === Implementation.UNISWAP) {
        return encodeFunctionData({
          abi:
            imp === Implementation.UNISWAP
              ? swapRouter02ABI
              : swapRouter02NewABI,
          functionName: "swapTokensForExactTokens",
          args:
            imp === Implementation.UNISWAP
              ? [BigInt(amountOut), BigInt(amountIn), path, recipient]
              : [
                  BigInt(amountOut),
                  BigInt(amountIn),
                  path,
                  recipient,
                  BigInt(options.deadlineOrPreviousBlockhash!),
                ],
        });
      }

      if (etherIn) {
        if (imp === Implementation.AERODROME) {
          return encodeFunctionData({
            abi: aerodromeAbi,
            functionName: hasFees
              ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
              : "swapExactETHForTokens",
            args: [
              BigInt(amountOutMin),
              [
                {
                  from: trade.inputAmount.currency.wrapped.address,
                  to: trade.outputAmount.currency.wrapped.address,
                  stable: false,
                  factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
                },
              ],
              recipient,
              BigInt(options.deadlineOrPreviousBlockhash!),
            ],
          });
        }
        return encodeFunctionData({
          abi: swapRouter02NewABI,
          functionName: "swapETHForExactTokens",
          args: [
            BigInt(amountOut),
            path,
            recipient,
            BigInt(options.deadlineOrPreviousBlockhash!),
          ],
        });
      } else if (etherOut) {
        if (imp === Implementation.AERODROME) {
          return encodeFunctionData({
            abi: aerodromeAbi,
            functionName: hasFees
              ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
              : "swapExactTokensForETH",
            args: [
              BigInt(amountOut),
              BigInt(amountIn),
              [
                {
                  from: trade.inputAmount.currency.wrapped.address,
                  to: trade.outputAmount.currency.wrapped.address,
                  stable: false,
                  factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
                },
              ],
              recipient,
              BigInt(options.deadlineOrPreviousBlockhash!),
            ],
          });
        }
        return encodeFunctionData({
          abi: swapRouter02NewABI,
          functionName: "swapTokensForExactETH",
          args: [
            BigInt(amountOut),
            BigInt(amountIn),
            path,
            recipient,
            BigInt(options.deadlineOrPreviousBlockhash!),
          ],
        });
      }

      return "HANDLEME2.0";
    }
  }

  /**
   * @notice Generates the calldata for a Swap with a V3 Route.
   * @param trade The V3Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeV3Swap(
    trade: V3Trade<Currency, Currency, TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): string[] {
    const calldatas: string[] = [];

    for (const { route, inputAmount, outputAmount } of trade.swaps) {
      const amountIn: string = toHex(
        trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient,
      );
      const amountOut: string = toHex(
        trade.minimumAmountOut(options.slippageTolerance, outputAmount)
          .quotient,
      );

      // flag for whether the trade is single hop or not
      const singleHop = route.pools.length === 1;
      const chainId = route.chainId;
      const recipient = routerMustCustody
        ? ADDRESS_THIS
        : typeof options.recipient === "undefined"
          ? MSG_SENDER
          : validateAndParseAddress(options.recipient);
      const deadline = BigInt(
        options.deadlineOrPreviousBlockhash ??
          Math.floor(+new Date() / 1000 + 60 * 20),
      );
      const needsDeadline =
        route.pools[0]?.poolType === Implementation.SUSHISWAP;

      if (singleHop) {
        if (trade.tradeType === TradeType.EXACT_INPUT) {
          calldatas.push(
            encodeFunctionData({
              abi: needsDeadline
                ? swapRouter03WDeadline
                : chainId === ChainId.BASE
                  ? swapRouter03
                  : swapRouter02ABI,
              functionName: "exactInputSingle",
              args: [
                {
                  tokenIn: route.tokenPath[0]!.address,
                  tokenOut: route.tokenPath[1]!.address,
                  fee: route.pools[0]!.fee,
                  recipient: recipient,
                  ...(needsDeadline ? { deadline } : {}),
                  amountIn: BigInt(amountIn),
                  amountOutMinimum: BigInt(
                    performAggregatedSlippageCheck ? 0 : amountOut,
                  ),
                  sqrtPriceLimitX96: BigInt(0),
                },
              ],
            }),
          );
        } else {
          calldatas.push(
            encodeFunctionData({
              abi: needsDeadline
                ? swapRouter03WDeadline
                : chainId === ChainId.BASE
                  ? swapRouter02ABI
                  : swapRouter03,
              functionName: "exactOutputSingle",
              args: [
                {
                  tokenIn: route.tokenPath[0]!.address,
                  tokenOut: route.tokenPath[1]!.address,
                  fee: route.pools[0]!.fee,
                  recipient: recipient,
                  ...(needsDeadline ? { deadline } : {}),
                  amountOut: BigInt(amountOut),
                  amountInMaximum: BigInt(amountIn),
                  sqrtPriceLimitX96: BigInt(0),
                },
              ],
            }),
          );
        }
      } else {
        const path: string = encodeRouteToPath(
          route,
          trade.tradeType === TradeType.EXACT_OUTPUT,
        );

        if (trade.tradeType === TradeType.EXACT_INPUT) {
          calldatas.push(
            encodeFunctionData({
              abi: needsDeadline
                ? swapRouter03WDeadline
                : chainId === ChainId.BASE
                  ? swapRouter02ABI
                  : swapRouter03,
              functionName: "exactInput",
              args: [
                {
                  path: path as `0x${string}`,
                  recipient: recipient,
                  ...(needsDeadline ? { deadline } : {}),
                  amountIn: BigInt(amountIn),
                  amountOutMinimum: BigInt(
                    performAggregatedSlippageCheck ? 0 : amountOut,
                  ),
                },
              ],
            }),
          );
        } else {
          calldatas.push(
            encodeFunctionData({
              abi: needsDeadline
                ? swapRouter03WDeadline
                : chainId === ChainId.BASE
                  ? swapRouter02ABI
                  : swapRouter03,
              functionName: "exactOutput",
              args: [
                {
                  path: path as `0x${string}`,
                  recipient: recipient,
                  ...(needsDeadline ? { deadline } : {}),
                  amountOut: BigInt(amountOut),
                  amountInMaximum: BigInt(amountIn),
                },
              ],
            }),
          );
        }
      }
    }

    return calldatas;
  }

  /**
   * @notice Generates the calldata for a MixedRouteSwap. Since single hop routes are not MixedRoutes, we will instead generate
   *         them via the existing encodeV3Swap and encodeV2Swap methods.
   * @param trade The MixedRouteTrade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  private static encodeMixedRouteSwap(
    trade: MixedRouteTrade<Currency, Currency, TradeType>,
    options: SwapOptions,
    routerMustCustody: boolean,
    performAggregatedSlippageCheck: boolean,
  ): string[] {
    const calldatas: string[] = [];

    invariant(trade.tradeType === TradeType.EXACT_INPUT, "TRADE_TYPE");

    for (const { route, inputAmount, outputAmount } of trade.swaps) {
      const amountIn: string = toHex(
        trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient,
      );
      const amountOut: string = toHex(
        trade.minimumAmountOut(options.slippageTolerance, outputAmount)
          .quotient,
      );

      // flag for whether the trade is single hop or not
      const singleHop = route.pools.length === 1;

      const recipient = routerMustCustody
        ? ADDRESS_THIS
        : typeof options.recipient === "undefined"
          ? MSG_SENDER
          : validateAndParseAddress(options.recipient);

      const mixedRouteIsAllV3 = (route: MixedRouteSDK<Currency, Currency>) => {
        return route.pools.every((pool) => pool instanceof Pool);
      };

      if (singleHop) {
        /// For single hop, since it isn't really a mixedRoute, we'll just mimic behavior of V3 or V2
        /// We don't use encodeV3Swap() or encodeV2Swap() because casting the trade to a V3Trade or V2Trade is overcomplex
        if (mixedRouteIsAllV3(route)) {
          calldatas.push(
            encodeFunctionData({
              abi: swapRouter02ABI,
              functionName: "exactInputSingle",
              args: [
                {
                  tokenIn: route.path[0]!.address,
                  tokenOut: route.path[1]!.address,
                  fee: (route.pools as Pool[])[0]!.fee,
                  recipient: recipient,
                  amountIn: BigInt(amountIn),
                  amountOutMinimum: BigInt(
                    performAggregatedSlippageCheck ? 0 : amountOut,
                  ),
                  sqrtPriceLimitX96: BigInt(0),
                },
              ],
            }),
          );
        } else {
          const path = route.path.map((token) => token.address);

          calldatas.push(
            encodeFunctionData({
              abi: swapRouter02ABI,
              functionName: "swapExactTokensForTokens",
              args: [
                BigInt(amountIn),
                BigInt(performAggregatedSlippageCheck ? 0 : amountOut),
                path,
                recipient,
              ],
            }),
          );
        }
      } else {
        const sections = partitionMixedRouteByProtocol(route);

        const isLastSectionInRoute = (i: number) => {
          return i === sections.length - 1;
        };

        let outputToken;
        let inputToken = route.input.wrapped;

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];

          if (section === undefined) {
            throw new Error("MixedRoute is invalid");
          }
          /// Now, we get output of this section
          outputToken = getOutputOfPools(section, inputToken);

          const newRouteOriginal = new MixedRouteSDK(
            [...section],
            section[0]!.token0.equals(inputToken)
              ? section[0]!.token0
              : section[0]!.token1,
            outputToken,
          );
          const newRoute = new MixedRoute(newRouteOriginal);

          /// Previous output is now input

          inputToken = outputToken;

          if (mixedRouteIsAllV3(newRoute)) {
            const path: string = encodeMixedRouteToPath(newRoute);

            calldatas.push(
              encodeFunctionData({
                abi: swapRouter02ABI,
                functionName: "exactInput",
                args: [
                  {
                    path: path as `0x${string}`,
                    // By default router holds funds until the last swap, then it is sent to the recipient
                    // special case exists where we are unwrapping WETH output, in which case `routerMustCustody` is set to true
                    // and router still holds the funds. That logic bundled into how the value of `recipient` is calculated
                    recipient: isLastSectionInRoute(i)
                      ? recipient
                      : ADDRESS_THIS,
                    amountIn: BigInt(i === 0 ? amountIn : 0),
                    amountOutMinimum: BigInt(
                      !isLastSectionInRoute(i) ? 0 : amountOut,
                    ),
                  },
                ],
              }),
            );
          } else {
            calldatas.push(
              encodeFunctionData({
                abi: swapRouter02ABI,
                functionName: "swapExactTokensForTokens",
                args: [
                  BigInt(i === 0 ? amountIn : 0), // amountIn
                  BigInt(!isLastSectionInRoute(i) ? 0 : amountOut), // amountOutMin
                  newRoute.path.map((token) => token.address), // path
                  isLastSectionInRoute(i) ? recipient : ADDRESS_THIS, // to
                ],
              }),
            );
          }
        }
      }
    }

    return calldatas;
  }

  private static encodeSwaps(
    trades: AnyTradeType,
    options: SwapOptions,
    isSwapAndAdd?: boolean,
  ): {
    calldatas: string[];
    sampleTrade:
      | V2Trade<Currency, Currency, TradeType>
      | V3Trade<Currency, Currency, TradeType>
      | MixedRouteTrade<Currency, Currency, TradeType>;
    routerMustCustody: boolean;
    inputIsNative: boolean;
    outputIsNative: boolean;
    totalAmountIn: CurrencyAmount<Currency>;
    minimumAmountOut: CurrencyAmount<Currency>;
    quoteAmountOut: CurrencyAmount<Currency>;
  } {
    // If dealing with an instance of the aggregated Trade object, unbundle it to individual trade objects.
    if (trades instanceof Trade) {
      invariant(
        trades.swaps.every(
          (swap) =>
            swap.route.protocol === Protocol.V3 ||
            swap.route.protocol === Protocol.V2 ||
            swap.route.protocol === Protocol.MIXED,
        ),
        "UNSUPPORTED_PROTOCOL",
      );

      const individualTrades: (
        | V2Trade<Currency, Currency, TradeType>
        | V3Trade<Currency, Currency, TradeType>
        | MixedRouteTrade<Currency, Currency, TradeType>
      )[] = [];

      for (const { route, inputAmount, outputAmount } of trades.swaps) {
        if (route.protocol === Protocol.V2) {
          individualTrades.push(
            new V2Trade(
              route as RouteV2Wrapper<Currency, Currency>,
              trades.tradeType === TradeType.EXACT_INPUT
                ? inputAmount
                : outputAmount,
              trades.tradeType,
            ),
          );
        } else if (route.protocol === Protocol.V3) {
          individualTrades.push(
            V3Trade.createUncheckedTrade({
              route: route as RouteV3Wrapper<Currency, Currency>,
              inputAmount,
              outputAmount,
              tradeType: trades.tradeType,
            }),
          );
        } else if (route.protocol === Protocol.MIXED) {
          individualTrades.push(
            /// we can change the naming of this function on MixedRouteTrade if needed
            MixedRouteTrade.createUncheckedTrade({
              route: route as MixedRoute<Currency, Currency>,
              inputAmount,
              outputAmount,
              tradeType: trades.tradeType,
            }),
          );
        } else {
          throw new Error("UNSUPPORTED_TRADE_PROTOCOL");
        }
      }
      trades = individualTrades;
    }

    if (!Array.isArray(trades)) {
      trades = [trades];
    }

    const numberOfTrades = trades.reduce(
      (numberOfTrades, trade) =>
        numberOfTrades +
        (trade instanceof V3Trade || trade instanceof MixedRouteTrade
          ? trade.swaps.length
          : 1),
      0,
    );

    const sampleTrade = trades[0];

    if (sampleTrade === undefined) {
      throw new Error("NO_TRADES");
    }

    // All trades should have the same starting/ending currency and trade type
    invariant(
      trades.every((trade) =>
        trade.inputAmount.currency.equals(sampleTrade.inputAmount.currency),
      ),
      "TOKEN_IN_DIFF",
    );
    invariant(
      trades.every((trade) =>
        trade.outputAmount.currency.equals(sampleTrade.outputAmount.currency),
      ),
      "TOKEN_OUT_DIFF",
    );
    invariant(
      trades.every((trade) => trade.tradeType === sampleTrade.tradeType),
      "TRADE_TYPE_DIFF",
    );

    const calldatas: string[] = [];

    const inputIsNative =
      sampleTrade.inputAmount.currency.isNative ||
      sampleTrade.inputAmount.currency.address ===
        WETH_ADDRESS(sampleTrade.route?.chainId ?? ChainId.BASE);
    const outputIsNative =
      sampleTrade.outputAmount.currency.isNative ||
      sampleTrade.outputAmount.currency.address ===
        WETH_ADDRESS(sampleTrade.route?.chainId ?? ChainId.BASE);

    // flag for whether we want to perform an aggregated slippage check
    //   1. when there are >2 exact input trades. this is only a heuristic,
    //      as it's still more gas-expensive even in this case, but has benefits
    //      in that the reversion probability is lower
    const performAggregatedSlippageCheck =
      sampleTrade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2;
    // flag for whether funds should be send first to the router
    //   1. when receiving ETH (which much be unwrapped from WETH)
    //   2. when a fee on the output is being taken
    //   3. when performing swap and add
    //   4. when performing an aggregated slippage check
    const routerMustCustody =
      outputIsNative ||
      !!options.fee ||
      !!isSwapAndAdd ||
      performAggregatedSlippageCheck;

    // encode permit if necessary
    if (options.inputTokenPermit) {
      invariant(sampleTrade.inputAmount.currency.isToken, "NON_TOKEN_PERMIT");
      calldatas.push(
        SelfPermit.encodePermit(
          sampleTrade.inputAmount.currency,
          options.inputTokenPermit,
        ),
      );
    }

    for (const trade of trades) {
      if (trade instanceof V2Trade) {
        calldatas.push(
          SwapRouter.encodeV2Swap(
            trade,
            options,
            routerMustCustody,
            performAggregatedSlippageCheck,
          ),
        );
      } else if (trade instanceof V3Trade) {
        for (const calldata of SwapRouter.encodeV3Swap(
          trade,
          options,
          routerMustCustody,
          performAggregatedSlippageCheck,
        )) {
          calldatas.push(calldata);
        }
      } else if (trade instanceof MixedRouteTrade) {
        for (const calldata of SwapRouter.encodeMixedRouteSwap(
          trade,
          options,
          routerMustCustody,
          performAggregatedSlippageCheck,
        )) {
          calldatas.push(calldata);
        }
      } else {
        throw new Error("Unsupported trade object");
      }
    }

    const ZERO_IN: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(
      sampleTrade.inputAmount.currency,
      0,
    );
    const ZERO_OUT: CurrencyAmount<Currency> = CurrencyAmount.fromRawAmount(
      sampleTrade.outputAmount.currency,
      0,
    );

    const minimumAmountOut: CurrencyAmount<Currency> = trades.reduce(
      (sum, trade) =>
        sum.add(trade.minimumAmountOut(options.slippageTolerance)),
      ZERO_OUT,
    );

    const quoteAmountOut: CurrencyAmount<Currency> = trades.reduce(
      (sum, trade) => sum.add(trade.outputAmount),
      ZERO_OUT,
    );

    const totalAmountIn: CurrencyAmount<Currency> = trades.reduce(
      (sum, trade) => sum.add(trade.maximumAmountIn(options.slippageTolerance)),
      ZERO_IN,
    );

    return {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut,
      quoteAmountOut,
    };
  }

  private static shouldUseMulticall(
    sampleTrade:
      | TradeV2<Currency, Currency, TradeType>
      | TradeV3<Currency, Currency, TradeType>
      | MixedRouteTrade<Currency, Currency, TradeType>,
    implementation: Implementation,
  ) {
    // @ts-expect-error: We know

    const protocol: Protocol = sampleTrade?.protocol ?? Protocol.MIXED;
    const chainId = sampleTrade.route?.chainId ?? ChainId.BASE;
    // Sushiswap does not have mutlicalls enabled
    if (implementation && implementation === Implementation.SUSHISWAP) {
      return false;
    }

    if (implementation && implementation === Implementation.AERODROME) {
      return false;
    }

    if (
      implementation &&
      implementation === Implementation.UNISWAP &&
      chainId === ChainId.BASE &&
      protocol === Protocol.V2
    ) {
      return false;
    }

    return true;
  }

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(
    trades:
      | Trade<Currency, Currency, TradeType>
      | V2Trade<Currency, Currency, TradeType>
      | V3Trade<Currency, Currency, TradeType>
      | MixedRouteTrade<Currency, Currency, TradeType>
      | (
          | V2Trade<Currency, Currency, TradeType>
          | V3Trade<Currency, Currency, TradeType>
          | MixedRouteTrade<Currency, Currency, TradeType>
        )[],
    options: SwapOptions,
    implementation?: Implementation,
  ): MethodParameters {
    const {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut,
    } = SwapRouter.encodeSwaps(trades, options);

    // unwrap or sweep idea here is only uniswap uses it, but where it would error a TX (in a multicall unexpected we dont use multicalls, more work to break this down further for no reason)
    if (routerMustCustody && implementation === Implementation.UNISWAP) {
      if (outputIsNative) {
        calldatas.push(
          PaymentsExtended.encodeUnwrapWETH9(
            minimumAmountOut.quotient,
            options.recipient,
            options.fee,
          ),
        );
      } else {
        calldatas.push(
          PaymentsExtended.encodeSweepToken(
            sampleTrade.outputAmount.currency.wrapped,
            minimumAmountOut.quotient,
            options.recipient,
            options.fee,
          ),
        );
      }
    }

    // must refund when paying in ETH: either with an uncertain input amount OR if there's a chance of a partial fill.
    // unlike ERC20's, the full ETH value must be sent in the transaction, so the rest must be refunded.
    if (
      inputIsNative &&
      (sampleTrade.tradeType === TradeType.EXACT_OUTPUT ||
        SwapRouter.riskOfPartialFill(trades)) &&
      implementation === Implementation.UNISWAP
    ) {
      calldatas.push(Payments.encodeRefundETH());
    }

    log.info(LogCodes.TRADE_REBUILD, {
      inputIsNative,
      total: totalAmountIn.quotient,
      selected: inputIsNative ? totalAmountIn.quotient : ZERO,
    });

    return {
      calldata: (!this.shouldUseMulticall(
        sampleTrade,
        implementation ?? Implementation.UNISWAP,
      )
        ? calldatas[0]
        : MulticallExtended.encodeMulticall(
            calldatas,
            options.deadlineOrPreviousBlockhash,
          ))!,
      value: toHex(inputIsNative ? totalAmountIn.quotient : ZERO),
    };
  }

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapAndAddCallParameters(
    trades: AnyTradeType,
    options: SwapAndAddOptions,
    position: Position,
    addLiquidityOptions: CondensedAddLiquidityOptions,
    tokenInApprovalType: ApprovalTypes,
    tokenOutApprovalType: ApprovalTypes,
  ): MethodParameters {
    const {
      calldatas,
      inputIsNative,
      outputIsNative,
      sampleTrade,
      totalAmountIn: totalAmountSwapped,
      quoteAmountOut,
      minimumAmountOut,
    } = SwapRouter.encodeSwaps(trades, options, true);

    // encode output token permit if necessary
    if (options.outputTokenPermit) {
      invariant(quoteAmountOut.currency.isToken, "NON_TOKEN_PERMIT_OUTPUT");
      calldatas.push(
        SelfPermit.encodePermit(
          quoteAmountOut.currency,
          options.outputTokenPermit,
        ),
      );
    }

    if (sampleTrade.route === undefined) {
      throw new Error("sample trade undefined");
    }

    const chainId = sampleTrade.route.chainId as ChainId;
    const zeroForOne =
      position.pool.token0.wrapped.address ===
      totalAmountSwapped.currency.wrapped.address;
    const { positionAmountIn, positionAmountOut } =
      SwapRouter.getPositionAmounts(position, zeroForOne);

    // if tokens are native they will be converted to WETH9
    const tokenIn = inputIsNative
      ? WETH9[chainId]
      : positionAmountIn.currency.wrapped;
    const tokenOut = outputIsNative
      ? WETH9[chainId]
      : positionAmountOut.currency.wrapped;

    if (tokenOut === undefined) {
      throw new Error("token out undefined");
    }

    if (tokenIn === undefined) {
      throw new Error("token in undefined");
    }

    // if swap output does not make up whole outputTokenBalanceDesired, pull in remaining tokens for adding liquidity
    const amountOutRemaining = positionAmountOut.subtract(
      quoteAmountOut.wrapped,
    );
    if (
      amountOutRemaining.greaterThan(
        CurrencyAmount.fromRawAmount(positionAmountOut.currency, 0),
      )
    ) {
      // if output is native, this means the remaining portion is included as native value in the transaction
      // and must be wrapped. Otherwise, pull in remaining ERC20 token.
      outputIsNative
        ? calldatas.push(
            PaymentsExtended.encodeWrapETH(amountOutRemaining.quotient),
          )
        : calldatas.push(
            PaymentsExtended.encodePull(tokenOut, amountOutRemaining.quotient),
          );
    }

    // if input is native, convert to WETH9, else pull ERC20 token
    inputIsNative
      ? calldatas.push(
          PaymentsExtended.encodeWrapETH(positionAmountIn.quotient),
        )
      : calldatas.push(
          PaymentsExtended.encodePull(tokenIn, positionAmountIn.quotient),
        );

    // approve token balances to NFTManager
    if (tokenInApprovalType !== ApprovalTypes.NOT_REQUIRED)
      calldatas.push(
        ApproveAndCall.encodeApprove(tokenIn, tokenInApprovalType),
      );
    if (tokenOutApprovalType !== ApprovalTypes.NOT_REQUIRED)
      calldatas.push(
        ApproveAndCall.encodeApprove(tokenOut, tokenOutApprovalType),
      );

    // represents a position with token amounts resulting from a swap with maximum slippage
    // hence the minimal amount out possible.
    const minimalPosition = Position.fromAmounts({
      pool: position.pool,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      amount0: zeroForOne
        ? position.amount0.quotient
        : minimumAmountOut.quotient,
      amount1: zeroForOne
        ? minimumAmountOut.quotient
        : position.amount1.quotient,
      useFullPrecision: false,
    });

    // encode NFTManager add liquidity
    calldatas.push(
      ApproveAndCall.encodeAddLiquidity(
        position,
        minimalPosition,
        addLiquidityOptions,
        options.slippageTolerance,
      ),
    );

    // sweep remaining tokens
    inputIsNative
      ? calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO))
      : calldatas.push(PaymentsExtended.encodeSweepToken(tokenIn, ZERO));
    outputIsNative
      ? calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO))
      : calldatas.push(PaymentsExtended.encodeSweepToken(tokenOut, ZERO));

    let value: bigint;
    if (inputIsNative) {
      value = totalAmountSwapped.wrapped.add(positionAmountIn.wrapped).quotient;
    } else if (outputIsNative) {
      value = amountOutRemaining.quotient;
    } else {
      value = ZERO;
    }

    log.info(LogCodes.SWAP_AND_ADD_PARAMETERS, {
      outputIsNative,
      inputIsNative,
      type: sampleTrade.tradeType,
      typeBool: sampleTrade.tradeType === TradeType.EXACT_OUTPUT,
      riskOfPartialFill: SwapRouter.riskOfPartialFill(trades),
      shouldAddRefund:
        inputIsNative &&
        (sampleTrade.tradeType === TradeType.EXACT_OUTPUT ||
          SwapRouter.riskOfPartialFill(trades)),
      calldatas,
    });

    return {
      calldata: MulticallExtended.encodeMulticall(
        calldatas,
        options.deadlineOrPreviousBlockhash,
      ),
      value: value.toString(),
    };
  }

  // if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
  private static riskOfPartialFill(trades: AnyTradeType): boolean {
    if (Array.isArray(trades)) {
      return trades.some((trade) => {
        return SwapRouter.v3TradeWithHighPriceImpact(trade);
      });
    } else {
      return SwapRouter.v3TradeWithHighPriceImpact(trades);
    }
  }

  private static v3TradeWithHighPriceImpact(
    trade:
      | Trade<Currency, Currency, TradeType>
      | V2Trade<Currency, Currency, TradeType>
      | V3Trade<Currency, Currency, TradeType>
      | MixedRouteTrade<Currency, Currency, TradeType>,
  ): boolean {
    return (
      !(trade instanceof V2Trade) &&
      trade.priceImpact.greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD)
    );
  }

  private static getPositionAmounts(
    position: Position,
    zeroForOne: boolean,
  ): {
    positionAmountIn: CurrencyAmount<Currency>;
    positionAmountOut: CurrencyAmount<Currency>;
  } {
    const { amount0, amount1 } = position.mintAmounts;
    const currencyAmount0 = CurrencyAmount.fromRawAmount(
      position.pool.token0,
      amount0,
    );
    const currencyAmount1 = CurrencyAmount.fromRawAmount(
      position.pool.token1,
      amount1,
    );

    const [positionAmountIn, positionAmountOut] = zeroForOne
      ? [currencyAmount0, currencyAmount1]
      : [currencyAmount1, currencyAmount0];
    return { positionAmountIn, positionAmountOut };
  }
}
