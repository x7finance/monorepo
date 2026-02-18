/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import type { SupportedL1ChainId, SupportedL2ChainId } from "@x7/utils"
import { ChainId } from "@x7/utils"

import { BLOCK_EXPLORER_PREFIXES } from "../utils/getExplorerLink"

const TWENTYFIVE_MINUTES_IN_MS = 25 * 60 * 1000 // 25 minutes in milliseconds
const TEN_MINUTES_IN_MS = 10 * 60 * 1000 // 10 minutes

export enum NetworkType {
  L1,
  L2,
}
interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly bridge?: string
  readonly explorer: string
  readonly api?: string
  readonly apiKey?: string
  readonly label: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
  readonly color?: string
  readonly backgroundColor?: string
}

interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2
}

type ChainInfoMap = Partial<
  Readonly<Record<number, L1ChainInfo | L2ChainInfo>>
> &
  Partial<Record<SupportedL2ChainId, L2ChainInfo>> &
  Partial<Record<SupportedL1ChainId, L1ChainInfo>>

const CHAIN_INFO: ChainInfoMap = {
  [ChainId.ETHEREUM]: {
    networkType: NetworkType.L1,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.ETHEREUM]!,
    api: "https://api.etherscan.io/api",
    label: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "darkTheme.chain_1",
  },
  [ChainId.ETHEREUM_TESTNET]: {
    networkType: NetworkType.L1,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.ETHEREUM_TESTNET]!,
    api: "https://api-sepolia.etherscan.io/api",
    label: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SepoliaETH",
      decimals: 18,
    },
    color: "darkTheme.chain_5",
  },
  [ChainId.OPTIMISM]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: TWENTYFIVE_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.OPTIMISM]!,
    api: "https://api-optimistic.etherscan.io/api",
    label: "Optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [ChainId.OPTIMISM_TESTNET]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: TWENTYFIVE_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.OPTIMISM_TESTNET]!,
    api: "https://api-sepolia-optimistic.etherscan.io/api",
    label: "Optimism Testnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [ChainId.ARBITRUM]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.ARBITRUM]!,
    api: "https://api.arbiscan.io/api",
    label: "Arbitrum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [ChainId.ARBITRUM_TESTNET]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.ARBITRUM_TESTNET]!,
    api: "https://api-sepolia.arbiscan.io/api",
    label: "Arbitrum Testnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [ChainId.POLYGON]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.POLYGON]!,
    api: "https://api.polygonscan.com/api",
    label: "Polygon",
    nativeCurrency: { name: "Polygon Matic", symbol: "MATIC", decimals: 18 },
  },
  [ChainId.POLYGON_TESTNET]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.POLYGON_TESTNET]!,
    api: "https://api-amoy.polygonscan.com/api",
    label: "Polygon Testnet",
    nativeCurrency: {
      name: "Polygon Matic Testnet",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  [ChainId.BASE]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.BASE]!,
    api: "https://api.basescan.org/api",
    label: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [ChainId.BASE_TESTNET]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.BASE_TESTNET]!,
    api: "https://api-sepolia.basescan.org/api",
    label: "Base Sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [ChainId.BSC]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.BSC]!,
    api: "https://api.bscscan.com/api",
    label: "BNB Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
  [ChainId.BSC_TESTNET]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: TEN_MINUTES_IN_MS,
    explorer: BLOCK_EXPLORER_PREFIXES[ChainId.BSC_TESTNET]!,
    api: "https://api-testnet.bscscan.com/api",
    label: "BNB Chain Testnet",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
}

export function getChainInfo(chainId: ChainId): L1ChainInfo
export function getChainInfo(chainId: ChainId): L2ChainInfo
export function getChainInfo(chainId: ChainId): L1ChainInfo | L2ChainInfo
export function getChainInfo(
  chainId: ChainId | undefined
): L1ChainInfo | L2ChainInfo | undefined

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(chainId: ChainId | undefined) {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined
  }
  return undefined
}
