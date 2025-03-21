export interface GasPrice {
  gasPriceWei: bigint;
}

/**
 * Provider for getting gas prices.
 */
export abstract class IGasPriceProvider {
  public abstract getGasPrice(): Promise<GasPrice>;
}
