import {
  ChainAlchemyLinksEnum,
  ChainDenominationEnum,
  ChainId,
  ChainIdentifierEnum,
  ChainNameEnum,
  ChainShortNameEnum,
  ChainTokenOracleEtherUSDEnum,
} from "../chain";

type ChainMapping = Partial<
  Record<
    ChainId,
    {
      denomination: ChainDenominationEnum;
      name: ChainNameEnum;
      identifier: ChainIdentifierEnum;
      // base: ChainScannerLinksEnum;
      abbreviation: ChainDenominationEnum;
      shortName: ChainShortNameEnum;
      tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum;
    }
  >
>;

const chainMapping: ChainMapping = {
  [ChainId.BASE]: {
    denomination: ChainDenominationEnum.base,
    name: ChainNameEnum.base,
    identifier: ChainIdentifierEnum.base,
    abbreviation: ChainDenominationEnum.base,
    shortName: ChainShortNameEnum.base,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.base,
  },
  [ChainId.ETHEREUM]: {
    denomination: ChainDenominationEnum.eth,
    name: ChainNameEnum.eth,
    identifier: ChainIdentifierEnum.eth,
    abbreviation: ChainDenominationEnum.eth,
    shortName: ChainShortNameEnum.eth,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.eth,
  },
  [ChainId.BSC]: {
    denomination: ChainDenominationEnum.bsc,
    name: ChainNameEnum.bsc,
    identifier: ChainIdentifierEnum.bsc,
    abbreviation: ChainDenominationEnum.bsc,
    shortName: ChainShortNameEnum.bsc,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.bsc,
  },
  [ChainId.POLYGON]: {
    denomination: ChainDenominationEnum.polygon,
    name: ChainNameEnum.polygon,
    identifier: ChainIdentifierEnum.polygon,
    abbreviation: ChainDenominationEnum.polygon,
    shortName: ChainShortNameEnum.polygon,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.polygon,
  },
  [ChainId.OPTIMISM]: {
    denomination: ChainDenominationEnum.optimism,
    name: ChainNameEnum.optimism,
    identifier: ChainIdentifierEnum.optimism,
    abbreviation: ChainDenominationEnum.optimism,
    shortName: ChainShortNameEnum.optimism,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.optimism,
  },
  [ChainId.ARBITRUM]: {
    denomination: ChainDenominationEnum.arbitrum,
    name: ChainNameEnum.arbitrum,
    identifier: ChainIdentifierEnum.arbitrum,
    abbreviation: ChainDenominationEnum.arbitrum,
    shortName: ChainShortNameEnum.arbitrum,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.arbitrum,
  },
  [ChainId.BASE_TESTNET]: {
    denomination: ChainDenominationEnum.base,
    name: ChainNameEnum.base_testnet,
    identifier: ChainIdentifierEnum.base_testnet,
    abbreviation: ChainDenominationEnum.eth,
    shortName: ChainShortNameEnum.base_testnet,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.base,
  },
  [ChainId.ETHEREUM_TESTNET]: {
    denomination: ChainDenominationEnum.eth,
    name: ChainNameEnum.eth_testnet,
    identifier: ChainIdentifierEnum.eth_testnet,
    abbreviation: ChainDenominationEnum.eth,
    shortName: ChainShortNameEnum.eth_testnet,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.base,
  },
};

export function generateChainDenomination(chain: ChainId) {
  return chainMapping[chain]?.denomination ?? ChainDenominationEnum.eth;
}

export function generateChainIdentifier(chain: ChainId) {
  return chainMapping[chain]?.identifier ?? ChainIdentifierEnum.eth;
}

export function generateChainAbbreviation(chain?: ChainId) {
  return chainMapping[chain ?? ChainId.ETHEREUM]?.abbreviation ?? "ETH";
}

export function generateChainShortName(chain?: ChainId) {
  return (
    chainMapping[chain ?? ChainId.ETHEREUM]?.shortName ?? ChainShortNameEnum.eth
  );
}

export function generateChainName(chain?: ChainId) {
  return chainMapping[chain ?? ChainId.ETHEREUM]?.name ?? ChainNameEnum.eth;
}

export function generateChainTokenOracleEtherUSDEnum(chainId?: ChainId) {
  return (
    chainMapping[chainId ?? ChainId.ETHEREUM]?.tokenOracleEtherUSDEnum ??
    ChainTokenOracleEtherUSDEnum.eth
  );
}

export function getAlchemyUrls(id: ChainId) {
  switch (id) {
    case ChainId.ETHEREUM:
      return ChainAlchemyLinksEnum.eth;
    case ChainId.ETHEREUM_TESTNET:
      return ChainAlchemyLinksEnum.eth_testnet;
    case ChainId.POLYGON:
      return ChainAlchemyLinksEnum.polygon;
    case ChainId.POLYGON_TESTNET:
      return ChainAlchemyLinksEnum.polygon_amoy;
    case ChainId.ARBITRUM:
      return ChainAlchemyLinksEnum.arbitrum;
    case ChainId.ARBITRUM_TESTNET:
      return ChainAlchemyLinksEnum.arbitrum_testnet;
    case ChainId.OPTIMISM:
      return ChainAlchemyLinksEnum.optimism;
    case ChainId.OPTIMISM_TESTNET:
      return ChainAlchemyLinksEnum.optimism_testnet;
    case ChainId.BSC:
      return ChainAlchemyLinksEnum.bsc;
    case ChainId.BSC_TESTNET:
      return ChainAlchemyLinksEnum.bsc_testnet;
    case ChainId.BASE:
      return ChainAlchemyLinksEnum.base;
    case ChainId.BASE_TESTNET:
      return ChainAlchemyLinksEnum.base_testnet;
    default:
      return ChainAlchemyLinksEnum.eth;
  }
}
