/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import invariant from "tiny-invariant";
import { encodeFunctionData, toHex } from "viem";
import type { Abi } from "viem";

import { quoterABI, quoterv2ABI } from "@x7/contracts";
import type { Currency, CurrencyAmount } from "@x7/utils";
import { TradeType } from "@x7/utils";

import type { FeeAmount } from "./constants";
import type { RouteV3 } from "./entities";
import type { MethodParameters } from "./utils";
import { encodeRouteToPath } from "./utils";

/**
 * Optional arguments to send to the quoter.
 */
export interface QuoteOptions {
  /**
   * The optional price limit for the trade.
   */
  sqrtPriceLimitX96?: bigint;

  /**
   * The optional quoter interface to use
   */
  useQuoterV2?: boolean;
}

interface BaseQuoteParams {
  fee: FeeAmount;
  sqrtPriceLimitX96: bigint;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
}

/**
 * Represents the Uniswap V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */
export abstract class SwapQuoter {
  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @param options The optional params including price limit and Quoter contract switch
   * @returns The formatted calldata
   */
  public static quoteCallParameters<
    TInput extends Currency,
    TOutput extends Currency,
  >(
    route: RouteV3<TInput, TOutput>,
    amount: CurrencyAmount<TInput | TOutput>,
    tradeType: TradeType,
    options: QuoteOptions = {},
  ): MethodParameters {
    const singleHop = route.pools.length === 1;
    const quoteAmount = amount.quotient;
    let calldata: string;
    const swapABI: Abi = options.useQuoterV2 ? quoterv2ABI : quoterABI;

    if (singleHop) {
      const baseQuoteParams: BaseQuoteParams = {
        tokenIn: route.tokenPath[0]?.address!,
        tokenOut: route.tokenPath[1]?.address!,
        fee: route.pools[0]?.fee!,
        sqrtPriceLimitX96: BigInt(options.sqrtPriceLimitX96 ?? 0),
      };

      const v2QuoteParams = {
        ...baseQuoteParams,
        ...(tradeType == TradeType.EXACT_INPUT
          ? { amountIn: quoteAmount }
          : { amount: quoteAmount }),
      };

      const v1QuoteParams = [
        baseQuoteParams.tokenIn,
        baseQuoteParams.tokenOut,
        baseQuoteParams.fee,
        quoteAmount,
        baseQuoteParams.sqrtPriceLimitX96,
      ];

      const tradeTypeFunctionName =
        tradeType === TradeType.EXACT_INPUT
          ? "quoteExactInputSingle"
          : "quoteExactOutputSingle";

      calldata = encodeFunctionData({
        abi: swapABI,
        functionName: tradeTypeFunctionName,
        args: options.useQuoterV2 ? [v2QuoteParams] : v1QuoteParams,
      });
    } else {
      invariant(
        options.sqrtPriceLimitX96 === undefined,
        "MULTIHOP_PRICE_LIMIT",
      );
      const path: string = encodeRouteToPath(
        route,
        tradeType === TradeType.EXACT_OUTPUT,
      );
      const tradeTypeFunctionName =
        tradeType === TradeType.EXACT_INPUT
          ? "quoteExactInput"
          : "quoteExactOutput";

      calldata = encodeFunctionData({
        abi: swapABI,
        functionName: tradeTypeFunctionName,
        args: [path, quoteAmount],
      });
    }
    return {
      calldata,
      value: toHex(0),
    };
  }
}
