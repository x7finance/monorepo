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
};
export const TESTNET_CHAIN_IDS = [
    ChainId.ETHEREUM_TESTNET,
    ChainId.ARBITRUM_TESTNET,
    ChainId.OPTIMISM_TESTNET,
    ChainId.BSC_TESTNET,
    ChainId.POLYGON_TESTNET,
    ChainId.BASE_TESTNET,
];
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
};
export const L1_CHAIN_IDS = [
    ChainId.ETHEREUM,
    ChainId.ETHEREUM_TESTNET,
    ChainId.POLYGON,
    ChainId.POLYGON_TESTNET,
    ChainId.BSC,
    ChainId.BSC_TESTNET,
];
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
];
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
];
export function generateChainIdByName(chain) {
    switch (chain) {
        case ChainShortNameEnum.eth:
            return ChainId.ETHEREUM;
        case ChainShortNameEnum.eth_testnet:
            return ChainId.ETHEREUM_TESTNET;
        case ChainShortNameEnum.bsc:
            return ChainId.BSC;
        case ChainShortNameEnum.polygon:
            return ChainId.POLYGON;
        case ChainShortNameEnum.arbitrum:
            return ChainId.ARBITRUM;
        case ChainShortNameEnum.optimism:
            return ChainId.OPTIMISM;
        case ChainShortNameEnum.base:
            return ChainId.BASE;
        case ChainShortNameEnum.base_testnet:
            return ChainId.BASE_TESTNET;
        default:
            return ChainId.ETHEREUM;
    }
}
export { ChainNameEnum };
var ChainNameEnum;
(function (ChainNameEnum) {
    ChainNameEnum["eth"] = "Ethereum";
    ChainNameEnum["bsc"] = "BSC";
    ChainNameEnum["optimism"] = "Optimism";
    ChainNameEnum["arbitrum"] = "Arbitrum";
    ChainNameEnum["polygon"] = "Polygon";
    ChainNameEnum["base"] = "Base";
    ChainNameEnum["base_testnet"] = "Base-Sepolia";
    ChainNameEnum["eth_testnet"] = "Ethereum-Sepolia";
})(ChainNameEnum || (ChainNameEnum = {}));
export { ChainDenominationEnum };
var ChainDenominationEnum;
(function (ChainDenominationEnum) {
    ChainDenominationEnum["base"] = "ETH";
    ChainDenominationEnum["eth"] = "ETH";
    ChainDenominationEnum["bsc"] = "BNB";
    ChainDenominationEnum["optimism"] = "ETH";
    ChainDenominationEnum["arbitrum"] = "ETH";
    ChainDenominationEnum["polygon"] = "MATIC";
})(ChainDenominationEnum || (ChainDenominationEnum = {}));
export { ChainShortNameEnum };
var ChainShortNameEnum;
(function (ChainShortNameEnum) {
    ChainShortNameEnum["eth"] = "eth";
    ChainShortNameEnum["bsc"] = "bsc";
    ChainShortNameEnum["optimism"] = "opti";
    ChainShortNameEnum["arbitrum"] = "arb";
    ChainShortNameEnum["polygon"] = "polygon";
    ChainShortNameEnum["base"] = "base";
    ChainShortNameEnum["base_testnet"] = "base-testnet";
    ChainShortNameEnum["eth_testnet"] = "eth-testnet";
})(ChainShortNameEnum || (ChainShortNameEnum = {}));
export { ChainIdentifierEnum };
var ChainIdentifierEnum;
(function (ChainIdentifierEnum) {
    ChainIdentifierEnum["eth"] = "eth";
    ChainIdentifierEnum["eth_testnet"] = "eth_testnet";
    ChainIdentifierEnum["bsc"] = "bsc";
    ChainIdentifierEnum["bsc_testnet"] = "bsc_testnet";
    ChainIdentifierEnum["optimism"] = "optimism";
    ChainIdentifierEnum["optimism_testnet"] = "optimism_testnet";
    ChainIdentifierEnum["arbitrum"] = "arbitrum";
    ChainIdentifierEnum["arbitrum_testnet"] = "arbitrum_testnet";
    ChainIdentifierEnum["polygon"] = "polygon";
    ChainIdentifierEnum["polygon_testnet"] = "polygon_testnet";
    ChainIdentifierEnum["base"] = "base";
    ChainIdentifierEnum["base_testnet"] = "base_testnet";
})(ChainIdentifierEnum || (ChainIdentifierEnum = {}));
export { ChainScannerEnum };
var ChainScannerEnum;
(function (ChainScannerEnum) {
    ChainScannerEnum["eth"] = "etherscan";
    ChainScannerEnum["bsc"] = "bscscan";
    ChainScannerEnum["optimism"] = "optiscan";
    ChainScannerEnum["arbitrum"] = "arbiscan";
    ChainScannerEnum["polygon"] = "polygonscan";
    ChainScannerEnum["base"] = "basescan";
    ChainScannerEnum["base_testnet"] = "basescan";
})(ChainScannerEnum || (ChainScannerEnum = {}));
export { ChainAlchemyLinksEnum };
var ChainAlchemyLinksEnum;
(function (ChainAlchemyLinksEnum) {
    ChainAlchemyLinksEnum["eth"] = "https://eth-mainnet.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["eth_testnet"] = "https://eth-sepolia.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["bsc"] = "https://bnb-mainnet.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["bsc_testnet"] = "https://bnb-testnet.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["optimism"] = "https://opt-mainnet.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["optimism_testnet"] = "https://opt-sepolia.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["arbitrum"] = "https://arb-mainnet.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["arbitrum_testnet"] = "https://arb-sepolia.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["polygon"] = "https://polygon-mainnet.g.alchemy.com/v2";
    ChainAlchemyLinksEnum["polygon_amoy"] = "https://polygon-amoy.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["base"] = "https://base-mainnet.g.alchemy.com/v2/";
    ChainAlchemyLinksEnum["base_testnet"] = "https://base-sepolia.g.alchemy.com/v2/";
})(ChainAlchemyLinksEnum || (ChainAlchemyLinksEnum = {}));
export { ChainTokenOracleEtherUSDEnum };
var ChainTokenOracleEtherUSDEnum;
(function (ChainTokenOracleEtherUSDEnum) {
    ChainTokenOracleEtherUSDEnum["eth"] = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    ChainTokenOracleEtherUSDEnum["bsc"] = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee";
    ChainTokenOracleEtherUSDEnum["optimism"] = "0x13e3ee699d1909e989722e753853ae30b17e08c5";
    ChainTokenOracleEtherUSDEnum["arbitrum"] = "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612";
    ChainTokenOracleEtherUSDEnum["polygon"] = "0xab594600376ec9fd91f8e885dadf0ce036862de0";
    ChainTokenOracleEtherUSDEnum["base"] = "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70";
    ChainTokenOracleEtherUSDEnum["eth_testnet"] = "0x000000000000000000000000000000000000dEaD";
})(ChainTokenOracleEtherUSDEnum || (ChainTokenOracleEtherUSDEnum = {}));
export const NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
    ChainId.ETHEREUM,
    ChainId.OPTIMISM,
    ChainId.ARBITRUM,
    ChainId.POLYGON,
    ChainId.POLYGON_TESTNET,
];
export const V2_SUPPORTED = [
    ChainId.ETHEREUM,
    ChainId.ETHEREUM_TESTNET,
    ChainId.BASE,
    ChainId.BASE_TESTNET,
];
export const HAS_L1_FEE = [
    ChainId.OPTIMISM,
    ChainId.ARBITRUM,
    ChainId.ARBITRUM_TESTNET,
    ChainId.BASE,
    ChainId.BASE_TESTNET,
];
//# sourceMappingURL=constants.js.map