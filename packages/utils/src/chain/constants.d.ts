export declare const ChainId: {
    readonly ETHEREUM: 1;
    readonly ETHEREUM_TESTNET: 11155111;
    readonly BSC: 56;
    readonly BSC_TESTNET: 97;
    readonly POLYGON: 137;
    readonly POLYGON_TESTNET: 80002;
    readonly ARBITRUM: 42161;
    readonly ARBITRUM_TESTNET: 421614;
    readonly OPTIMISM: 10;
    readonly OPTIMISM_TESTNET: 11155420;
    readonly BASE: 8453;
    readonly BASE_TESTNET: 84532;
};
export type ChainId = (typeof ChainId)[keyof typeof ChainId];
export type ActiveChainId = typeof ChainId.BASE | typeof ChainId.ETHEREUM | typeof ChainId.BSC | typeof ChainId.POLYGON | typeof ChainId.ARBITRUM | typeof ChainId.OPTIMISM | typeof ChainId.ETHEREUM_TESTNET | typeof ChainId.BSC_TESTNET | typeof ChainId.POLYGON_TESTNET | typeof ChainId.ARBITRUM_TESTNET | typeof ChainId.OPTIMISM_TESTNET | typeof ChainId.BASE_TESTNET;
export declare const TESTNET_CHAIN_IDS: readonly [11155111, 421614, 11155420, 97, 80002, 84532];
export type TestnetChainId = (typeof TESTNET_CHAIN_IDS)[number];
export declare const ChainNameKey: {
    readonly 42161: "arbitrum";
    readonly 421614: "arbitrum-testnet";
    readonly 56: "bsc";
    readonly 97: "bsc-testnet";
    readonly 1: "ethereum";
    readonly 11155111: "ethereum-testnet";
    readonly 137: "polygon";
    readonly 80002: "matic-testnet";
    readonly 10: "optimism";
    readonly 8453: "base";
    readonly 84532: "base-testnet";
};
export type ChainNameKey = (typeof ChainNameKey)[keyof typeof ChainNameKey];
export declare const L1_CHAIN_IDS: readonly [1, 11155111, 137, 80002, 56, 97];
export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number];
/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export declare const L2_CHAIN_IDS: readonly [42161, 421614, 8453, 84532, 10, 11155420];
export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];
export declare const XCHANGE_V2_SUPPORTED_CHAIN_IDS: (1 | 10 | 56 | 97 | 137 | 8453 | 42161 | 80002 | 84532 | 421614 | 11155111 | 11155420)[];
export declare function generateChainIdByName(chain: ChainShortNameType): ChainId;
export declare enum ChainNameEnum {
    eth = "Ethereum",
    bsc = "BSC",
    optimism = "Optimism",
    arbitrum = "Arbitrum",
    polygon = "Polygon",
    base = "Base",
    base_testnet = "Base-Sepolia",
    eth_testnet = "Ethereum-Sepolia"
}
export declare enum ChainDenominationEnum {
    base = "ETH",
    eth = "ETH",
    bsc = "BNB",
    optimism = "ETH",
    arbitrum = "ETH",
    polygon = "MATIC"
}
export declare enum ChainShortNameEnum {
    eth = "eth",
    bsc = "bsc",
    optimism = "opti",
    arbitrum = "arb",
    polygon = "polygon",
    base = "base",
    base_testnet = "base-testnet",
    eth_testnet = "eth-testnet"
}
export type ChainShortNameType = ChainShortNameEnum.eth | ChainShortNameEnum.bsc | ChainShortNameEnum.arbitrum | ChainShortNameEnum.optimism | ChainShortNameEnum.polygon | ChainShortNameEnum.base | ChainShortNameEnum.base_testnet | ChainShortNameEnum.eth_testnet;
export declare enum ChainIdentifierEnum {
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
    base_testnet = "base_testnet"
}
export declare enum ChainScannerEnum {
    eth = "etherscan",
    bsc = "bscscan",
    optimism = "optiscan",
    arbitrum = "arbiscan",
    polygon = "polygonscan",
    base = "basescan",
    base_testnet = "basescan"
}
export declare enum ChainAlchemyLinksEnum {
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
    base_testnet = "https://base-sepolia.g.alchemy.com/v2/"
}
export declare enum ChainTokenOracleEtherUSDEnum {
    eth = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    bsc = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee",
    optimism = "0x13e3ee699d1909e989722e753853ae30b17e08c5",
    arbitrum = "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
    polygon = "0xab594600376ec9fd91f8e885dadf0ce036862de0",
    base = "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
    eth_testnet = "0x000000000000000000000000000000000000dEaD"
}
export declare const NETWORKS_WITH_SAME_UNISWAP_ADDRESSES: (1 | 10 | 137 | 42161 | 80002)[];
export declare const V2_SUPPORTED: (1 | 8453 | 84532 | 11155111)[];
export declare const HAS_L1_FEE: ChainId[];
//# sourceMappingURL=constants.d.ts.map