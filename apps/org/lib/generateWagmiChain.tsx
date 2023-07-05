import { arbitrum, bsc, mainnet, optimism, polygon } from "wagmi/chains"

import { ChainEnum } from "@x7/common"

export function generateWagmiChain(chainId: number) {
  switch (chainId) {
    case ChainEnum.erc:
      return mainnet.id
    case ChainEnum.bsc:
      return bsc.id
    case ChainEnum.polygon:
      return polygon.id
    case ChainEnum.arbitrum:
      return arbitrum.id
    case ChainEnum.optimism:
      return optimism.id
    default:
      return mainnet.id
  }
}
