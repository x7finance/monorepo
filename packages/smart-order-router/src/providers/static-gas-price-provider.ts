/* oxlint-disable @typescript-eslint/require-await */
import type { GasPrice, IGasPriceProvider } from "./gas-price-provider";

export class StaticGasPriceProvider implements IGasPriceProvider {
  constructor(private gasPriceWei: bigint) {}
  async getGasPrice(): Promise<GasPrice> {
    return { gasPriceWei: this.gasPriceWei };
  }
}
