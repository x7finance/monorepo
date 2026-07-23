/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
"use client"

import { useEffect, useState } from "react"
import type { Abi } from "viem"
import { fromHex } from "viem"

import {
  erc20Abi,
  tokenFeeDetectorABI,
  XChangeFactoryABI,
  XChangeV2PairAbi,
} from "@x7/contracts"
import {
  FACTORY_ADDRESSES,
  PAIR_INIT_HASH,
  WETH_ADDRESS,
  X7ContractsEnum,
} from "@x7/sdk"
import type { ViemProviderType } from "@x7/smart-order-router"
import { ChainId, Implementation, LogCodes, Protocol } from "@x7/utils"
import { env } from "~/env"
import { log } from "~/lib/utils/log"

// Alchemy network subdomains (mirrors the alchemy-sdk `Network` enum values).
// Used to build the JSON-RPC endpoint directly, avoiding the full alchemy-sdk
// dependency (which pulls in ethers v5, axios, and @solana/web3.js).
const NETWORK_CHEATSHEET: Record<number, string> = {
  [ChainId.ETHEREUM]: "eth-mainnet",
  [ChainId.ETHEREUM_TESTNET]: "eth-sepolia",
  [ChainId.BASE]: "base-mainnet",
  [ChainId.BASE_TESTNET]: "base-sepolia",
  [ChainId.ARBITRUM]: "arb-mainnet",
  [ChainId.ARBITRUM_TESTNET]: "arb-sepolia",
  [ChainId.BSC]: "bnb-mainnet",
  [ChainId.BSC_TESTNET]: "bnb-testnet",
  [ChainId.POLYGON]: "polygon-mainnet",
  [ChainId.POLYGON_TESTNET]: "polygon-amoy",
  [ChainId.OPTIMISM]: "opt-mainnet",
  [ChainId.OPTIMISM_TESTNET]: "opt-sepolia",
}

interface AlchemyTokenBalance {
  contractAddress: string
  tokenBalance: string | null
}

interface AlchemyTokenBalancesResult {
  tokenBalances: AlchemyTokenBalance[]
  pageKey?: string
}

/**
 * Fetches ERC-20 token balances via Alchemy's `alchemy_getTokenBalances`
 * JSON-RPC method. Direct replacement for `alchemy.core.getTokenBalances`
 * with `TokenBalanceType.ERC20` + pagination — same request, same response
 * shape — without the alchemy-sdk bundle.
 */
