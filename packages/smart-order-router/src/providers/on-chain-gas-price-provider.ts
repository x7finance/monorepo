import { ChainId } from "@x7/utils";

import type { EIP1559GasPriceProvider } from "./eip-1559-gas-price-provider";
import type { GasPrice } from "./gas-price-provider";
import { IGasPriceProvider } from "./gas-price-provider";
import type { LegacyGasPriceProvider } from "./legacy-gas-price-provider";

const DEFAULT_EIP_1559_SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.ETHEREUM_TESTNET,
  ChainId.POLYGON_TESTNET,
];

/**
 * Gets gas prices on chain. If the chain supports EIP-1559 and has the feeHistory API,
 * uses the EIP1559 provider. Otherwise it will use a legacy provider that uses eth_gasPrice
 *
 * @export
 * @class OnChainGasPriceProvider
 */
export class OnChainGasPriceProvider extends IGasPriceProvider {
  constructor(
    protected chainId: ChainId,
    protected eip1559GasPriceProvider: EIP1559GasPriceProvider,
    protected legacyGasPriceProvider: LegacyGasPriceProvider,
    protected eipChains: ChainId[] = DEFAULT_EIP_1559_SUPPORTED_CHAINS,
  ) {
    super();
  }

  public async getGasPrice(): Promise<GasPrice> {
    if (this.eipChains.includes(this.chainId)) {
      return this.eip1559GasPriceProvider.getGasPrice();
    }

    return this.legacyGasPriceProvider.getGasPrice();
  }
}
