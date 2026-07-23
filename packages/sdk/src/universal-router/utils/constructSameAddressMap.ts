import { ChainId } from "@x7/utils"

const DEFAULT_NETWORKS: ChainId[] = [
  ChainId.ETHEREUM,
  ChainId.ETHEREUM_TESTNET,
  ChainId.BSC,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.POLYGON_TESTNET,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
]

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: ChainId[] = []
): Record<ChainId, T> {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce<Record<ChainId, T>>(
    (memo, chainId) => {
      memo[chainId] = address
      return memo
    },
    {} as Record<ChainId, T>
  )
}
