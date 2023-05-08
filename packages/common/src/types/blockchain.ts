export enum ChainEnum {
  erc = 1,
  bsc = 56,
  polygon = 137,
  optimism = 10,
  arbitrum = 42161,
  offline = -1,
}

export type BlockchainType =
  | ChainEnum.erc
  | ChainEnum.bsc
  | ChainEnum.arbitrum
  | ChainEnum.optimism
  | ChainEnum.polygon
  | ChainEnum.offline;

export enum ChainNameEnum {
  erc = 'Ethereum',
  bsc = 'BSC',
  optimism = 'Optimism',
  arbitrum = 'Arbitrum',
  polygon = 'Polygon',
  offline = 'offline',
}

export enum ChainDenominationEnum {
  erc = 'ETH',
  bsc = 'BNB',
  optimism = 'ETH',
  arbitrum = 'ETH',
  polygon = 'MATIC',
}

export enum ChainIdentifierEnum {
  erc = 'ether',
  bsc = 'bnb',
  optimism = 'optimism',
  arbitrum = 'arbitrum',
  polygon = 'polygon',
  offline = 'offline',
}

export enum ChainScannerEnum {
  erc = 'etherscan',
  bsc = 'bscscan',
  optimism = 'optiscan',
  arbitrum = 'arbiscan',
  polygon = 'polygonscan',
  offline = 'offline',
}

export enum ChainScannerLinksEnum {
  erc = 'https://etherscan.io',
  bsc = 'https://bscscan.com',
  optimism = 'https://optimistic.etherscan.io',
  arbitrum = 'https://arbiscan.io',
  polygon = 'https://polygonscan.com',
  offline = 'offline',
}

export enum ChainTokenOracleEtherUSDEnum {
  erc = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  bsc = '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
  optimism = '0x13e3ee699d1909e989722e753853ae30b17e08c5',
  arbitrum = '0x639fe6ab55c921f74e7fac1ee960c0b6293ba612',
  polygon = '0xab594600376ec9fd91f8e885dadf0ce036862de0',
}
