/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { erc20Abi, formatEther, formatUnits } from "viem"
import { useChainId, useReadContract, useReadContracts } from "wagmi"

import { XchangeMetadataAbi } from "@x7/contracts"
import { computePairAddress, X7ContractsEnum } from "@x7/sdk"
import { chainIdToSubgraphChainName } from "@x7/smart-order-router"
import type { ChainId } from "@x7/utils"
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  Implementation,
  Token,
  WETH9,
} from "@x7/utils"
import { useChainedNativePrice } from "~/lib/hooks/prices/useChainedNativePrice"
import { CACHE_TIERS, TIME } from "~/lib/query"

import { usePrice } from "../prices/usePrice"

const ownerAbi = [
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
] as const

const pairAbi = [
  {
    name: "getReserves",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "reserve0", type: "uint112" },
      { name: "reserve1", type: "uint112" },
      { name: "blockTimestampLast", type: "uint32" },
    ],
  },
  {
    name: "token0",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "Swap",
    type: "event",
    inputs: [
      { indexed: true, type: "address", name: "sender" },
      { type: "uint256", name: "amount0In" },
      { type: "uint256", name: "amount1In" },
      { type: "uint256", name: "amount0Out" },
      { type: "uint256", name: "amount1Out" },
      { indexed: true, type: "address", name: "to" },
    ],
  },
] as const

function normalizeDecimals(decimals: bigint | number | undefined): number {
  if (!decimals) return 18
  if (decimals > 100) return 18
  return Number(decimals)
}

export interface TokenData {
  name: string
  symbol: string
  tokenOwner: `0x${string}`
  tokenDecimals: bigint
  normalizedDecimals: number
  totalSupply: number
  reserves: {
    ethReserve: string
    tokenReserve: string
  }
  nativePrice: string
  marketCap: number
  priceInNative: string
  priceInUsd: number
  pairAddress: `0x${string}`
  volume24h: number
  percentChange24h: string
  bannerUrl?: string
  logoUrl?: string
  description?: string
  twitterLink?: string
  telegramLink?: string
  websiteLink?: string
  formattedPriceInUsd: string
  formattedMarketCap: string
  formattedVolume24h: string
  formattedTotalSupply: string
  formattedPercentChange24h: string
  priceChangeColor: "text-green-500" | "text-red-500"
}

interface UseTokenDataReturn {
  data: TokenData
  isLoading: boolean
}

interface UseTokenDataOptions {
  skipHistoricalData?: boolean
}

