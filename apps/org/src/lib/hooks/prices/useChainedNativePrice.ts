/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http } from "viem";
import { arbitrum, base, bsc, mainnet, optimism, polygon } from "viem/chains";

import type { ChainId } from "@x7/utils";
import { LogCodes } from "@x7/utils";

import { log } from "~/lib/utils/log";

interface UseChainedNativePrice {
  chainId: ChainId;
}

// Chainlink Price Feed addresses for different networks
const PRICE_FEEDS = {
  1: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD Mainnet
  8453: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // ETH/USD Base
  10: "0x13e3Ee699D1909E989722E753853AE30b17e08c5", // ETH/USD Optimism
  42161: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", // ETH/USD Arbitrum
  56: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE", // BNB/USD BSC
  137: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0", // MATIC/USD Polygon
} as const;

// Chain configurations
const CHAIN_CONFIG = {
  1: mainnet,
  8453: base,
  10: optimism,
  42161: arbitrum,
  56: bsc,
  137: polygon,
} as const;

const CHAINLINK_ABI = [
  {
    inputs: [],
    name: "latestAnswer",
    outputs: [{ type: "int256", name: "" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const useChainedNativePrice = ({ chainId }: UseChainedNativePrice) => {
  return useQuery({
    queryKey: [`${chainId}-native-price`],
    queryFn: async () => {
      try {
        const priceFeed = PRICE_FEEDS[chainId as keyof typeof PRICE_FEEDS];
        const chain = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];

        if (!priceFeed || !chain) {
          log.error(
            LogCodes.FETCHING_QUOTES,
            `Unsupported chain ID: ${chainId}`,
          );
          return 0n;
        }

        const client = createPublicClient({
          chain,
          transport: http(),
        });

        const result = await client.readContract({
          address: priceFeed,
          abi: CHAINLINK_ABI,
          functionName: "latestAnswer",
        });

        // Chainlink prices come with 8 decimals, convert to 18 decimals
        return BigInt(result) * 10n ** 10n;
      } catch (error) {
        log.error(
          LogCodes.FETCHING_QUOTES,
          "Error fetching native price:",
          error,
        );
        return 0n;
      }
    },
    staleTime: 300000, // 5 mins
    gcTime: 3600000, // 1hr
    refetchOnWindowFocus: true,
  });
};
