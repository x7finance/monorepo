import type {
  CondensedAddLiquidityOptions,
  PermitOptions,
  Pool,
  Position,
  MethodParameters as SDKMethodParameters,
  Trade,
  SwapOptions as UniversalRouterSwapOptions,
} from "@x7/sdk";
import type { Currency, Fraction, Percent, TradeType } from "@x7/utils";

import type { SimulationStatus } from "../providers/simulation-types";
import type { CurrencyAmount } from "../utils/amounts";
import type { RouteWithValidQuote } from "./alpha-router/entities/route-with-valid-quote";

// Re-export route types for backwards compatibility
export { V3Route, V2Route, MixedRoute } from "./route-types";

export interface SwapRoute {
  /**
   * The quote for the swap.
   * For EXACT_IN swaps this will be an amount of token out.
   * For EXACT_OUT this will be an amount of token in.
   */
  quote: CurrencyAmount;
  /**
   * The quote adjusted for the estimated gas used by the swap.
   * This is computed by estimating the amount of gas used by the swap, converting
   * this estimate to be in terms of the quote token, and subtracting that from the quote.
   * i.e. quoteGasAdjusted = quote - estimatedGasUsedQuoteToken
   */
  quoteGasAdjusted: CurrencyAmount;
  /**
   * The quote adjusted for the estimated gas used by the swap as well as the portion amount, if applicable.
   * This is computed by estimating the amount of gas used by the swap, converting
   * this estimate to be in terms of the quote token, and subtracting that from the quote.
   * Then it uses the IPortionProvider.getPortionAdjustedQuote method to adjust the quote for the portion amount.
   * i.e. quoteGasAdjusted = quote - estimatedGasUsedQuoteToken - portionAmount
   */
  quoteGasAndPortionAdjusted?: CurrencyAmount;
  /**
   * The estimate of the gas used by the swap.
   */
  estimatedGasUsed: bigint | string;
  /**
   * The estimate of the gas used by the swap in terms of the quote token.
   */
  estimatedGasUsedQuoteToken: CurrencyAmount;
  /**
   * The estimate of the gas used by the swap in USD.
   */
  estimatedGasUsedUSD: CurrencyAmount;
  /**
   * The gas price used when computing quoteGasAdjusted, estimatedGasUsedQuoteToken, etc.
   */
  gasPriceWei: bigint;
  /**
   * The Trade object representing the swap.
   */
  trade: Trade<Currency, Currency, TradeType>;
  /**
   * The routes of the swap.
   */
  route: RouteWithValidQuote[];
  /**
   * The block number used when computing the swap.
   */
  blockNumber: bigint;
  /**
   * The calldata to execute the swap. Only returned if swapConfig was provided when calling the router.
   */
  methodParameters?: MethodParameters;
  /**
   * Enum that is returned if simulation was requested
   * 0 if simulation was not attempted
   * 1 if simulation was attempted and failed
   * 2 if simulation was successful (simulated gas estimates are returned)
   */
  simulationStatus?: SimulationStatus;
  /**
   * Used internally within routing-api to see how many route requests
   * hit the cached routes. This is used further down the line for future perf optimizations.
   */
  hitsCachedRoute?: boolean;
  /**
   * Portion amount either echoed from upstream routing-api for exact out or calculated from portionBips for exact in
   */
  portionAmount?: CurrencyAmount;
}

export type MethodParameters = SDKMethodParameters & { to: `0x${string}` };

export type SwapToRatioRoute = SwapRoute & {
  optimalRatio: Fraction;
  postSwapTargetPool: Pool;
};

export enum SwapToRatioStatus {
  SUCCESS = 1,
  NO_ROUTE_FOUND = 2,
  NO_SWAP_NEEDED = 3,
}

export interface SwapToRatioSuccess {
  status: SwapToRatioStatus.SUCCESS;
  result: SwapToRatioRoute;
}

