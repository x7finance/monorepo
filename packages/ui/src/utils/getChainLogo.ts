import { ChainId } from "@x7/utils"

export function getChainLogo(chainId: ChainId = ChainId.ETHEREUM): string {
  switch (chainId) {
    case ChainId.ETHEREUM:
    case ChainId.ETHEREUM_TESTNET:
      return `https://assets.x7finance.org/images/svgs/eth.svg`
    case ChainId.BASE:
    case ChainId.BASE_TESTNET:
      return `https://assets.x7finance.org/images/svgs/base.svg`
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET:
      return `https://assets.x7finance.org/images/svgs/arbiscan-logo-dark.svg`
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISM_TESTNET:
      return `https://assets.x7finance.org/images/svgs/op-etherscan-logo-dark.svg`
    case ChainId.POLYGON:
    case ChainId.POLYGON_TESTNET:
      return `https://assets.x7finance.org/images/svgs/matic-token-icon.svg`
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
      return `https://assets.x7finance.org/images/svgs/bnb-logo.svg`
    default:
      return `https://assets.x7finance.org/images/svgs/eth.svg`
  }
}
