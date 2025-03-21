import type { PublicClient } from "viem";

import { LogCodes } from "@x7/utils";

import { log } from "../utils";
import type { ViemProviderType } from "../utils";
import type { GasPrice } from "./gas-price-provider";
import { IGasPriceProvider } from "./gas-price-provider";

export class LegacyGasPriceProvider extends IGasPriceProvider {
  constructor(protected provider: ViemProviderType) {
    super();
  }

  public async getGasPrice(): Promise<GasPrice> {
    const gasPriceWei = await (this.provider as PublicClient).getGasPrice();
    log.info(
      LogCodes.GAS_ESTIMATE,
      { gasPriceWei },
      `Got gas price ${gasPriceWei} using eth_gasPrice RPC`,
    );

    return {
      gasPriceWei,
    };
  }
}
