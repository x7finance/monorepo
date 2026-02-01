import { ChainId } from "@x7/utils"

export const BLOCK_EXPLORER_PREFIXES: Record<number, string> = {
  [ChainId.ETHEREUM]: "https://etherscan.io",
  [ChainId.ETHEREUM_TESTNET]: "https://sepolia.etherscan.io",
  [ChainId.BASE]: "https://basescan.org",
  [ChainId.BASE_TESTNET]: "https://sepolia.basescan.org",
  [ChainId.OPTIMISM]: "https://optimistic.etherscan.io",
  [ChainId.OPTIMISM_TESTNET]: "https://sepolia-optimistic.etherscan.io",
  [ChainId.POLYGON]: "https://polygonscan.com",
  [ChainId.POLYGON_TESTNET]: "https://amoy.polygonscan.com/",
  [ChainId.ARBITRUM]: "https://arbiscan.io/",
  [ChainId.ARBITRUM_TESTNET]: "https://sepolia.arbiscan.io/",
  [ChainId.BSC]: "https://bscscan.com",
  [ChainId.BSC_TESTNET]: "https://testnet.bscscan.com",
}

export enum ExplorerDataType {
  TRANSACTION = "transaction",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: ExplorerDataType
): string {
  const prefix = BLOCK_EXPLORER_PREFIXES[chainId] ?? "https://etherscan.io"

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`

    case ExplorerDataType.BLOCK:
      if (chainId === ChainId.OPTIMISM) {
        return `${prefix}/tx/${data}`
      }
      return `${prefix}/block/${data}`

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`
    default:
      return `${prefix}`
  }
}
