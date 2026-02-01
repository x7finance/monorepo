/* oxlint-disable no-restricted-properties */
/* oxlint-disable turbo/no-undeclared-env-vars */
import type { CreateConfigParameters } from "@wagmi/core"
import type { Chain, Transport } from "viem"

import { createConfig, fallback, http } from "@wagmi/core"
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  foundry,
  hardhat,
  localhost,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "@wagmi/core/chains"

import { ChainId } from "@x7/utils"
import { env } from "~/env.mjs"

const productionChains = [base, mainnet, polygon, optimism, arbitrum, bsc]
const testnetChains = [
  sepolia,
  baseSepolia,
  bscTestnet,
  arbitrumSepolia,
  optimismSepolia,
  polygonAmoy,
]

export const web3Config: CreateConfigParameters<
  readonly [Chain, ...Chain[]],
  Record<number, Transport>
> = {
  chains: [
    base,
    ...(process.env.NODE_ENV === "development"
      ? [
          ...productionChains.filter((chain) => chain !== base),
          ...testnetChains,
        ]
      : productionChains.filter((chain) => chain !== base)),
  ],
  transports:
    process.env.NODE_ENV === "development"
      ? {
          [mainnet.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_ETHER_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_ETHER_RPC_FALLBACK),
          ]),
          [base.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_BASE_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_BASE_RPC_FALLBACK),
          ]),
          [bsc.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_BSC_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_BSC_RPC_FALLBACK),
          ]),
          [polygon.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_POLY_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_POLY_RPC_FALLBACK),
          ]),
          [optimism.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_OPTI_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_OPTI_RPC_FALLBACK),
          ]),
          [arbitrum.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_ARB_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_ARB_RPC_FALLBACK),
          ]),
          [sepolia.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_ETHER_TESTNET_RPC),
          ]),
          [baseSepolia.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_BASE_TESTNET_RPC),
          ]),
          [bscTestnet.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_BSC_TESTNET_RPC),
          ]),
          [arbitrumSepolia.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_ARB_TESTNET_RPC),
          ]),
          [optimismSepolia.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_OPTI_TESTNET_RPC),
          ]),
          [polygonAmoy.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_POLY_TESTNET_RPC),
          ]),
        }
      : {
          [mainnet.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_ETHER_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_ETHER_RPC_FALLBACK),
          ]),
          [base.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_BASE_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_BASE_RPC_FALLBACK),
          ]),
          [bsc.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_BSC_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_BSC_RPC_FALLBACK),
          ]),
          [polygon.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_POLY_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_POLY_RPC_FALLBACK),
          ]),
          [optimism.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_OPTI_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_OPTI_RPC_FALLBACK),
          ]),
          [arbitrum.id]: fallback([
            http(env.NEXT_PUBLIC_DEFAULT_ARB_RPC),
            http(env.NEXT_PUBLIC_DEFAULT_ARB_RPC_FALLBACK),
          ]),
        },
  ssr: true,
}

export const baseConfig = createConfig(web3Config)

export const defaultChains: Chain[] =
  process.env.NODE_ENV === "development"
    ? [foundry, hardhat, localhost, ...productionChains, ...testnetChains]
    : productionChains

export const otherChains: Chain[] = [
  {
    id: ChainId.BSC,
    name: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://bsc-dataseed1.binance.org"],
      },
      public: {
        http: ["https://bsc-dataseed1.binance.org"],
      },
    },
    blockExplorers: {
      etherscan: {
        name: "Bscscan",
        url: "https://bscscan.com",
      },
      default: {
        name: "Bscscan",
        url: "https://bscscan.com",
      },
    },
    contracts: {
      multicall3: {
        address: "0xcA11bde05977b3631167028862bE2a173976CA11",
        blockCreated: 15921452,
      },
    },
  },
]

export const allChains = [...defaultChains, ...otherChains]