export function useTokenData(
  tokenAddress: `0x${string}`,
  options: UseTokenDataOptions = {}
): UseTokenDataReturn {
  const chainId = useChainId()
  // const client = usePublicClient();

  // Batch the independent static-metadata reads on the same token contract into a
  // single multicall (previously 5 separate useReadContract round-trips).
  const { data: staticData, isLoading: isStaticLoading } = useReadContracts({
    contracts: [
      { address: tokenAddress, abi: erc20Abi, functionName: "name" },
      { address: tokenAddress, abi: erc20Abi, functionName: "symbol" },
      { address: tokenAddress, abi: ownerAbi, functionName: "owner" },
      { address: tokenAddress, abi: erc20Abi, functionName: "decimals" },
      { address: tokenAddress, abi: erc20Abi, functionName: "totalSupply" },
    ],
  })

  const onChainName = staticData?.[0]?.result
  const onChainSymbol = staticData?.[1]?.result
  const tokenOwner = staticData?.[2]?.result
  const tokenDecimals = staticData?.[3]?.result
  const rawTotalSupply = staticData?.[4]?.result

  const normalizedDecimals = normalizeDecimals(tokenDecimals)

  // Preserve the per-call `select` that formatted totalSupply into a decimal-adjusted number.
  const totalSupply =
    rawTotalSupply === undefined
      ? undefined
      : Number(formatUnits(rawTotalSupply, normalizedDecimals))

  const ourToken = new Token({
    chainId: chainId as ChainId,
    address: tokenAddress,
    decimals: tokenDecimals ?? 0,
    symbol: onChainSymbol ?? "",
    name: onChainName ?? "",
  })

  const pairAddress = computePairAddress({
    pairType: Implementation.XCHANGE,
    tokenA: ourToken,
    tokenB: WETH9[chainId as ChainId],
  })

  const { data: reserves } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
    query: {
      select: (data) => {
        const isToken0 = ourToken.sortsBefore(WETH9[chainId as ChainId])
        const [reserve0, reserve1] = data

        const ethReserve = formatEther(isToken0 ? reserve1 : reserve0)
        const tokenReserve = formatUnits(
          isToken0 ? reserve0 : reserve1,
          normalizedDecimals
        )

        return {
          ethReserve,
          tokenReserve,
        }
      },
    },
  })

  const { data: priceData } = useChainedNativePrice({
    chainId: chainId as ChainId,
  })

  const { data: tokenPrice } = usePrice({
    chainId: chainId as ChainId,
    currency: ourToken,
  })

  const nativePrice = priceData
    ? (Number(priceData) / 1e18).toFixed(2)
    : "- - -"

  const ourPriceInNative = tokenPrice ? tokenPrice.toExact() : 0
  const nativePriceNumber = Number(nativePrice)
  const ourPriceInUsd =
    tokenPrice && Number.isFinite(nativePriceNumber)
      ? Number(ourPriceInNative) * nativePriceNumber
      : 0

  const { data: marketCap } = useQuery({
    queryKey: [
      "marketCap",
      tokenAddress,
      totalSupply?.toString(),
      reserves && {
        ethReserve: reserves.ethReserve,
        tokenReserve: reserves.tokenReserve,
      },
      nativePrice,
    ],
    queryFn: () => {
      if (!reserves || !totalSupply || !nativePrice) return 0

      const nativePriceValue = Number(nativePrice)
      const tokenReserveValue = Number(reserves.tokenReserve)
      // Guard the "- - -" native-price sentinel (→ NaN) and empty pools (÷0 → Infinity).
      if (!Number.isFinite(nativePriceValue) || tokenReserveValue === 0) {
        return 0
      }

      const priceInEth = Number(reserves.ethReserve) / tokenReserveValue

      return Number(totalSupply) * priceInEth * nativePriceValue
    },
    enabled: !!reserves && !!totalSupply && !!nativePrice,
    refetchInterval: 30 * TIME.SECOND,
    ...CACHE_TIERS.DYNAMIC,
  })

  const { data: historicalData } = useQuery({
    queryKey: ["volume", tokenAddress, pairAddress],
    queryFn: async () => {
      const networkName = chainIdToSubgraphChainName(chainId as ChainId)

      const data = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/${networkName}/pools/${pairAddress}`
      )
      const json = await data.json()
      // parseFloat(undefined) is NaN, and `NaN ?? 0` stays NaN — guard explicitly.
      const volume = parseFloat(json.data?.attributes?.volume_usd?.h24)
      return {
        volume: Number.isFinite(volume) ? volume : 0,
        percentChange:
          json.data?.attributes?.price_change_percentage?.h24 ?? "0.00",
      }
    },
    enabled: !!pairAddress && !options.skipHistoricalData,
    refetchInterval: 30 * TIME.SECOND,
    ...CACHE_TIERS.DYNAMIC,
  })

  const { data: metadata, isLoading: isMetadataLoading } = useReadContract({
    address: X7ContractsEnum.XchangeMetadata(chainId as ChainId),
    abi: XchangeMetadataAbi,
    functionName: "getTokenMetadata",
    args: [tokenAddress],
  })

  const priceInNative = tokenPrice ? tokenPrice.toExact() : "0"

  return useMemo<UseTokenDataReturn>(
    () => ({
      data: {
        name: onChainName ?? "",
        symbol: onChainSymbol ?? "",
        tokenOwner: tokenOwner ?? "0x0000000000000000000000000000000000000000",
        tokenDecimals: BigInt(tokenDecimals ?? 0),
        normalizedDecimals,
        totalSupply: totalSupply ?? 0,
        reserves: reserves ?? {
          ethReserve: "0",
          tokenReserve: "0",
        },
        nativePrice,
        marketCap: marketCap ?? 0,
        priceInNative,
        priceInUsd: ourPriceInUsd,
        pairAddress,
        volume24h: historicalData?.volume ?? 0,
        percentChange24h: historicalData?.percentChange ?? "0.00",
        bannerUrl: metadata?.bannerUri ?? "/images/placeholder/moon.webp",
        logoUrl: metadata?.tokenUri ?? "/images/placeholder/moon.webp",
        description: metadata?.description ?? "Description",
        twitterLink: metadata?.twitterLink ?? "",
        telegramLink: metadata?.telegramLink ?? "",
        websiteLink: metadata?.websiteLink ?? "",
        formattedPriceInUsd: formatCurrency(ourPriceInUsd),
        formattedMarketCap: formatCurrency(marketCap ?? 0),
        formattedVolume24h: formatCurrency(historicalData?.volume ?? 0),
        formattedTotalSupply: `${formatNumber(totalSupply ?? 0)}`,
        formattedPercentChange24h: formatPercentage(
          historicalData?.percentChange ?? "0.00"
        ),
        priceChangeColor:
          parseFloat(historicalData?.percentChange ?? "0") > 0
            ? "text-green-500"
            : "text-red-500",
      },
      isLoading: isStaticLoading || isMetadataLoading,
    }),
    [
      onChainName,
      onChainSymbol,
      tokenOwner,
      tokenDecimals,
      normalizedDecimals,
      totalSupply,
      reserves,
      nativePrice,
      marketCap,
      priceInNative,
      ourPriceInUsd,
      pairAddress,
      historicalData,
      metadata,
      isStaticLoading,
      isMetadataLoading,
    ]
  )
}
