import type { PublicClient } from "viem"

import { ChainId } from "@x7/utils"

import { LiquidityProviders } from "./LiquidityProvider"
import { UniswapV2BaseProvider } from "./UniswapV2Base"

export class DfynProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B",
      [ChainId.ARBITRUM]: "0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429",
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        "0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3",
      [ChainId.ARBITRUM]:
        "0xd49917af2b31d70ba7bea89230a93b55d3b6a99aacd03a72c288dfe524ec2f36",
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Dfyn
  }
  getPoolProviderName(): string {
    return "Dfyn"
  }
}
