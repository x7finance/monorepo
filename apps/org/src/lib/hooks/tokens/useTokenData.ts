/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { erc20Abi, formatEther, formatUnits } from "viem";
// import { getBlockNumber, getLogs } from "viem/actions";
import { useChainId, useReadContract } from "wagmi";

import { XchangeMetadataAbi } from "@x7/contracts";
import { computePairAddress, X7ContractsEnum } from "@x7/sdk";
import { chainIdToSubgraphChainName } from "@x7/smart-order-router";
import type { ChainId } from "@x7/utils";
import { Implementation, Token, WETH9 } from "@x7/utils";

import { useChainedNativePrice } from "~/lib/hooks/prices/useChainedNativePrice";
import { usePrice } from "../prices/usePrice";

const ownerAbi = [
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
] as const;

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
] as const;

function normalizeDecimals(decimals: bigint | number | undefined): number {
  if (!decimals) return 18;
  if (decimals > 100) return 18;
  return Number(decimals);
}

function formatCurrency(value: number): string {
  if (!value || Number.isNaN(value) || value === 0) return "--";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(value: number): string {
  if (!value || Number.isNaN(value) || value === 0) return "--";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercentage(value: string | number): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (!numValue || Number.isNaN(numValue)) return "--";
  return `${numValue.toFixed(2)}%`;
}

export interface TokenData {
  name: string;
  symbol: string;
  tokenOwner: `0x${string}`;
  tokenDecimals: bigint;
  normalizedDecimals: number;
  totalSupply: number;
  reserves: {
    ethReserve: string;
    tokenReserve: string;
  };
  nativePrice: string;
  marketCap: number;
  priceInNative: string;
  priceInUsd: number;
  pairAddress: `0x${string}`;
  volume24h: number;
  percentChange24h: string;
  bannerUrl?: string;
  logoUrl?: string;
  description?: string;
  twitterLink?: string;
  telegramLink?: string;
  websiteLink?: string;
  formattedPriceInUsd: string;
  formattedMarketCap: string;
  formattedVolume24h: string;
  formattedTotalSupply: string;
  formattedPercentChange24h: string;
  priceChangeColor: "text-green-500" | "text-red-500";
}

interface UseTokenDataReturn {
  data: TokenData;
  isLoading: boolean;
}

interface UseTokenDataOptions {
  skipHistoricalData?: boolean;
}

export function useTokenData(
  tokenAddress: `0x${string}`,
  options: UseTokenDataOptions = {},
): UseTokenDataReturn {
  const chainId = useChainId();
  // const client = usePublicClient();

  const { data: onChainName, isLoading: isNameLoading } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "name",
  });

  const { data: onChainSymbol, isLoading: isSymbolLoading } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: tokenOwner } = useReadContract({
    address: tokenAddress,
    abi: ownerAbi,
    functionName: "owner",
  });

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const normalizedDecimals = normalizeDecimals(tokenDecimals);

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "totalSupply",
    query: {
      select: (data: bigint) => Number(formatUnits(data, normalizedDecimals)),
    },
  });

  const ourToken = new Token({
    chainId: chainId as ChainId,
    address: tokenAddress,
    decimals: tokenDecimals ?? 0,
    symbol: onChainSymbol ?? "",
    name: onChainName ?? "",
  });

  const pairAddress = computePairAddress({
    pairType: Implementation.XCHANGE,
    tokenA: ourToken,
    tokenB: WETH9[chainId as ChainId],
  });

  const { data: reserves } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
    query: {
      select: (data) => {
        const isToken0 = ourToken.sortsBefore(WETH9[chainId as ChainId]);
        const [reserve0, reserve1] = data;

        const ethReserve = formatEther(isToken0 ? reserve1 : reserve0);
        const tokenReserve = formatUnits(
          isToken0 ? reserve0 : reserve1,
          normalizedDecimals,
        );

        return {
          ethReserve,
          tokenReserve,
        };
      },
    },
  });

  const { data: priceData } = useChainedNativePrice({
    chainId: chainId as ChainId,
  });

  const { data: tokenPrice } = usePrice({
    chainId: chainId as ChainId,
    currency: ourToken,
  });

  const nativePrice = priceData
    ? (Number(priceData) / 1e18).toFixed(2)
    : "- - -";

  const ourPriceInNative = tokenPrice ? tokenPrice.toExact() : 0;
  const ourPriceInUsd = tokenPrice
    ? Number(ourPriceInNative) * Number(nativePrice)
    : 0;

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
      if (!reserves || !totalSupply || !nativePrice) return 0;

      const priceInEth =
        Number(reserves.ethReserve) / Number(reserves.tokenReserve);
      const ethValue = priceInEth;
      const nativePriceNumber = Number(nativePrice);

      return Number(totalSupply) * ethValue * nativePriceNumber;
    },
    enabled: !!reserves && !!totalSupply && !!nativePrice,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30_000,
  });

  const { data: historicalData } = useQuery({
    queryKey: ["volume", tokenAddress, pairAddress],
    queryFn: async () => {
      const networkName = chainIdToSubgraphChainName(chainId as ChainId);

      const data = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/${networkName}/pools/${pairAddress}`,
      );
      const json = await data.json();
      return {
        volume: parseFloat(json.data?.attributes?.volume_usd?.h24) ?? 0,
        percentChange:
          json.data?.attributes?.price_change_percentage?.h24 ?? "0.00",
      };
    },
    enabled: !!pairAddress && !options.skipHistoricalData,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30_000,
  });

  const { data: metadata, isLoading: isMetadataLoading } = useReadContract({
    address: X7ContractsEnum.XchangeMetadata(chainId as ChainId),
    abi: XchangeMetadataAbi,
    functionName: "getTokenMetadata",
    args: [tokenAddress],
  });

  return {
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
      priceInNative: tokenPrice ? tokenPrice.toExact() : "0",
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
        historicalData?.percentChange ?? "0.00",
      ),
      priceChangeColor:
        parseFloat(historicalData?.percentChange ?? "0") > 0
          ? "text-green-500"
          : "text-red-500",
    },
    isLoading: isNameLoading || isSymbolLoading || isMetadataLoading,
  };
}
