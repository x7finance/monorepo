import {
  BlockchainType,
  ChainDenominationEnum,
  ChainEnum,
  ChainIdentifierEnum,
  ChainScannerLinksEnum,
  ChainShortNameEnum,
  ChainTokenOracleEtherUSDEnum,
  ContractsEnum,
  LoanType,
  TokenContractAddresses,
} from "common"

type ChainMapping = {
  [key in ChainEnum | ChainEnum.offline]: {
    denomination: ChainDenominationEnum
    identifier: ChainIdentifierEnum
    base: ChainScannerLinksEnum
    abbreviation: ChainDenominationEnum
    shortName: ChainShortNameEnum
    nativeQueryCommands: { nativeCurrency: string }
    etherTokenEnum: string
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum
  }
}

const chainMapping: ChainMapping = {
  [ChainEnum.erc]: {
    denomination: ChainDenominationEnum.erc,
    identifier: ChainIdentifierEnum.erc,
    base: ChainScannerLinksEnum.erc,
    abbreviation: ChainDenominationEnum.erc,
    shortName: ChainShortNameEnum.erc,
    nativeQueryCommands: { nativeCurrency: "ethereum" },
    etherTokenEnum: TokenContractAddresses.WETH,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.erc,
  },
  [ChainEnum.bsc]: {
    denomination: ChainDenominationEnum.bsc,
    identifier: ChainIdentifierEnum.bsc,
    base: ChainScannerLinksEnum.bsc,
    abbreviation: ChainDenominationEnum.bsc,
    shortName: ChainShortNameEnum.bsc,
    nativeQueryCommands: { nativeCurrency: "binancecoin" },
    etherTokenEnum: TokenContractAddresses.BNB,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.bsc,
  },
  [ChainEnum.polygon]: {
    denomination: ChainDenominationEnum.polygon,
    identifier: ChainIdentifierEnum.polygon,
    base: ChainScannerLinksEnum.polygon,
    abbreviation: ChainDenominationEnum.polygon,
    shortName: ChainShortNameEnum.polygon,
    nativeQueryCommands: { nativeCurrency: "matic" },
    etherTokenEnum: TokenContractAddresses.WETH,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.polygon,
  },
  [ChainEnum.optimism]: {
    denomination: ChainDenominationEnum.optimism,
    identifier: ChainIdentifierEnum.optimism,
    base: ChainScannerLinksEnum.optimism,
    abbreviation: ChainDenominationEnum.optimism,
    shortName: ChainShortNameEnum.optimism,
    nativeQueryCommands: { nativeCurrency: "ethereum" },
    etherTokenEnum: TokenContractAddresses.WETH,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.optimism,
  },
  [ChainEnum.arbitrum]: {
    denomination: ChainDenominationEnum.arbitrum,
    identifier: ChainIdentifierEnum.arbitrum,
    base: ChainScannerLinksEnum.arbitrum,
    abbreviation: ChainDenominationEnum.arbitrum,
    shortName: ChainShortNameEnum.arbitrum,
    nativeQueryCommands: { nativeCurrency: "ethereum" },
    etherTokenEnum: TokenContractAddresses.WETH,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.arbitrum,
  },
  [ChainEnum.offline]: {
    denomination: ChainDenominationEnum.erc,
    identifier: ChainIdentifierEnum.erc,
    base: ChainScannerLinksEnum.erc,
    abbreviation: ChainDenominationEnum.erc,
    shortName: ChainShortNameEnum.erc,
    nativeQueryCommands: { nativeCurrency: "ethereum" },
    etherTokenEnum: TokenContractAddresses.WETH,
    tokenOracleEtherUSDEnum: ChainTokenOracleEtherUSDEnum.erc,
  },
}

export function generateChainDenomination(chain: BlockchainType) {
  return chainMapping[chain]?.denomination ?? ChainDenominationEnum.erc
}

export function generateChainIdentifier(chain: BlockchainType) {
  return chainMapping[chain]?.identifier ?? ChainIdentifierEnum.erc
}

export function generateChainBase(chain?: BlockchainType) {
  return chainMapping[chain ?? ChainEnum.erc]?.base ?? ChainScannerLinksEnum.erc
}

export function generateChainAbbreviation(chain?: BlockchainType) {
  return chainMapping[chain ?? ChainEnum.erc]?.abbreviation ?? "ETH"
}

export function generateChainShortName(chain?: BlockchainType) {
  return (
    chainMapping[chain ?? ChainEnum.erc]?.shortName ?? ChainShortNameEnum.erc
  )
}

export function generateNativeQueryCommands(chainId?: BlockchainType) {
  return (
    chainMapping[chainId ?? ChainEnum.erc]?.nativeQueryCommands ?? {
      nativeCurrency: "ethereum",
    }
  )
}

export function generateChainEtherTokenEnum(chainId?: BlockchainType) {
  switch (chainId) {
    case ChainEnum.erc:
      return TokenContractAddresses.WETH
    case ChainEnum.bsc:
      return TokenContractAddresses.BNB
    case ChainEnum.polygon:
      return TokenContractAddresses.WMATIC
    case ChainEnum.optimism:
      return TokenContractAddresses.OPTIMISM_ETH
    case ChainEnum.arbitrum:
      return TokenContractAddresses.ARBITRUM_ETH
    default:
      return TokenContractAddresses.WETH
  }
}

export function generateChainTokenOracleEtherUSDEnum(chainId?: BlockchainType) {
  return (
    chainMapping[chainId ?? ChainEnum.erc]?.tokenOracleEtherUSDEnum ??
    ChainTokenOracleEtherUSDEnum.erc
  )
}

export function generateX7InitialLiquidityLoanTermContract(loantype: LoanType) {
  switch (loantype) {
    case "001":
      return ContractsEnum.X7InitialLiquidityLoanTerm001
    case "002":
      return ContractsEnum.X7InitialLiquidityLoanTerm002
    case "003":
      return ContractsEnum.X7InitialLiquidityLoanTerm003
    default:
      return ContractsEnum.X7InitialLiquidityLoanTerm001
  }
}
