import type { CurrencyAmount } from "../../../utils/amounts";

export interface L1ToL2GasCosts {
  gasUsedL1: bigint;
  gasUsedL1OnL2: bigint;
  gasCostL1USD: CurrencyAmount;
  gasCostL1QuoteToken: CurrencyAmount;
}

/**
 * Contains functions for generating gas estimates for given routes.
 *
 * We generally compute gas estimates off-chain because
 *  1/ Calling eth_estimateGas for a swaps requires the caller to have
 *     temporary ownership of the underlying assets, and
 *  2/ Gas estimates computed off-chain can be cached, reducing latency and cost.
 *
 * Generally these models should be optimized to return quickly by performing any
 * long running operations (like fetching external data) outside of the functions defined.
 * This is because the functions in the model are called once for every route and every
 * amount that is considered in the algorithm so it is important to minimize the number of
 * long running operations.
 */
export interface IGasModel<TRouteWithValidQuote> {
  estimateGasCost(routeWithValidQuote: TRouteWithValidQuote): {
    gasEstimate: bigint;
    gasCostInToken: CurrencyAmount;
    gasCostInUSD: CurrencyAmount;
    gasCostInGasToken?: CurrencyAmount;
  };
  calculateL1GasFees?(routes: TRouteWithValidQuote[]): Promise<L1ToL2GasCosts>;
}
