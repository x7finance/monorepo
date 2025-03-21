import type { PublicClientConfig } from "viem";
import { fallback, http } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "viem/chains";

import { ChainId } from "@x7/utils";

export const config: Partial<Record<ChainId, PublicClientConfig>> = {
  [ChainId.BASE]: {
    chain: base,
    transport: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_BASE_RPC)], {
      rank: true,
    }),
  },
  [ChainId.BASE_TESTNET]: {
    chain: baseSepolia,
    transport: fallback(
      [http(process.env.NEXT_PUBLIC_DEFAULT_BASE_TESTNET_RPC)],
      {
        rank: true,
      },
    ),
  },
  [ChainId.ETHEREUM]: {
    chain: mainnet,
    transport: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_ETHER_RPC)], {
      rank: true,
    }),
  },
  [ChainId.ETHEREUM_TESTNET]: {
    chain: sepolia,
    transport: fallback(
      [http(process.env.NEXT_PUBLIC_DEFAULT_ETHER_TESTNET_RPC)],
      {
        rank: true,
      },
    ),
  },
  [ChainId.BSC]: {
    chain: bsc,
    transport: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_BSC_RPC)], {
      rank: true,
    }),
  },
  [ChainId.BSC_TESTNET]: {
    chain: bscTestnet,
    transport: fallback(
      [http(process.env.NEXT_PUBLIC_DEFAULT_BSC_TESTNET_RPC)],
      {
        rank: true,
      },
    ),
  },
  [ChainId.OPTIMISM]: {
    chain: optimism,
    transport: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_OPTI_RPC)], {
      rank: true,
    }),
  },
  [ChainId.OPTIMISM_TESTNET]: {
    chain: optimismSepolia,
    transport: fallback(
      [http(process.env.NEXT_PUBLIC_DEFAULT_OPTI_TESTNET_RPC)],
      {
        rank: true,
      },
    ),
  },
  [ChainId.ARBITRUM]: {
    chain: arbitrum,
    transport: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_ARB_RPC)], {
      rank: true,
    }),
  },
  [ChainId.ARBITRUM_TESTNET]: {
    chain: arbitrumSepolia,
    transport: fallback(
      [http(process.env.NEXT_PUBLIC_DEFAULT_ARB_TESTNET_RPC)],
      {
        rank: true,
      },
    ),
  },
  [ChainId.POLYGON]: {
    chain: polygon,
    transport: fallback([http(process.env.NEXT_PUBLIC_DEFAULT_POLY_RPC)], {
      rank: true,
    }),
  },
  [ChainId.POLYGON_TESTNET]: {
    chain: polygonAmoy,
    transport: fallback(
      [http(process.env.NEXT_PUBLIC_DEFAULT_POLY_TESTNET_RPC)],
      {
        rank: true,
      },
    ),
  },
};
