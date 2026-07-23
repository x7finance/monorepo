/* oxlint-disable @typescript-eslint/no-duplicate-enum-values */

export const ChainId = {
  ETHEREUM: 1,
  ETHEREUM_TESTNET: 11155111,
  BSC: 56,
  BSC_TESTNET: 97,
  POLYGON: 137,
  POLYGON_TESTNET: 80002,
  ARBITRUM: 42161,
  ARBITRUM_TESTNET: 421614,
  OPTIMISM: 10,
  OPTIMISM_TESTNET: 11155420,
  BASE: 8453,
  BASE_TESTNET: 84532,
} as const

export type ChainId = (typeof ChainId)[keyof typeof ChainId]

export type ActiveChainId =
  | typeof ChainId.BASE
  | typeof ChainId.ETHEREUM
  | typeof ChainId.BSC
  | typeof ChainId.POLYGON
  | typeof ChainId.ARBITRUM
  | typeof ChainId.OPTIMISM
  | typeof ChainId.ETHEREUM_TESTNET
  | typeof ChainId.BSC_TESTNET
  | typeof ChainId.POLYGON_TESTNET
  | typeof ChainId.ARBITRUM_TESTNET
  | typeof ChainId.OPTIMISM_TESTNET
  | typeof ChainId.BASE_TESTNET

export const TESTNET_CHAIN_IDS = [
  ChainId.ETHEREUM_TESTNET,
  ChainId.ARBITRUM_TESTNET,
  ChainId.OPTIMISM_TESTNET,
  ChainId.BSC_TESTNET,
  ChainId.POLYGON_TESTNET,
  ChainId.BASE_TESTNET,
] as const

export type TestnetChainId = (typeof TESTNET_CHAIN_IDS)[number]

export const ChainNameKey = {
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.ARBITRUM_TESTNET]: "arbitrum-testnet",
  [ChainId.BSC]: "bsc",
  [ChainId.BSC_TESTNET]: "bsc-testnet",
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.ETHEREUM_TESTNET]: "ethereum-testnet",
  [ChainId.POLYGON]: "polygon",
  [ChainId.POLYGON_TESTNET]: "matic-testnet",
  [ChainId.OPTIMISM]: "optimism",
  [ChainId.BASE]: "base",
  [ChainId.BASE_TESTNET]: "base-testnet",
} as const
export type ChainNameKey = (typeof ChainNameKey)[keyof typeof ChainNameKey]

export const L1_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.ETHEREUM_TESTNET,
  ChainId.POLYGON,
  ChainId.POLYGON_TESTNET,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
] as const

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_TESTNET,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.OPTIMISM,
  ChainId.OPTIMISM_TESTNET,
] as const

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number]

export const XCHANGE_V2_SUPPORTED_CHAIN_IDS = [
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.ETHEREUM,
  ChainId.ETHEREUM_TESTNET,
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_TESTNET,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.OPTIMISM,
  ChainId.OPTIMISM_TESTNET,
  ChainId.POLYGON,
  ChainId.POLYGON_TESTNET,
]

export function generateChainIdByName(chain: ChainShortNameType): ChainId {
  switch (chain) {
    case ChainShortNameEnum.eth:
      return ChainId.ETHEREUM
    case ChainShortNameEnum.eth_testnet:
      return ChainId.ETHEREUM_TESTNET
    case ChainShortNameEnum.bsc:
      return ChainId.BSC
    case ChainShortNameEnum.polygon:
      return ChainId.POLYGON
    case ChainShortNameEnum.arbitrum:
      return ChainId.ARBITRUM
    case ChainShortNameEnum.optimism:
      return ChainId.OPTIMISM
    case ChainShortNameEnum.base:
      return ChainId.BASE
    case ChainShortNameEnum.base_testnet:
      return ChainId.BASE_TESTNET
    default:
      return ChainId.ETHEREUM
  }
}

export enum ChainNameEnum {
  eth = "Ethereum",
  bsc = "BSC",
  optimism = "Optimism",
  arbitrum = "Arbitrum",
  polygon = "Polygon",
  base = "Base",
  base_testnet = "Base-Sepolia",
  eth_testnet = "Ethereum-Sepolia",
}

export enum ChainDenominationEnum {
  base = "ETH",
  eth = "ETH",
  bsc = "BNB",
  optimism = "ETH",
  arbitrum = "ETH",
  polygon = "MATIC",
}

export enum ChainShortNameEnum {
  eth = "eth",
  bsc = "bsc",
  optimism = "opti",
  arbitrum = "arb",
  polygon = "polygon",
  base = "base",
  base_testnet = "base-testnet",
  eth_testnet = "eth-testnet",
}

export type ChainShortNameType =
  | ChainShortNameEnum.eth
  | ChainShortNameEnum.bsc
  | ChainShortNameEnum.arbitrum
  | ChainShortNameEnum.optimism
  | ChainShortNameEnum.polygon
  | ChainShortNameEnum.base
  | ChainShortNameEnum.base_testnet
  | ChainShortNameEnum.eth_testnet

export enum ChainIdentifierEnum {
  eth = "eth",
  eth_testnet = "eth_testnet",
  bsc = "bsc",
  bsc_testnet = "bsc_testnet",
  optimism = "optimism",
  optimism_testnet = "optimism_testnet",
  arbitrum = "arbitrum",
  arbitrum_testnet = "arbitrum_testnet",
  polygon = "polygon",
  polygon_testnet = "polygon_testnet",
  base = "base",
  base_testnet = "base_testnet",
}

export enum ChainScannerEnum {
  eth = "etherscan",
  bsc = "bscscan",
  optimism = "optiscan",
  arbitrum = "arbiscan",
  polygon = "polygonscan",
  base = "basescan",
  base_testnet = "basescan",
}

export enum ChainAlchemyLinksEnum {
  eth = "https://eth-mainnet.g.alchemy.com/v2/",
  eth_testnet = "https://eth-sepolia.g.alchemy.com/v2/",
  bsc = "https://bnb-mainnet.g.alchemy.com/v2/",
  bsc_testnet = "https://bnb-testnet.g.alchemy.com/v2/",
  optimism = "https://opt-mainnet.g.alchemy.com/v2/",
  optimism_testnet = "https://opt-sepolia.g.alchemy.com/v2/",
  arbitrum = "https://arb-mainnet.g.alchemy.com/v2/",
  arbitrum_testnet = "https://arb-sepolia.g.alchemy.com/v2/",
  polygon = "https://polygon-mainnet.g.alchemy.com/v2",
  polygon_amoy = "https://polygon-amoy.g.alchemy.com/v2/",
  base = "https://base-mainnet.g.alchemy.com/v2/",
  base_testnet = "https://base-sepolia.g.alchemy.com/v2/",
}

export enum ChainTokenOracleEtherUSDEnum {
  eth = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  bsc = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee",
  optimism = "0x13e3ee699d1909e989722e753853ae30b17e08c5",
  arbitrum = "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
  polygon = "0xab594600376ec9fd91f8e885dadf0ce036862de0",
  base = "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
  eth_testnet = "0x000000000000000000000000000000000000dEaD",
}

export const NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.POLYGON_TESTNET,
]

export const V2_SUPPORTED = [
  ChainId.ETHEREUM,
  ChainId.ETHEREUM_TESTNET,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
]

export const HAS_L1_FEE: ChainId[] = [
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_TESTNET,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
]