export interface SwapToRatioFail {
  status: SwapToRatioStatus.NO_ROUTE_FOUND;
  error: string;
}

export interface SwapToRatioNoSwapNeeded {
  status: SwapToRatioStatus.NO_SWAP_NEEDED;
}

export type SwapToRatioResponse =
  | SwapToRatioSuccess
  | SwapToRatioFail
  | SwapToRatioNoSwapNeeded;

export enum SwapType {
  UNIVERSAL_ROUTER,
  SWAP_ROUTER_02,
}

// Swap options for Universal Router and Permit2.
export type SwapOptionsUniversalRouter = UniversalRouterSwapOptions & {
  type: SwapType.UNIVERSAL_ROUTER;
  simulate?: { fromAddress: string };
};

// Swap options for router-sdk and SwapRouter02.
export interface SwapOptionsSwapRouter02 {
  type: SwapType.SWAP_ROUTER_02;
  recipient: string;
  slippageTolerance: Percent;
  deadline: number;
  simulate?: { fromAddress: string };
  inputTokenPermit?: PermitOptions &
    (
      | {
          amount: string;
          deadline: string;
        }
      | {
          nonce: string;
          expiry: string;
        }
    );
}

export type SwapOptions = (
  | SwapOptionsUniversalRouter
  | SwapOptionsSwapRouter02
) & { saveRoutes?: boolean; ignoreAborts?: boolean };

// Config passed in to determine configurations on acceptable liquidity
// to add to a position and max iterations on the route-finding algorithm
export interface SwapAndAddConfig {
  maxIterations: number;
  ratioErrorTolerance: Fraction;
}

// Options for executing the swap and add.
// If provided, calldata for executing the swap and add will also be returned.
export interface SwapAndAddOptions {
  swapOptions: SwapOptionsSwapRouter02;
  addLiquidityOptions: CondensedAddLiquidityOptions;
}

// SwapAndAddOptions plus all other parameters needed to encode the
// on-chain swap-and-add process
export interface SwapAndAddParameters {
  // starting balance for tokenIn which will inform the tokenIn position amount
  initialBalanceTokenIn: CurrencyAmount;
  // starting balance for tokenOut which will inform the tokenOut position amount
  initialBalanceTokenOut: CurrencyAmount;
  // position details needed to create a new Position with the known liquidity amounts
  preLiquidityPosition: Position;
}

/**
 * Provides functionality for finding optimal swap routes on the Uniswap protocol.
 *
 * @export
 * @abstract
 * @class IRouter
 */
export abstract class IRouter<RoutingConfig> {
  /**
   * Finds the optimal way to swap tokens, and returns the route as well as a quote for the swap.
   * Considers split routes, multi-hop swaps, and gas costs.
   *
   * @abstract
   * @param amount The amount specified by the user. For EXACT_IN swaps, this is the input token amount. For EXACT_OUT swaps, this is the output token.
   * @param quoteCurrency The currency of the token we are returning a quote for. For EXACT_IN swaps, this is the output token. For EXACT_OUT, this is the input token.
   * @param tradeType The type of the trade, either exact in or exact out.
   * @param [swapOptions] Optional config for executing the swap. If provided, calldata for executing the swap will also be returned.
   * @param [partialRoutingConfig] Optional config for finding the optimal route.
   * @returns The swap route.
   */
  abstract route(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    swapType: TradeType,
    swapOptions?: SwapOptions,
    partialRoutingConfig?: Partial<RoutingConfig>,
  ): Promise<SwapRoute | null>;
}

export abstract class ISwapToRatio<RoutingConfig, SwapAndAddConfig> {
  abstract routeToRatio(
    token0Balance: CurrencyAmount,
    token1Balance: CurrencyAmount,
    position: Position,
    swapAndAddConfig: SwapAndAddConfig,
    swapAndAddOptions?: SwapAndAddOptions,
    routingConfig?: RoutingConfig,
  ): Promise<SwapToRatioResponse>;
}
