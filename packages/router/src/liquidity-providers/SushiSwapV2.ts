import type { PublicClient } from "viem";

import { ChainId } from "@x7/utils";

import { LiquidityProviders } from "./LiquidityProvider";
import { UniswapV2BaseProvider } from "./UniswapV2Base";

export class SushiSwapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = SUSHISWAP_V2_FACTORY_ADDRESS;
    // @ts-expect-error: todo fix
    super(chainId, web3Client, factory, SUSHISWAP_V2_INIT_CODE_HASH);
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV2;
  }
  getPoolProviderName(): string {
    return "SushiSwapV2";
  }
}

const SUSHISWAP_V2_FACTORY_ADDRESS: Partial<Record<ChainId, `0x${string}`>> = {
  [ChainId.ETHEREUM]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
};

const SUSHISWAP_V2_INIT_CODE_HASH: Partial<Record<ChainId, `0x${string}`>> = {
  [ChainId.ETHEREUM]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
};
