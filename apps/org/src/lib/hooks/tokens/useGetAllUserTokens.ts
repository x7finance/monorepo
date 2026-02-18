/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
"use client"

import { Alchemy, Network, TokenBalanceType } from "alchemy-sdk"
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
import { env } from "~/env.mjs"
import { log } from "~/lib/utils/log"

const NETWORK_CHEATSHEET = {
  [ChainId.ETHEREUM as number]: Network.ETH_MAINNET,
  [ChainId.ETHEREUM_TESTNET as number]: Network.ETH_SEPOLIA,
  [ChainId.BASE as number]: Network.BASE_MAINNET,
  [ChainId.BASE_TESTNET as number]: Network.BASE_SEPOLIA,
  [ChainId.ARBITRUM as number]: Network.ARB_MAINNET,
  [ChainId.ARBITRUM_TESTNET as number]: Network.ARB_SEPOLIA,
  [ChainId.BSC as number]: Network.BNB_MAINNET,
  [ChainId.BSC_TESTNET as number]: Network.BNB_TESTNET,
  [ChainId.POLYGON as number]: Network.MATIC_MAINNET,
  [ChainId.POLYGON_TESTNET as number]: Network.MATIC_AMOY,
  [ChainId.OPTIMISM as number]: Network.OPT_MAINNET,
  [ChainId.OPTIMISM_TESTNET as number]: Network.OPT_SEPOLIA,
  [ChainId.ARBITRUM as number]: Network.ARB_MAINNET,
  [ChainId.ARBITRUM_TESTNET as number]: Network.ARB_SEPOLIA,
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

      const config = {
        apiKey: `${env.NEXT_PUBLIC_ALCHEMY_ID}`,
        network: NETWORK_CHEATSHEET[chainId],
      }

      const alchemy = new Alchemy(config)
      // Get token balances with API endpoint
      const balances = await alchemy.core.getTokenBalances(address as string, {
        type: TokenBalanceType.ERC20,
        pageKey: pageKey ?? "",
      })

      const allResolved = await Promise.all(
        balances.tokenBalances.map(
          async ({ contractAddress, tokenBalance }) => {
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
                tokenBalance: fromHex(tokenBalance as `0x${string}`, "bigint"),
                liquidity: liquiditySupply,
                decimals: liquidityDecimals,
                ownership:
                  (Number(fromHex(tokenBalance as `0x${string}`, "bigint")) /
                    Number(liquiditySupply)) *
                  100,
                token0: {
                  address: token0Address!,
                  decimals: token0Decimals!,
                  symbol: token0Symb!,
                  balance: token0Balance,
                  maxShare:
                    (fromHex(tokenBalance as `0x${string}`, "bigint") *
                      token0Balance!) /
                    liquiditySupply!,
                  minimumBalance: token0MinimumBalance ?? 0n,
                  fees: token0Fees,
                },
                token1: {
                  address: token1Address!,
                  decimals: token1Decimals!,
                  symbol: token1Symb!,
                  balance: token1Balance,
                  maxShare:
                    (fromHex(tokenBalance as `0x${string}`, "bigint") *
                      token1Balance!) /
                    liquiditySupply!,
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