async function fetchErc20TokenBalances(
  subdomain: string,
  apiKey: string,
  address: string,
  pageKey?: string
): Promise<AlchemyTokenBalancesResult> {
  const response = await fetch(
    `https://${subdomain}.g.alchemy.com/v2/${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: pageKey ? [address, "erc20", { pageKey }] : [address, "erc20"],
      }),
    }
  )

  const json = (await response.json()) as {
    result?: AlchemyTokenBalancesResult
    error?: { message: string }
  }

  if (json.error) {
    throw new Error(json.error.message)
  }

  return json.result ?? { tokenBalances: [] }
}

export interface LiquidityFees {
  token0: FeeBips
  token1: FeeBips
}

export interface FeeBips {
  buyFeeBps: bigint
  sellFeeBps: bigint
}

export interface UserPositionsResponse {
  contractAddress: `0x${string}`
  tokenBalance: bigint | undefined
  liquidity: bigint | undefined
  decimals: number | undefined
  ownership: number
  token0: {
    address: `0x${string}`
    decimals: number
    symbol: string
    balance: bigint | undefined
    maxShare: bigint
    minimumBalance: bigint
    fees: FeeBips
  }
  token1: {
    address: `0x${string}`
    decimals: number
    symbol: string
    balance: bigint | undefined
    maxShare: bigint
    minimumBalance: bigint
    fees: FeeBips
  }
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export const useAllLiquidityPositions = (
  address: `0x${string}` | undefined,
  chainId: ChainId | undefined,
  publicClient: ViemProviderType
): { pairs: UserPositionsResponse[]; isLoading: boolean } => {
  const [pairs, setPairs] = useState<UserPositionsResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPairsInWallet = async (
      existing: UserPositionsResponse[] = [],
      pageKey?: string
    ): Promise<UserPositionsResponse[]> => {
      if (!address || !chainId) {
        return existing
      }

      const subdomain = NETWORK_CHEATSHEET[chainId]
      if (!subdomain) {
        return existing
      }

      // Get token balances via Alchemy's JSON-RPC endpoint
      const balances = await fetchErc20TokenBalances(
        subdomain,
        `${env.NEXT_PUBLIC_ALCHEMY_ID}`,
        address as string,
        pageKey
      )

      const allResolved = await Promise.all(
        balances.tokenBalances.map(
          async ({ contractAddress, tokenBalance }) => {
            const tokenBalanceHex = (tokenBalance ?? "0x0") as `0x${string}`
            const isPair = await publicClient.readContract({
              abi: XChangeFactoryABI as Abi,
              address: X7ContractsEnum.XchangeFactory,
              functionName: "isPair",
              args: [contractAddress as `0x${string}`],
            })

            if (isPair) {
              const [
                { result: token0Address },
                { result: token1Address },
                { result: liquiditySupply },
                { result: liquidityDecimals },
              ] = await publicClient.multicall({
                contracts: [
                  {
                    abi: XChangeV2PairAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: "token0",
                  },
                  {
                    abi: XChangeV2PairAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: "token1",
                  },
                  {
                    abi: XChangeV2PairAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: "totalSupply",
                  },
                  {
                    abi: XChangeV2PairAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: "decimals",
                  },
                ],
              })

              const [
                { result: token0MinimumBalance },
                { result: token1MinimumBalance },
              ] = await publicClient.multicall({
                contracts: [
                  {
                    abi: XChangeV2PairAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: "tokenMinimumBalance",
                    args: [token0Address!],
                  },
                  {
                    abi: XChangeV2PairAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: "tokenMinimumBalance",
                    args: [token1Address!],
                  },
                ],
              })

              const [
                { result: token0Symb },
                { result: token1Symb },
                { result: token0Decimals },
                { result: token1Decimals },
                { result: token0Balance },
                { result: token1Balance },
              ] = await publicClient.multicall({
                contracts: [
                  {
                    abi: erc20Abi,
                    address: token0Address!,
                    functionName: "symbol",
                  },
                  {
                    abi: erc20Abi,
                    address: token1Address!,
                    functionName: "symbol",
                  },
                  {
                    abi: erc20Abi,
                    address: token0Address!,
                    functionName: "decimals",
                  },
                  {
                    abi: erc20Abi,
                    address: token1Address!,
                    functionName: "decimals",
                  },
                  {
                    abi: erc20Abi,
                    address: token0Address!,
                    functionName: "balanceOf",
                    args: [contractAddress as `0x${string}`],
                  },
                  {
                    abi: erc20Abi,
                    address: token1Address!,
                    functionName: "balanceOf",
                    args: [contractAddress as `0x${string}`],
                  },
                ],
              })

              let token0Fees: FeeBips, token1Fees: FeeBips
              try {
                const { result: feeResultToken0 } =
                  await publicClient.simulateContract({
                    address:
                      `0xd6A4A63d001c60C440297618578071a6F30E577A` as `0x${string}`,
                    abi: tokenFeeDetectorABI,
                    functionName: "validate",
                    args: [
                      {
                        token: token0Address!,
                        baseToken: WETH_ADDRESS(chainId),
                        amountToBorrow: BigInt(100000),
                        factory:
                          // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          FACTORY_ADDRESSES[chainId][Implementation.XCHANGE][
                            Protocol.V2
                          ],
                        initCodeHash:
                          // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          PAIR_INIT_HASH[chainId][Implementation.XCHANGE][
                            Protocol.V2
                          ],
                      },
                    ],
                  })
                token0Fees = feeResultToken0
              } catch (error) {
                log.error(
                  LogCodes.FAIL,
                  `Failed to get Token0 Fees`,
                  `${error}`
                )

                token0Fees = { sellFeeBps: 0n, buyFeeBps: 0n }
              }
              try {
                const { result: feeResultToken1 } =
                  await publicClient.simulateContract({
                    address:
                      `0xd6A4A63d001c60C440297618578071a6F30E577A` as `0x${string}`,
                    abi: tokenFeeDetectorABI,
                    functionName: "validate",
                    args: [
                      {
                        token: token1Address!,
                        baseToken: WETH_ADDRESS(chainId),
                        amountToBorrow: BigInt(100000),
                        factory:
                          // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          FACTORY_ADDRESSES[chainId][Implementation.XCHANGE][
                            Protocol.V2
                          ],

                        initCodeHash:
                          // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          PAIR_INIT_HASH[chainId][Implementation.XCHANGE][
                            Protocol.V2
                          ],
                      },
                    ],
                  })
                token1Fees = feeResultToken1
              } catch (error) {
                log.error(
                  LogCodes.FAIL,
                  `Failed to get Token1 Fees`,
                  `${error}`
                )

                token1Fees = { sellFeeBps: 0n, buyFeeBps: 0n }
              }

              return {
                contractAddress: contractAddress as `0x${string}`,
                tokenBalance: fromHex(tokenBalanceHex, "bigint"),
                liquidity: liquiditySupply,
                decimals: liquidityDecimals,
                ownership:
                  Number(liquiditySupply) > 0
                    ? (Number(fromHex(tokenBalanceHex, "bigint")) /
                        Number(liquiditySupply)) *
                      100
                    : 0,
                token0: {
                  address: token0Address!,
                  decimals: token0Decimals!,
                  symbol: token0Symb!,
                  balance: token0Balance,
                  maxShare:
                    token0Balance && liquiditySupply
                      ? (fromHex(tokenBalanceHex, "bigint") * token0Balance) /
                        liquiditySupply
                      : 0n,
                  minimumBalance: token0MinimumBalance ?? 0n,
                  fees: token0Fees,
                },
                token1: {
                  address: token1Address!,
                  decimals: token1Decimals!,
                  symbol: token1Symb!,
                  balance: token1Balance,
                  maxShare:
                    token1Balance && liquiditySupply
                      ? (fromHex(tokenBalanceHex, "bigint") * token1Balance) /
                        liquiditySupply
                      : 0n,
                  minimumBalance: token1MinimumBalance ?? 0n,
                  fees: token1Fees,
                },
              } as UserPositionsResponse
            }

            return undefined
          }
        )
      )

      const newPairs = [
        ...existing,
        ...allResolved.filter(
          (item): item is UserPositionsResponse => item !== undefined
        ),
      ]

      if (balances.pageKey) {
        return fetchPairsInWallet(newPairs, balances.pageKey)
      } else {
        return newPairs
      }
    }

    const loadPairs = async () => {
      setIsLoading(true)
      try {
        const allPairs = await fetchPairsInWallet()
        setPairs(allPairs)
      } catch (error) {
        log.error(LogCodes.FAIL, "Error fetching liquidity positions:", {
          error,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void loadPairs()
  }, [address, chainId, publicClient])

  return { pairs, isLoading }
}
