import type { PublicClient } from "viem"

import { ChainId } from "@x7/utils"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV2BaseProvider } from "./UniswapV2Base"

export class JetSwapProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: "0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7",
      [ChainId.BSC]: "0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5",
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        "0x505c843b83f01afef714149e8b174427d552e1aca4834b4f9b4b525f426ff3c6",
      [ChainId.BSC]:
        "0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651",
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.JetSwap
  }
  getPoolProviderName(): string {
    return "JetSwap"
  }
}
