export enum ContractsEnum {
  // Main Contracts
  X7R = '0x70008f18fc58928dce982b0a69c2c21ff80dca54',
  X7DAO = '0x7105e64bf67eca3ae9b123f0e5ca2b83b2ef2da0',
  X7D = '0x7D000a1B9439740692F8942A296E1810955F5000',
  X7101 = '0x7101a9392eac53b01e7c07ca3baca945a56ee105',
  X7102 = '0x7102dc82ef61bfb0410b1b1bf8ea74575bf0a105',
  X7103 = '0x7103ebdbf1f89be2d53eff9b3cf996c9e775c105',
  X7104 = '0x7104d1f179cc9cc7fb5c79be6da846e3fbc4c105',
  X7105 = '0x7105faa4a26ed1c67b8b2b41bec98f06ee21d105',

  // Liquidity Hubs
  X7R_LiquidityHub = '0x712E87520f35a0a17A49bcCA4D87c201F0A46EBb',
  X7DAO_LiquidityHub = '0x7DA0e45cE7fD8359544Be00a6618215770851ebB',
  X7100_LiquidityHub = '0x7102407afa5d6581AAb694FEB03fEB0e7Cf69ebb',

  // Discount Authorities
  X7R_DiscountAuthority = '0x712bC6ddcd97A776B2482531058C629456B93eda',
  X7DAO_DiscountAuthority = '0x7da05D75f51056f3B83b43F397668Cf6A5051cDa',
  X7100_DiscountAuthority = '0x7100AAcC6047281b105201cb9e0DEcF9Ae5431DA',

  // Splitter Contracts
  TreasurySplitter = '0x70006B785AA87821331a974C3d5af81CdE5BB999',
  EcosystemSplitter = '0x70001BA1BA4d85739E7B6A7C646B8aba5ed6c888',

  // Misc Contracts
  TokenTimeLock = '0x7000f4cddca46fb77196466c3833be4e89ab810c',
  X7100_TokenBurner = '0x70008F0B06060A31515733DB6dCB515c64f3DeAd',
  X7_LendingPool = '0x740015c39da5d148fca25a467399d00bce10c001',
  PioneerRewardPool = '0x70000299Ee8910cCaCD97B1bB560E34F49c9e4f7',
  X7RInitialLiquidityTimeLock = '0x7125c4105d728359Cd3073d567f366926f5cA10C',
  X7DAOInitialLiquidityTimeLock = '0x7da0aaD0f0b1Af993Df722567B045105fbbf510C',
  X7100InitialLiquidityTimeLock = '0x71009A7eE233Af8fb42EeE5DbE61ea92Ea55b10c',
  deadAddress = '0x0000000000000000000000000000000000000000',

  // NFT Contracts
  EcosystemMaxi = '0x7000cae2c1016e7de45ec9b54f1835b966bca4f7',
  LiquidityMaxi = '0x7000f8270b955377e047da8202ae3c408186b4f7',
  DexMaxi = '0x7000b3B5e4e126610A7b7d1Af2D2DE8685c7C4f7',
  BorrowingMaxi = '0x7000D5d7707Bf86b317deC635e459E47b9aBD4F7',
  Magister = '0x7dA0bb55E4097FC2d78a1822105057F36C5F360d',

  // Xchange Contracts
  XchangeFactory = '0x7de800467aFcE442019884f51A4A1B9143a34fAc',
  XchangeRouter = '0x7DE8063E9fB43321d2100e8Ddae5167F56A50060',
  XchangeDiscountAuthority = '0x7De8Ab0dD777561cE98B7Ef413F6fd564E89C1dA',
  LendingDiscountAuthority = '0x74001e463B3c7dC95D96a1FDBE621678C24D47Da',
  LendingPoolReserve = '0x7Ca54e9Aa3128bF15f764fa0f0f93e72b5267000',

  // X7 MulitSigs
  FoundDev1 = '0xCe3890e8f5B0e4e7EbEF4b7f4d9F12B110087232',
  FoundDev2 = '0x795059B11FC46042c69cFC6A021760d0285D18Bf',
  FoundDev3 = '0x9dc098f6d33533242DF55E3323AE7E8508882f52',
  FoundDev4 = '0xd0B5bd9039527B07F2Bf3aF63019F3526A5166A9',
  FoundDev5 = '0x56d13422Dbf491dD928541D54Aba001c1Eb68aE1',
  FoundDev6 = '0xaee254E8672f9cfd417cf8Ad6Cc35eb1Be414340',
  FoundDev7 = '0xf301a0077eA63BEfB9f0064Ab698a6A4a133Cd52',

  FoundDev1Matic = '0x741F717946f745504552E055429Ccd1d3905daDb',
  FoundDev6Matic = '0x307371d404D60Ad0Fa9C52e2f0fe015D7B827Cff',

  FoundDev1Optimism = '0xeD7B2e76F159044EDC3DEC8987849E3B32E5b91C',

  FoundDev1Arbitrum = '0x2aD610857E9E02f106a9d23aeE6b61fa80b70df0',

  FoundDev1BSC = '0xe26A83e72761C1D7D56eaD57DA8C1b219F193416',

  CommunityMultiSig = '0x7063E83dF5349833A21f744398fD39D42fbC00f8',
  DevelopersMultiSig = '0x5CF4288Bf373BBe17f76948E39Baf33B9f6ac2e0',
}

export const MigrationContract = '0x710515Bf543fDb6834144F9269BBf0D1d32B1702';

// V1 deprecated

export const TokenContractAddresses = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  BNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  MATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
};

export const X7DAO = '0x7105aa393b9cf9b2497b460837313ea3dba67da0';
export const X7m105 = '0x06d5ca7c9accd15a87d4993a421b7e702bdbab20';
export const X7 = '0x33dad834eca1290a330c4c4634bc3b64a0197120';
export const X7001 = '0x7001629b8bf9a5d5f204b6d464a06f506fbfa105';
export const X7002 = '0x70021e5eda64e68f035356ea3dce14ef87b6f105';
export const X7003 = '0x70036ddf2f2850f6d1b9d78d652776a0d1cab105';
export const X7004 = '0x70041db5acdf2f8aa648a000fa4a87067abae105';
export const X7005 = '0x7005d9011f4275747d5cb38bc3deb0c46edbd105';
export const V1Tokens = [X7DAO, X7m105, X7, X7001, X7002, X7003, X7004, X7005];
export const V1TokensObjects = {
  x7DAO: { address: X7DAO, tokenName: 'X7DAO' },
  X7M105: { address: X7m105, tokenName: 'X7M105' },
  X7: { address: X7, tokenName: 'X7' },
  X7001: { address: X7001, tokenName: 'X7001' },
  X7002: { address: X7002, tokenName: 'X7002' },
  X7003: { address: X7003, tokenName: 'X7003' },
  X7004: { address: X7004, tokenName: 'X7004' },
  X7005: { address: X7005, tokenName: 'X7005' },
};
