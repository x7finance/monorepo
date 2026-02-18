/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { useQuery } from "@tanstack/react-query"
import { getAddress } from "viem"
import { useChainId } from "wagmi"

import { generateX7SubgraphByChainId } from "@x7/sdk"
import type { ChainId } from "@x7/utils"
import { WETH9 } from "@x7/utils"

const PAIRS_QUERY = `
  query GetXchangePairs {
    pairCreateds(
      where: {
        factory_contains: "xchange"
      }
      orderBy: blockTimestamp
      orderDirection: desc
      first: 1000
    ) {
      id
      pair
      token0
      token1
      blockTimestamp
      factory
    }
  }
`

interface PairCreated {
  id: string
  pair: string
  token0: string
  token1: string
  blockTimestamp: string
  factory: string
}

interface CreatedPair {
  pairAddress: string
  token0: string
  token1: string
}

interface UseCreatedXchangeTokensReturn {
  data: CreatedPair[] | undefined
  isLoading: boolean
  error: Error | null
}

export function useCreatedXchangeTokens(): UseCreatedXchangeTokensReturn {
  const chainId = useChainId() as ChainId
  const subgraphUrl = chainId ? generateX7SubgraphByChainId(chainId) : null

  const { data, isLoading, error } = useQuery({
    queryKey: ["xchange-pairs", chainId],
    queryFn: async () => {
      if (!chainId || !subgraphUrl) {
        throw new Error("Chain ID is required")
      }

      const response = await fetch(subgraphUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: PAIRS_QUERY }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const { data } = await response.json()
      return data?.pairCreateds ?? []
    },
    enabled: Boolean(chainId && subgraphUrl),
  })

  const WETH_ADDRESS = WETH9[chainId].address.toLowerCase()

  const pairs = data
    ? data
        .filter(
          (pair: PairCreated) =>
            pair.token0.toLowerCase() === WETH_ADDRESS ||
            pair.token1.toLowerCase() === WETH_ADDRESS
        )
        .sort(
          (a: PairCreated, b: PairCreated) =>
            Number(b.blockTimestamp) - Number(a.blockTimestamp)
        )
        .map((pair: PairCreated) => {
          const wethAddress = getAddress(WETH_ADDRESS)
          const token0Address = getAddress(pair.token0)
          const token1Address = getAddress(pair.token1)

          const address =
            pair.token0 === wethAddress ? pair.token1 : pair.token0

          return {
            pairAddress: getAddress(pair.pair),
            address,
            token0: token0Address,
            token1: token1Address,
            timestamp: pair.blockTimestamp,
          }
        })
    : []

  return {
    data: pairs,
    isLoading,
    error,
  }
}
