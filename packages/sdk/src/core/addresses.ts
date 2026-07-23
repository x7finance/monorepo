/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import {
  addressMapToTokenMap,
  ChainId,
  DEAD_ADDRESS,
  Implementation,
  Protocol,
  Token,
} from "@x7/utils"

import { constructSameAddressMap } from "../universal-router/utils/constructSameAddressMap"

import { FACTORY_ADDRESS } from "./constants"

export type AddressMap = Record<number, `0x${string}` | undefined>

interface ChainAddresses {
  v3CoreFactoryAddress: `0x${string}`
  multicallAddress: `0x${string}`
  quoterAddress: `0x${string}`
  swapRouter02Address?: `0x${string}`
  v1MixedRouteQuoterAddress?: `0x${string}`
}

const UNISWAP_DEFAULT_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  multicallAddress: "0x1F98415757620B543A52E61c46B32eB19261F984",
  quoterAddress: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
}
const UNISWAP_UNISWAP_MAINNET_ADDRESSES: ChainAddresses = {
  ...UNISWAP_DEFAULT_ADDRESSES,
  v1MixedRouteQuoterAddress: "0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E",
}

const UNISWAP_OPTIMISM_ADDRESSES: ChainAddresses = UNISWAP_DEFAULT_ADDRESSES
const UNISWAP_ARBITRUM_ONE_ADDRESSES: ChainAddresses = {
  ...UNISWAP_DEFAULT_ADDRESSES,
  multicallAddress: "0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB",
}

const UNISWAP_ARBITRUM_ONE_TESTNET_ADDRESSES: ChainAddresses =
  UNISWAP_DEFAULT_ADDRESSES
const UNISWAP_POLYGON_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  multicallAddress: "0x1F98415757620B543A52E61c46B32eB19261F984",
  quoterAddress: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  swapRouter02Address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
}

const UNISWAP_BNB_TESTNET_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
  multicallAddress: "0x963Df249eD09c358A4819E39d9Cd5736c3087184",
  quoterAddress: "0x78D78E420Da98ad378D7799bE8f4AF69033EB077",
  swapRouter02Address: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
}
const UNISWAP_OPTIMISM_TESTNET_ADDRESSES: ChainAddresses =
  UNISWAP_DEFAULT_ADDRESSES

const UNISWAP_BNB_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
  multicallAddress: "0x963Df249eD09c358A4819E39d9Cd5736c3087184",
  quoterAddress: "0x78D78E420Da98ad378D7799bE8f4AF69033EB077",
  swapRouter02Address: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
}

const UNISWAP_SEPOLIA_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
  multicallAddress: "0xD7F33bCdb21b359c8ee6F0251d30E94832baAd07",
  quoterAddress: "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3",
  swapRouter02Address: "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E",
}

const UNISWAP_BASE_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
  multicallAddress: "0x091e99cb1C49331a94dD62755D168E941AbD0693",
  quoterAddress: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
  swapRouter02Address: "0x90be2BfbbeD2adac2C130e11E90db0651e8383e2",
}

const UNISWAP_BASE_SEPOLIA_ADDRESSES: ChainAddresses = {
  v3CoreFactoryAddress: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
  multicallAddress: "0xd867e273eAbD6c853fCd0Ca0bFB6a3aE6491d2C1",
  quoterAddress: "0xC5290058841028F1614F3A6F0F5816cAd0df5E27",
  swapRouter02Address: "0x079c29264Fba2dBff648a324D5E1F94647B9e56D",
}

export const UNISWAP_ADDRESS_MAP: Record<ChainId, ChainAddresses> = {
  [ChainId.ETHEREUM]: UNISWAP_UNISWAP_MAINNET_ADDRESSES,
  [ChainId.OPTIMISM]: UNISWAP_OPTIMISM_ADDRESSES,
  [ChainId.ARBITRUM]: UNISWAP_ARBITRUM_ONE_ADDRESSES,
  [ChainId.POLYGON]: UNISWAP_POLYGON_ADDRESSES,
  [ChainId.BSC]: UNISWAP_BNB_ADDRESSES,
  [ChainId.BASE]: UNISWAP_BASE_ADDRESSES,

  [ChainId.ETHEREUM_TESTNET]: UNISWAP_SEPOLIA_ADDRESSES,
  [ChainId.POLYGON_TESTNET]: UNISWAP_POLYGON_ADDRESSES,
  [ChainId.BASE_TESTNET]: UNISWAP_BASE_SEPOLIA_ADDRESSES,
  [ChainId.BSC_TESTNET]: UNISWAP_BNB_TESTNET_ADDRESSES,
  [ChainId.ARBITRUM_TESTNET]: UNISWAP_ARBITRUM_ONE_TESTNET_ADDRESSES,
  [ChainId.OPTIMISM_TESTNET]: UNISWAP_OPTIMISM_TESTNET_ADDRESSES,
}

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(FACTORY_ADDRESS),
  [ChainId.ETHEREUM_TESTNET]:
    UNISWAP_ADDRESS_MAP[ChainId.ETHEREUM_TESTNET].v3CoreFactoryAddress,
  [ChainId.BSC]: UNISWAP_ADDRESS_MAP[ChainId.BSC].v3CoreFactoryAddress,
  [ChainId.BASE_TESTNET]:
    UNISWAP_ADDRESS_MAP[ChainId.BASE_TESTNET].v3CoreFactoryAddress,
  [ChainId.BASE]: UNISWAP_ADDRESS_MAP[ChainId.BASE].v3CoreFactoryAddress,
}

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap("0x61fFE014bA17989E743c5F6cB21bF9697530B21e"),
  [ChainId.ETHEREUM_TESTNET]:
    UNISWAP_ADDRESS_MAP[ChainId.ETHEREUM_TESTNET].quoterAddress,
  [ChainId.BSC]: UNISWAP_ADDRESS_MAP[ChainId.BSC].quoterAddress,
  [ChainId.BASE_TESTNET]:
    UNISWAP_ADDRESS_MAP[ChainId.BASE_TESTNET].quoterAddress,
  [ChainId.BASE]: UNISWAP_ADDRESS_MAP[ChainId.BASE].quoterAddress,
}

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
  [ChainId.ETHEREUM]:
    UNISWAP_ADDRESS_MAP[ChainId.ETHEREUM].v1MixedRouteQuoterAddress,
}

export const mainnetChainIds: ChainId[] = [
  ChainId.BASE,
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.BSC,
]

export const X7ContractsEnum = {
  LiquidationMultiSig: "0x64403fe09272aCc690176a5245e715a57261Da28",
  X7R: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x70008F18Fc58928dcE982b0A69C2c21ff80Dca54"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0xEe6bA04895613b20a9B200e9EB25293576f8F1e4"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x8623E054126D4843538829878f80Eb7077734db6"
    }
  },
  X7DAO: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7105E64bF67ECA3Ae9b123F0e5Ca2b83b2eF2dA0"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0xa30494c8bE9360a1Dd25108b7074628274b9fd6c"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0xF8d79EdbFE8cADBC0c3Fe8EB68d4E0DAFF9606B2"
    }
  },
  X7D: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7D000a1B9439740692F8942A296E1810955F5000"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0x446906ed090364EC7d1b16cA8Fb6D0fFC50854bD"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x205cff4C8Ef6e0dDb11f916b51A86e2FC47EFd79"
    }
  },
  X7101: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7101a9392EAc53B01e7c07ca3baCa945A56EE105"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0x6b7B78552aCB26B161f39E5731B1A2ebc2436253"
      case ChainId.OPTIMISM_TESTNET:
        return "0x3eA776312255Bab3467f510686CA34d679B7093C"
      case ChainId.ETHEREUM_TESTNET:
        return "0xF8Bb74b77e2Eb9FE9009ECFd7205C0127B98fD7D"
      case ChainId.ARBITRUM_TESTNET:
        return "0x80B4bc7940e088647953396744DEceD63E3faf05"
      case ChainId.BASE_TESTNET:
        return "0x3eA776312255Bab3467f510686CA34d679B7093C"
      case ChainId.POLYGON_TESTNET:
        return "0x38160A298fa875c172FEE91935A339342c2D0C54"
      case ChainId.BSC_TESTNET:
        return "0xd0f3c6610CD02A9EF0768685FC805e912a36fB4A"
    }
  },
  X7102: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7102DC82EF61bfB0410B1b1bF8EA74575bf0A105"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0xA4A002ee15Ed6fc6C9459e4789856dD20ffdfe62"
      case ChainId.OPTIMISM_TESTNET:
        return "0x428971D3B077960aD71ea14e126f0334A9f5E3D2"
      case ChainId.ETHEREUM_TESTNET:
        return "0x9552Ff5b029c8EBb6b8F3993281F155f24922eBa"
      case ChainId.ARBITRUM_TESTNET:
        return "0x7f67913fEa4EFf12aA29C7BC642eD35678e27C14"
      case ChainId.BASE_TESTNET:
        return "0x428971D3B077960aD71ea14e126f0334A9f5E3D2"
      case ChainId.POLYGON_TESTNET:
        return "0x03c57991282f9f7559ef898021F486f6a645D223"
      case ChainId.BSC_TESTNET:
        return "0x7f550950049a73a34B330c6245E68618080dED81"
    }
  },
  X7103: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7103eBdbF1f89be2d53EFF9B3CF996C9E775c105"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0xfF3a265b30450b41BaCf1B2413792da4769C7003"
      case ChainId.OPTIMISM_TESTNET:
        return "0x34238D77c0a58FdC160AA160d5c533D6490AA8F6"
      case ChainId.ETHEREUM_TESTNET:
        return "0xd7877A1241ffF8F0a63274e2826d8C2dc78dF57F"
      case ChainId.ARBITRUM_TESTNET:
        return "0x75aEfd2614aA7A02599373e7c7Cf009E91f1942c"
      case ChainId.BASE_TESTNET:
        return "0x34238D77c0a58FdC160AA160d5c533D6490AA8F6"
      case ChainId.POLYGON_TESTNET:
        return "0x60D4e7632089A6b27A9cB9a9F2bFe0D2B69c59B2"
      case ChainId.BSC_TESTNET:
        return "0x184D1e78Bda1E797d91063837b093eC2Eda2768E"
    }
  },
  X7104: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7104D1f179Cc9cc7fb5c79Be6Da846E3FBC4C105"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0xEDFc68F09d4B6211ede5ee06acF9f560FC561F04"
      case ChainId.OPTIMISM_TESTNET:
        return "0xb5704B9B6200c09BD834bfBA0Ad827E70A5A4f7f"
      case ChainId.ETHEREUM_TESTNET:
        return "0x3AE7B264A5B5fA9262245491c8875296e3E8653e"
      case ChainId.ARBITRUM_TESTNET:
        return "0x4D66AA310bCC5203Bd1d11d22949e1a6A87e3E06"
      case ChainId.BASE_TESTNET:
        return "0xb5704B9B6200c09BD834bfBA0Ad827E70A5A4f7f"
      case ChainId.POLYGON_TESTNET:
        return "0x7B5f3814f03C8c294bEdFf658f622B146C8508FE"
      case ChainId.BSC_TESTNET:
        return "0x39BC15f5C5f4Fe4Ca542E19FeF60541A251812E3"
    }
  },

  X7105: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x7105FAA4a26eD1c67B8B2b41BEc98F06Ee21D105"
      case ChainId.BASE: // ❌ - not deployed on above address
        return "0x941d37f4BCc92236ebE5aF46777b7E816d6d418A"
      case ChainId.OPTIMISM_TESTNET:
        return "0x4A630864830a560A7b36472108776b7d649A74B9"
      case ChainId.ETHEREUM_TESTNET:
        return "0xB7E79e8D9c15DB6D5C19b147Dc25Ef9d73547E61"
      case ChainId.ARBITRUM_TESTNET:
        return "0xA22D7968B774216D8fF3594fA5b9828931dfC161"
      case ChainId.BASE_TESTNET:
        return "0x4A630864830a560A7b36472108776b7d649A74B9"
      case ChainId.POLYGON_TESTNET:
        return "0xf739F6DF34aeC5d6A65912c7418663B5FA614E63"
      case ChainId.BSC_TESTNET:
        return "0xF98240d3ccf4a79AAB6B721969fAd97A84E31AE8"
    }
  },
  // Liquidity Hubs
  X7R_LiquidityHub: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0xd089aAeb716b6930fe71f96D335F8Cd2c07fa505"
      case ChainId.BASE:
        return "0xAA5Fa9dAD086c16B5aa5213e7c20a12A4880898e"
      case ChainId.BSC:
        return "0x4B0d2d38f080f94634Bfe42B405A623a419389EF"
      case ChainId.POLYGON:
        return "0xBa7a7956716F32DF5F958A895Ba860f41889D828"
      case ChainId.ARBITRUM:
        return "0xeC6a8dE27138D686D96A60F2E9B7ccB5bA53C94C"
      case ChainId.OPTIMISM:
        return "0xFAa2B600c430d01dEB94D8955Ad02F100E2066D4"
      case ChainId.OPTIMISM_TESTNET:
        return "0x67D1a3293436580FCA4Fb166c67147B9cA35eD44"
      case ChainId.ETHEREUM_TESTNET:
        return "0xD66d1e852Ce31f0B8ef9152996541090ad8d9dcB"
      case ChainId.ARBITRUM_TESTNET:
        return "0xbd34867BBE00B12F0643877F931bEcAf4D63e604"
      case ChainId.BASE_TESTNET:
        return "0x67D1a3293436580FCA4Fb166c67147B9cA35eD44"
      case ChainId.POLYGON_TESTNET:
        return "0x19058eB69B3Dabb922D1b4E341f3605230F8BF22"
      case ChainId.BSC_TESTNET:
        return "0xf9c893CDdf5d0AA0feF2Eacf0332f9E127B0dacc"
    }
  },
  X7DAO_LiquidityHub: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7f0A0E38aCb20Bb5b701d4EAce9fD0a559D8Bfd0"
      case ChainId.BASE:
        return "0x8a829554B0EFc245f3B0e3C17a731336b907E205"
      case ChainId.BSC:
        return "0xE2E8a085025Eaf7130111aD82c18799f047d7278"
      case ChainId.POLYGON:
        return "0x0Bf5f8B61360b2abff48547C4558f50389cf0221"
      case ChainId.ARBITRUM:
        return "0x22B31DC2D1cD37788202a4b9AbFfd17b56b186aa"
      case ChainId.OPTIMISM:
      case ChainId.OPTIMISM_TESTNET:
        return "0x24649DA983F10cED95a55320E813D1af3247073e"
      case ChainId.ETHEREUM_TESTNET:
        return "0x091A4b01816591e904c49E7256B5c4b6Db8D4400"
      case ChainId.ARBITRUM_TESTNET:
        return "0x643Fc5De286A545bb9358C7839291A6cb7b284a7"
      case ChainId.BASE_TESTNET:
        return "0x24649DA983F10cED95a55320E813D1af3247073e"
      case ChainId.POLYGON_TESTNET:
        return "0x9ED2695d695059Df4237af050Fca399ba233ca02"
      case ChainId.BSC_TESTNET:
        return "0xaeE6c26EE88d15b5764B304E1C2243Db6F8EFe62"
    }
  },
  X7100_LiquidityHub: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x1df9B4aC212ef4d8DbEc7Fb5623c33E04970Db3f"
      case ChainId.BSC:
        return "0xAA5Fa9dAD086c16B5aa5213e7c20a12A4880898e"
      case ChainId.POLYGON:
        return "0x950c0685E6eAf16Fb7643a3EAB7EE57a91DB8cc3"
      case ChainId.ARBITRUM:
        return "0x84f864Bf33607fD42663db4823D8f30093711b37"
      case ChainId.OPTIMISM:
        return "0x62c72ce2B7ec919888238C8d866227b726ea2CEA"
      case ChainId.BASE:
        return "0xa6433641803102AC2be4fff17C339762d9C9C2E0"
      case ChainId.OPTIMISM_TESTNET:
        return "0x030E69192F60b11dc5b205066aa7BDE69a3c999D"
      case ChainId.ETHEREUM_TESTNET:
        return "0x594d613871D28F7C7F26fe9Eee26567ccDFd3640"
      case ChainId.ARBITRUM_TESTNET:
        return "0x43806F9577B8D482f7BFdC19C2FD0d655Eb82684"
      case ChainId.BASE_TESTNET:
        return "0x030E69192F60b11dc5b205066aa7BDE69a3c999D"
      case ChainId.POLYGON_TESTNET:
        return "0x3F394814f48a46bFc2002ec23Fc27460970DA634"
      case ChainId.BSC_TESTNET:
        return "0x74F07603a86693ae25F4ADF7c424906DB7176049"
    }
  },
  // Discount Authorities
  X7R_DiscountAuthority: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x712bC6ddcd97A776B2482531058C629456B93eda"
      case ChainId.BASE: // ❌
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0xdd2cd5fe4248fd5656d3240eb7fdbd5c9930a686"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0xF301F8A9c6B4B6A792781e171B5eAFC696982d4C"
    }
  },
  X7DAO_DiscountAuthority: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7da05D75f51056f3B83b43F397668Cf6A5051cDa"
      case ChainId.BASE: // ❌
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x864c53a08a99dadc219b309aa867c45d222d0938"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x28C9C3Fe2E421fE48B64873BAec90BB0BF309C26"
    }
  },
  X7100_DiscountAuthority: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7100AAcC6047281b105201cb9e0DEcF9Ae5431DA"
      case ChainId.BASE: // ❌
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x383f768222818ae9c391600913dd8ab309254f39"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0xC51AC5f410C080D4b0c964aaB61a9132c5A9a304"
    }
  },
  XchangeRouterWithDiscounts: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x6377c6219c7Ab053F17cA9E3D823e63473e669A2"
      case ChainId.BASE:
        return "0x6fD8d2a09a090A69d05b0d21a3c187de6a9A57E7"
      case ChainId.BSC:
        return "0x75163692e0081d20C965c45fBb027A01694431bB"
      case ChainId.POLYGON:
        return "0x976Cc8346085e06896D37B6dCA01cD08535F37EB"
      case ChainId.ARBITRUM:
        return "0xC5f73c308a35606B700746113AaCF5FFd175a3c0"
      case ChainId.OPTIMISM:
        return "0x6fD8d2a09a090A69d05b0d21a3c187de6a9A57E7"
      case ChainId.OPTIMISM_TESTNET:
        return "0x8fCead21747F5C35E36223C08F5C1Aa1cB0f143c"
      case ChainId.ETHEREUM_TESTNET:
        return "0x955129f2882735eb3A11e6Bf54b98D389515D6c2"
      case ChainId.ARBITRUM_TESTNET:
        return "0xE132995F1a5F38E1425675a2aa8Cd961166162E3"
      case ChainId.BASE_TESTNET:
        return "0x8fCead21747F5C35E36223C08F5C1Aa1cB0f143c"
      case ChainId.POLYGON_TESTNET:
        return "0xfE4929596d92A29b50094E4e76E056822719985d"
      case ChainId.BSC_TESTNET:
        return "0x6d4dAdb5474B4C9f02A60606691c0F3e93cCaB44"
    }
  },
  XchangeDiscountAuthority: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7De8Ab0dD777561cE98B7Ef413F6fd564E89C1dA"
      case ChainId.BASE: // ❌
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0xa817b10d727bfdffd4a3c87a26ed5fa376d0eece"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x0e5321F70Cb903485922903E5f642f5Ee626CE86"
    }
  },
  LendingDiscountAuthority: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x74001e463B3c7dC95D96a1FDBE621678C24D47Da"
      case ChainId.BASE:
        return "0x758808B831E3f58c040c1D4A179EFFc9f2e31E0C"
      case ChainId.BSC:
        return "0x87A53C0d9691c742C819189B86E444A4236b91B"
      case ChainId.POLYGON:
        return "0xBeaCd59B75224c07fca41bC6F36c76Cce3E7D1FF"
      case ChainId.ARBITRUM:
        return "0x45A529953014E38aF4e38Bbc173d256433A3Ac94"
      case ChainId.OPTIMISM:
        return "0x758808B831E3f58c040c1D4A179EFFc9f2e31E0C"
      case ChainId.OPTIMISM_TESTNET:
        return "0xAbA6c1efe068EA7469Ce50623ca3B86424ad0caD"
      case ChainId.ETHEREUM_TESTNET:
        return "0x00edB8A018CD306B78C90343019717FE22e27aa4"
      case ChainId.ARBITRUM_TESTNET:
        return "0xbC49E88cCA81050BC72e7d3668623Dc0421cB775"
      case ChainId.BASE_TESTNET:
        return "0xAbA6c1efe068EA7469Ce50623ca3B86424ad0caD"
      case ChainId.POLYGON_TESTNET:
        return "0xA292d6776607d402c94f7f18b83fbe236424f1e8"
      case ChainId.BSC_TESTNET:
        return "0xe4045e600F7C7a4E62256B1b1eC03ae8091Dd3ee"
    }
  },
  // Splitters
  TreasurySplitter: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7000706E2727686eDF46cA0E42690F87b9de1999"
      case ChainId.BASE:
        return "0x75cb47A14BFEb7EFB7fD616904935E44F19580BE"
      case ChainId.BSC:
        return "0x9f94e2A7b4AE351eb6A9d1c09E8d005b8d94C08"
      case ChainId.POLYGON:
        return "0x6767095743cfED43B7B758BCc022FeaBBb7BcEBa"
      case ChainId.ARBITRUM:
        return "0x9f168f2e3CB2F94031A8aec5bBfb37a2928b4c86"
      case ChainId.OPTIMISM:
        return "0x75cb47A14BFEb7EFB7fD616904935E44F19580BE"
      case ChainId.OPTIMISM_TESTNET:
        return "0xB228449d8c8a3c235422743CE12782498dFb738a"
      case ChainId.ETHEREUM_TESTNET:
        return "0x834446A346b0340C56A2fcBe06f1e00985121663"
      case ChainId.ARBITRUM_TESTNET:
        return "0xa494D4eb9aD3067bD9d8B2db4Aa5850623e9F765"
      case ChainId.BASE_TESTNET:
        return "0xB228449d8c8a3c235422743CE12782498dFb738a"
      case ChainId.POLYGON_TESTNET:
        return "0x878D8eF651b9e172fe0FAaB8496Edb20C1676046"
      case ChainId.BSC_TESTNET:
        return "0x8d33B47e8d9B645fa0478769aeF5Ed52594379a6"
    }
  },
  EcosystemSplitter: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x70001BA1BA4d85739E7B6A7C646B8aba5ed6c888"
      case ChainId.BASE: // ⚠️ not owned on above address
      case ChainId.BSC: // ⚠️ not owned on above address
      case ChainId.POLYGON: // ⚠️ not owned on above address
      case ChainId.ARBITRUM: // ⚠️ not owned on above address
      case ChainId.OPTIMISM: // ⚠️ not owned on above address
        return "0xA65DF22BC2ec986859B43D1803b75D48232f2902"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
        return "0x32C82935dEFfb797b807dc23F0C4160D445b1DD3"
      case ChainId.BSC_TESTNET:
        return "0xA65DF22BC2ec986859B43D1803b75D48232f2902"
    }
  },
  ProfitSplitter: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x700008707507005e5673B644ECb2387673941000"
      case ChainId.BASE:
        return "0x33648435164bAa6B62a6bBF81748906Bd3300C36"
      case ChainId.BSC:
        return "0xA2D1d1206BC981AbF2337EC3C643F0B3b5706A6"
      case ChainId.POLYGON:
        return "0x294E7D6e6eb8a6d1e8308DdBE3Cb8620b5041952"
      case ChainId.ARBITRUM:
        return "0xA024c7B88c4F9D5bC6e54cD64f3AAC17F50618FC"
      case ChainId.OPTIMISM:
        return "0x33648435164bAa6B62a6bBF81748906Bd3300C36"
      case ChainId.OPTIMISM_TESTNET:
        return "0xe74d66d6DC1810F02D0d0Fce5bDdC8151a4b8f00"
      case ChainId.ETHEREUM_TESTNET:
        return "0x581Ef97187bcf810a4ff30c52B2E96928990a5eF"
      case ChainId.ARBITRUM_TESTNET:
        return "0xE97101763E26Fd3241aA4aee86e4eCc3172C782e"
      case ChainId.BASE_TESTNET:
        return "0xe74d66d6DC1810F02D0d0Fce5bDdC8151a4b8f00"
      case ChainId.POLYGON_TESTNET:
        return "0x7c6c4107C3F11C91defd311ef2BC84604e98be08"
      case ChainId.BSC_TESTNET:
        return "0xc3e3E60AEA059D685a1Eef79fb8740662c8F7c3D"
    }
  },
  // Utilities
  TokenTimeLock: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7000F4Cddca46FB77196466C3833Be4E89ab810C"
      case ChainId.BSC:
        return "0x8135bDc81185969A4F7eCf2F65d737C6e119C5f4"
      case ChainId.POLYGON:
        return "0xf748Fc84EEe0caa845eDF0C56781f77161D10Ae2"
      case ChainId.ARBITRUM:
        return "0x029D9B5bC816638864402dACdFe5540488D3c3Fe"
      case ChainId.OPTIMISM:
        return "0xeB108169a1962874A02bbBBAE8F123C97EA297dA"
      case ChainId.BASE:
        return "0xeB108169a1962874A02bbBBAE8F123C97EA297dA"
      case ChainId.OPTIMISM_TESTNET:
        return "0x93419308DcAd63e75d242719A36F13Ea509CA05B"
      case ChainId.ETHEREUM_TESTNET:
        return "0x33C25E885887B1Ea81619AE4C7c1eCE6eBb564c1"
      case ChainId.ARBITRUM_TESTNET:
        return "0x3a1834FE247185B083387bC01E8c643845d7D08B"
      case ChainId.BASE_TESTNET:
        return "0x93419308DcAd63e75d242719A36F13Ea509CA05B"
      case ChainId.POLYGON_TESTNET:
        return "0xf3386f43c6963D8C105e2378c68331EA17996949"
      case ChainId.BSC_TESTNET:
        return "0xeb39E81BAE50c6dB554e32A3eEea01667e797c5a"
    }
  },
  TokenList: "0x7def192adb727777c5f24c05018cfbafdfad805a" as `0x${string}`,
  TokenBurner: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x70008F0B06060A31515733DB6dCB515c64f3DeAd"
      case ChainId.BASE:
        return "0xA649b52295b4DB30648e633504f1714337603DEa"
      case ChainId.BSC:
        return "0xA4fA641C8AB0a94Ad9CaAbaDcd43F91730b24676"
      case ChainId.POLYGON:
        return "0x5c95C015b9E3B2deE4d2E4112cEa97F6209b489e"
      case ChainId.ARBITRUM:
        return "0xA1A0744f4195F7058333A464a3Be90a771B22d98"
      case ChainId.OPTIMISM:
        return "0x1675ad54b0c41413b6e6c563b89E6b1C3c5b5796"
      case ChainId.OPTIMISM_TESTNET:
        return "0x9D137b29e761bB9D793979Cf0DF29135DEe35000"
      case ChainId.ETHEREUM_TESTNET:
        return "0x3589D98A93f79ca7163A9f56C06dF825a2cFd94d"
      case ChainId.ARBITRUM_TESTNET:
        return "0x87596EeadabDF7b6AD52F35137225b0bf10b287d"
      case ChainId.BASE_TESTNET:
        return "0x9D137b29e761bB9D793979Cf0DF29135DEe35000"
      case ChainId.POLYGON_TESTNET:
        return "0x36F599FFcf4199ffc6af44418B1641bDAf3c28BF"
      case ChainId.BSC_TESTNET:
        return "0x18c78F364d64F52DaE7A9Dc99da800049a42D182"
    }
  },
  X7_LendingPool: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x74001DcFf64643B76cE4919af4DcD83da6Fe1E02"
      case ChainId.BASE:
        return "0x4eE199B7DFED6B96402623BdEcf2B1ae2f3750Dd"
      case ChainId.BSC:
        return "0x6396898c25b2bbF824DcdEc99A6F4061CC12f573"
      case ChainId.POLYGON:
        return "0xF57C56270E9FbF18B254E05168C632c9f3D9a442"
      case ChainId.ARBITRUM:
        return "0x7F3F8bcF93e17734AEec765128156690e8c7e8d3"
      case ChainId.OPTIMISM:
        return "0x94ada63c4B836AbBA14D2a20624bDF39b9DD5Ed5"
      case ChainId.OPTIMISM_TESTNET:
        return "0x0E2F369Fdc070521ae23A8BcB4Bad0310044a1e8"
      case ChainId.ETHEREUM_TESTNET:
        return "0xcad129C25D092a48bAC897CfbA887F16762E139f"
      case ChainId.ARBITRUM_TESTNET:
        return "0x3503A77fde88dfce8315116D58c9fe0bC1eCb953"
      case ChainId.BASE_TESTNET:
        return "0x0E2F369Fdc070521ae23A8BcB4Bad0310044a1e8"
      case ChainId.POLYGON_TESTNET:
        return "0xD18175c2BFad3a594FeBFe3f0426d4f8F714149C"
      case ChainId.BSC_TESTNET:
        return "0xA377d8B82dF8b3EE1fd849BA231F036db5eE8d83"
    }
  },
  LendingPoolReserve: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7Ca54e9Aa3128bF15f764fa0f0f93e72b5267000"
      case ChainId.BASE:
        return "0x1C17a7E472CDded644b1a9bC2dd52304d6215Af3"
      case ChainId.BSC:
        return "0x3dE169E39A91519C16497C60510d7AE1ddf443B"
      case ChainId.POLYGON:
        return "0x6e77E844CDac13698d06a00a9Ddb0465c5a78429"
      case ChainId.ARBITRUM:
        return "0xB9a7346CeFc95aE5C4105c31453824A737Cd2760"
      case ChainId.OPTIMISM:
        return "0xb71016b5BdbbAB0f8d1A50e66B6a757D1Dcd1Db2"
      case ChainId.OPTIMISM_TESTNET:
        return "0xbae3a19E9a4644a5bb98Af0eddD42533C38E3785"
      case ChainId.ETHEREUM_TESTNET:
        return "0xeEa4C68B1424cF566c2Ce7F4479fB6dbE79f53Fe"
      case ChainId.ARBITRUM_TESTNET:
        return "0x526a2C3941caDa8198119DBb307285268a7495F6"
      case ChainId.BASE_TESTNET:
        return "0xbae3a19E9a4644a5bb98Af0eddD42533C38E3785"
      case ChainId.POLYGON_TESTNET:
        return "0xF23fd3293AF8B48504F6bCff2121E3817B4bF7a0"
      case ChainId.BSC_TESTNET:
        return "0x58989d4860cbe7225aB12E7CD722b580AF96b9B8"
    }
  },
  PioneerRewardPool: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
        return "0x70000299Ee8910cCaCD97B1bB560E34F49c9e4f7"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return DEAD_ADDRESS
    }
  },
  // NFTs
  EcosystemMaxi: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        // not owned on L2's
        return "0x7000CAE2C1016e7De45ec9b54F1835b966BCA4f7"
      case ChainId.BASE:
        return "0x6d998487609941C2BCf4731f612277b748406Af8"
      case ChainId.BSC:
        return "0xA9eE05B0D04E5E6B21D43dEAaA35B8a266A404E"
      case ChainId.POLYGON:
        return "0x7685b9C4901D6c557f067fA5B8D9be3cC10Ee5f5"
      case ChainId.ARBITRUM:
        return "0x55aA8668CD8bd252e1eAE62891dD460a4DC201C0"
      case ChainId.OPTIMISM:
        return "0x6d998487609941C2BCf4731f612277b748406Af8"
      case ChainId.OPTIMISM_TESTNET:
        return "0x4092ce34FBD0439CfeBA226912320c76B9Fe8910"
      case ChainId.ETHEREUM_TESTNET:
        return "0x2218d7000F8692DCb3565E8c1b2a2831040Af8ff"
      case ChainId.ARBITRUM_TESTNET:
        return "0x4c9B7F84755D84511fE99145Cc4A28167579C3b6"
      case ChainId.BASE_TESTNET:
        return "0x4092ce34FBD0439CfeBA226912320c76B9Fe8910"
      case ChainId.POLYGON_TESTNET:
        return "0xa5B1171a7Be735a327b66F01F679b838FE2e7b3B"
      case ChainId.BSC_TESTNET:
        return "0xB6dEEfaC5474316Fbe4dE45c64F2f4845b825dD2"
    }
  },
  LiquidityMaxi: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        // not owned on L2's
        return "0x7000F8270B955377e047da8202aE3c408186B4F7"
      case ChainId.BASE:
        return "0xBc7A6859514D1874d2F14Af083F4e86DDd79fd32"
      case ChainId.BSC:
        return "0x7F23aa5Da0737F5423373aAb85DB6420829Aa991"
      case ChainId.POLYGON:
        return "0xfe74724aAfD52e6333B0284B02385934eA5Ee113"
      case ChainId.ARBITRUM:
        return "0x824f06bcd0C3Ec22A01f403cA1abf6c68122e047"
      case ChainId.OPTIMISM:
        return "0xBc7A6859514D1874d2F14Af083F4e86DDd79fd32"
      case ChainId.OPTIMISM_TESTNET:
        return "0x566E57FbA7769d37474Ddc35cF62BBD83ff268e7"
      case ChainId.ETHEREUM_TESTNET:
        return "0x9245c9eE4827b8934c3F59AF00C4A233665DB09C"
      case ChainId.ARBITRUM_TESTNET:
        return "0x942D4afe939Cc4ECdf829D67d50878D4ce1F1Bae"
      case ChainId.BASE_TESTNET:
        return "0x566E57FbA7769d37474Ddc35cF62BBD83ff268e7"
      case ChainId.POLYGON_TESTNET:
        return "0xf38946F84Adc4cE7B027738631102b500153e256"
      case ChainId.BSC_TESTNET:
        return "0xb76d40c35668E73882B947aD8280e7671Ef54Fb3"
    }
  },
  DexMaxi: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        // not owned on L2's
        return "0x7000b3B5e4e126610A7b7d1Af2D2DE8685c7C4f7"
      case ChainId.BASE:
        return "0x1AC7633C465f87A5620703eC27cf067588BDb095"
      case ChainId.BSC:
        return "0x59d2a2D93Dc58d2E455B55466eB7C9b020B66179"
      case ChainId.POLYGON:
        return "0x454897236a96D641D7D9Ac613AD072F94E7bf0DD"
      case ChainId.ARBITRUM:
        return "0x140aA1b8b86c92E5104B23b6a4c8e120Bfe0b5Cf"
      case ChainId.OPTIMISM:
        return "0x1AC7633C465f87A5620703eC27cf067588BDb095"
      case ChainId.OPTIMISM_TESTNET:
        return "0x9c752F0f2F8be688abeB3979d0e2113183d076F2"
      case ChainId.ETHEREUM_TESTNET:
        return "0x335d3c6083075a3A5eFCc04AA7a6454D1F0B00fD"
      case ChainId.ARBITRUM_TESTNET:
        return "0xA978f9D913338Bf65CE393B1A13debe071d646b7"
      case ChainId.BASE_TESTNET:
        return "0x9c752F0f2F8be688abeB3979d0e2113183d076F2"
      case ChainId.POLYGON_TESTNET:
        return "0xad88F3678a416c39AA1b2f93816400E356E5b353"
      case ChainId.BSC_TESTNET:
        return "0x34cA399123DCF6054E5F8Fe06c76FE7A29F99AA8"
    }
  },
  BorrowingMaxi: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        // not owned on L2's
        return "0x7000D5d7707Bf86b317deC635e459E47b9aBD4F7"
      case ChainId.BASE:
        return "0xE1c7244Cc32980Db8dB191FD87731E091057Dc6F"
      case ChainId.BSC:
        return "0xa2fDdD3411913E264Ef735Bb8f2Af63F6bb06c0D"
      case ChainId.POLYGON:
        return "0x4248e60f05507Fafe5ac732E2Bda939feAE825B6"
      case ChainId.ARBITRUM:
        return "0xb4De05B7d17A1b7e793E0Db8Fb96A63CD7a6d127"
      case ChainId.OPTIMISM:
        return "0xE1c7244Cc32980Db8dB191FD87731E091057Dc6F"
      case ChainId.OPTIMISM_TESTNET:
        return "0x1b6D1606117423BB8528edFEEE999bC1F5457D42"
      case ChainId.ETHEREUM_TESTNET:
        return "0x5e3dEfEE4698c5eb03734aAF6a5490825342a3bF"
      case ChainId.ARBITRUM_TESTNET:
        return "0x0C8C3e827f4F05d3F60276F2c1A9a07334c2B96C"
      case ChainId.BASE_TESTNET:
        return "0x1b6D1606117423BB8528edFEEE999bC1F5457D42"
      case ChainId.POLYGON_TESTNET:
        return "0x6d0C59AB222976023A7C01e312963d8C746d3025"
      case ChainId.BSC_TESTNET:
        return "0x7550B96c7eFa4c2337D7978143Ebc65317675C8f"
    }
  },
  BorrowingIncentive: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7400199bba0274242f47e3b573Aa5E775a0090B1"
      case ChainId.BASE: // ⚠️ not owned
      case ChainId.BSC: // ⚠️ not owned
      case ChainId.POLYGON: // ⚠️ not owned
      case ChainId.ARBITRUM: // ⚠️ not owned
      case ChainId.OPTIMISM: // ⚠️ not owned
        return "0x56e29cbecb79557deb6e6536a871d6f255df3e70"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x2D65EfB1b49FC1f2F79e397B7066AEAe7cE5dC52"
    }
  },
  Magister: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x7dA0bb55E4097FC2d78a1822105057F36C5F360d"
      case ChainId.BASE:
        return "0x54E52e3Df66Ee56871c3c7672aD6F04889C11477"
      case ChainId.BSC:
        return "0xeDce6d0adD7a71b3F3E06A8B351ff3Ed6e6f3FcA"
      case ChainId.POLYGON:
        return "0xeaEBAf4268CE0123779FBa0eAC0671cB9B635Ab7"
      case ChainId.ARBITRUM:
        return "0x126854d2104635136adeFAdb63054E54d29aED37"
      case ChainId.OPTIMISM:
        return "0x54E52e3Df66Ee56871c3c7672aD6F04889C11477"
      case ChainId.OPTIMISM_TESTNET:
        return "0x768Cec7EbEaa138124CC046F180cd529E33e214F"
      case ChainId.ETHEREUM_TESTNET:
        return "0xcE714b437EeE60D8eE8aE1EA21e2F2679aC6233b"
      case ChainId.ARBITRUM_TESTNET:
        return "0x1Cf32a59D627ea9DB065314869e9070DBCC05119"
      case ChainId.BASE_TESTNET:
        return "0x768Cec7EbEaa138124CC046F180cd529E33e214F"
      case ChainId.POLYGON_TESTNET:
        return "0x43C2c949c22E0EC47dB4cba89FE07F8a87AB513a"
      case ChainId.BSC_TESTNET:
        return "0x18A01a8482D64d38D3103f08d7E9eD68610269A7"
    }
  },
  // Xchange
  XchangeFactory: "0x8B76C05676D205563ffC1cbd11c0A6e3d83929c5" as `0x${string}`,
  // This is the v1 router
  XchangeRouter: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x6b5422D584943BC8Cd0E10e239d624c6fE90fbB8"
      case ChainId.BASE:
        return "0xC2defaD879dC426F5747F2A5b067De070928AA50"
      case ChainId.BSC:
        return "0x32e9eDEaBd5A8034468497A4782b1a9EB95C4A67"
      case ChainId.POLYGON:
        return "0xA72618ff64468Dff871e980fB657dE3Ca5Ae0aba"
      case ChainId.ARBITRUM:
        return "0x7C79C9483Ee518783b31C78920f73D0fDeabe246"
      case ChainId.OPTIMISM:
        return "0x2A382e8eB22Ecb02dD67C30243A4D0A01474b042"
      // Testnets
      case ChainId.ETHEREUM_TESTNET:
        return "0x05B5034BfDbd930a93283aa52A10D700454A7a47"
      case ChainId.BASE_TESTNET:
        return "0xde472CFDC852c45FA8AC082A07662cA4846bD9A2"
      case ChainId.POLYGON_TESTNET:
        return "0x6CeBbc8c4f918afb417cdB07BF73701E15a9Dd56"
      case ChainId.ARBITRUM_TESTNET:
        return "0x4d80bB62013cD35da82b6bA377cBB4D2bEC2C1aa"
      case ChainId.OPTIMISM_TESTNET:
        return "0x8fCead21747F5C35E36223C08F5C1Aa1cB0f143c"
      case ChainId.BSC_TESTNET:
        return "0x9D137b29e761bB9D793979Cf0DF29135DEe35000"
    }
  },
  XchangeMetadata: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x3F623342607dDdFbED2853f29e78d193938E072d"
      case ChainId.BASE:
        return "0x56e65598370a7d342B19D40D5b65DB697Ceb0C74"
      default:
        return DEAD_ADDRESS
    }
  },
  // Loans
  X7InitialLiquidityLoanTerm001: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
        return "0x7400165E167479a3c81C8fC8CC3df3D2a92E9017"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x5481ae548D98E7cF2F15387165Ae65b4406672F3"
    }
  },
  X7InitialLiquidityLoanTerm003: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
        return "0x74001C747B6cc9091EE63bC9424DfF633FBAc617"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x2C73aCaE43750F9571354B54864c2A9B3537d87d"
    }
  },
  X7InitialLiquidityLoanTerm004: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BASE:
        return "0x3c0E49D9b72FdDAeF36e2962368b073Bc5A76481"
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
        return DEAD_ADDRESS
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0xB4190B1b6FD00A9699b5FEa913e7D981318fef5a"
    }
  },
  X7InitialLiquidityLoanTerm005: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
        return "0x90482AD3aa56675ba313dAC14C3a7717bAD5B24D"
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return "0x97dD34dF320CC490A071b794756423e2bE7D4B3b"
    }
  },
  X7LiquidityTreasury: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0xDDC2DeC8ce4Ab39dB581FC441403b3e3288eB637"
      case ChainId.BASE:
        return "0xc6726216f8f77Ac17ACc0B2Fb28310B5F283241e"
      case ChainId.BSC:
        return "0x303e92d44B17a75Ae06c7F624e0c8EE6Ab596172"
      case ChainId.POLYGON:
        return "0xa413f4d546321407D4e809d681094be31d4a70d2"
      case ChainId.ARBITRUM:
        return "0xA9570aDDC58A86C44A50401c03d40418BAe76F5B"
      case ChainId.OPTIMISM:
        return "0x32391B59107Af19944CA630Cb50E2e80B3E443BF"
      case ChainId.OPTIMISM_TESTNET:
        return "0xa8BaDE172aDF693F9bBb84Da326865FFf2CDc04d"
      case ChainId.ETHEREUM_TESTNET:
        return "0x4176059F1F5eCBC42Fc8A744De10205c99038D16"
      case ChainId.ARBITRUM_TESTNET:
        return "0xEE56934AC56Aac97d2429649d381E484C9c545a6"
      case ChainId.BASE_TESTNET:
        return "0xC0198C37245e8Afd4cd08624bF4d51209AB7EEce"
      case ChainId.POLYGON_TESTNET:
        return "0xA58b293f07d21c7a31Cd72fD005cB7d28EFA038a"
      case ChainId.BSC_TESTNET:
        return "0x5671e460D5239566d7F69253a6447aE376A85118"
    }
  },
  // Multi Sigs
  CommunityMultiSig:
    "0x7063E83dF5349833A21f744398fD39D42fbC00f8" as `0x${string}`,
  DAOMultiSig: (chainId: ChainId): `0x${string}` =>
    mainnetChainIds.includes(chainId)
      ? "0x7dcb82DecBEb1f41BC9eb00a552B085ba356a256"
      : DEAD_ADDRESS,
  DevelopersMultiSig: (chainId: ChainId): `0x${string}` =>
    mainnetChainIds.includes(chainId)
      ? "0x5CF4288Bf373BBe17f76948E39Baf33B9f6ac2e0"
      : DEAD_ADDRESS,
  UtilityDeployer:
    "0xf7c5c8Bdd689767e039c631Ad42482128BD54Ba3" as `0x${string}`,

  // Xchange Pairs
  X7RXchangePair: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x8e0D035787e7083D4292536005dD6A69682e4f64"
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return DEAD_ADDRESS
    }
  },
  X7DAOXchangePair: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0xb8dE6270640092463988B6860d68CA63dC7cF700"
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return DEAD_ADDRESS
    }
  },
  X7101XchangePair: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0x63deeba8d883bc820bfaab547c7ea26da289ca3e"
      case ChainId.BASE:
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
      case ChainId.ETHEREUM_TESTNET:
      case ChainId.BASE_TESTNET:
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return DEAD_ADDRESS
    }
  },
  XChangeCreate: (chainId: ChainId): `0x${string}` => {
    switch (chainId) {
      case ChainId.ETHEREUM:
        return "0xfD392Fc17fcCe76b41d9ab4Ea72943bc5e244F6e"
      case ChainId.BASE:
        return "0xf4C0124b9a862a281379374e3CCc564acC68a5af"
      case ChainId.BSC:
      case ChainId.POLYGON:
      case ChainId.ARBITRUM:
      case ChainId.OPTIMISM:
      case ChainId.ETHEREUM_TESTNET:
        return "0x09503d48Ac958AC40ed0E8Ab466D5a44190eC903"
      case ChainId.BASE_TESTNET:
        return "0x964277be4f184Fa8f03364c3575ecf241A9b9e99"
      case ChainId.POLYGON_TESTNET:
      case ChainId.ARBITRUM_TESTNET:
      case ChainId.OPTIMISM_TESTNET:
      case ChainId.BSC_TESTNET:
        return DEAD_ADDRESS
    }
  },
}

export function generateX7SubgraphByChainId(
  chainId: ChainId
): `${string}` | null {
  const BASE_URL =
    "https://api.goldsky.com/api/public/project_clyrg4ykphu4n01ut607rhku3/subgraphs"
  const NETWORK_MAP: Record<ChainId, string> = {
    [ChainId.ETHEREUM]: "xchange-mainnet/mainnet",
    [ChainId.POLYGON]: "xchange-matic/matic",
    [ChainId.BSC]: "xchange-bsc/bsc",
    [ChainId.OPTIMISM]: "xchange-optimism/optimism",
    [ChainId.ARBITRUM]: "xchange-arb/arb",
    [ChainId.BASE]: "xchange-base/base",
    [ChainId.ETHEREUM_TESTNET]: "xchange-sepolia/sepolia",
    [ChainId.BASE_TESTNET]: "",
    [ChainId.POLYGON_TESTNET]: "",
    [ChainId.ARBITRUM_TESTNET]: "",
    [ChainId.OPTIMISM_TESTNET]: "",
    [ChainId.BSC_TESTNET]: "",
  }

  const networkPath = NETWORK_MAP[chainId]
  if (!networkPath) {
    console.error(`No subgraph found for chainId: ${chainId}`)
    return null
  }

  return `${BASE_URL}/${networkPath}/gn`
}

// TODO: clean up this bologna
export const generateRouterAddress = (
  chainId: ChainId,
  implementation: Implementation,
  protocol?: Protocol
): `0x${string}` => {
  // Xchange Router
  if (implementation === Implementation.XCHANGE) {
    return X7ContractsEnum.XchangeRouter(chainId)
  }

  // Sushiswap Router
  if (implementation === Implementation.SUSHISWAP) {
    if (protocol === Protocol.V2) {
      return chainId === ChainId.BASE
        ? "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891"
        : "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f"
    } else {
      return chainId === ChainId.BASE
        ? "0xFB7eF66a7e61224DD6FcD0D7d9C3be5C8B049b9f"
        : "0x2E6cd2d30aa43f40aa81619ff4b6E0a41479B13F"
    }
  }

  if (implementation === Implementation.PANCAKESWAP) {
    return "0x1b81D678ffb9C0263b24A97847620C99d213eB14"
  }

  // Uniswap Router
  if (implementation === Implementation.UNISWAP) {
    if (chainId === ChainId.BSC) {
      return UNISWAP_ADDRESS_MAP[ChainId.BSC].swapRouter02Address!
    }

    if (chainId === ChainId.BASE_TESTNET) {
      return UNISWAP_ADDRESS_MAP[ChainId.BASE_TESTNET].swapRouter02Address!
    }

    if (chainId === ChainId.ETHEREUM_TESTNET) {
      return UNISWAP_ADDRESS_MAP[ChainId.ETHEREUM_TESTNET].swapRouter02Address!
    }
  }

  if (implementation === Implementation.AERODROME) {
    return "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"
  }

  // Fallback
  if (chainId === ChainId.BASE) {
    return "0x90be2BfbbeD2adac2C130e11E90db0651e8383e2"
    // return protocol === Protocol.V3
    //   ? "0x90be2BfbbeD2adac2C130e11E90db0651e8383e2"
    //   : "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";
  } else if (chainId === ChainId.BASE_TESTNET) {
    return "0x079c29264fba2dbff648a324d5e1f94647b9e56d"
  } else {
    return chainId === ChainId.ETHEREUM
      ? "0xfB971c01886B039CA46A597BbED675090eFD2FD4"
      : "0x091460D3b885a72361FC45038382301d002aF046"
  }
}

// Token Addresses
export const KP3R_ADDRESS = {
  [ChainId.ETHEREUM]: "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44",
} as const

export const LDO_ADDRESS = {
  [ChainId.ETHEREUM]: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
} as const

export const rETH2_ADDRESS = {
  [ChainId.ETHEREUM]: "0x20BC832ca081b91433ff6c17f85701B6e92486c5",
} as const

export const WBTC_ADDRESS = {
  [ChainId.ARBITRUM]: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  [ChainId.ETHEREUM]: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  [ChainId.POLYGON]: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  [ChainId.OPTIMISM]: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
} as const

export const AAVE_ADDRESS = {
  [ChainId.ETHEREUM]: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  [ChainId.POLYGON]: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  [ChainId.BSC]: "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
  [ChainId.OPTIMISM]: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
} as const

const axlUSDC_BASE_ADDRESS = "0xEB466342C4d449BC9f53A865D5Cb90586f405215"
export const axlUSDC_ADDRESS = {
  [ChainId.ARBITRUM]: axlUSDC_BASE_ADDRESS,
  [ChainId.BASE]: axlUSDC_BASE_ADDRESS,
  [ChainId.BSC]: "0x4268B8F0B87b6Eae5d897996E6b845ddbD99Adf3",
  [ChainId.ETHEREUM]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [ChainId.OPTIMISM]: axlUSDC_BASE_ADDRESS,
  [ChainId.POLYGON]: "0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed",
} as const

export const MANA_ADDRESS = {
  [ChainId.POLYGON]: "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4",
} as const

export const MKR_ADDRESS = {
  [ChainId.ETHEREUM]: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
  [ChainId.POLYGON]: "0x6f7C932e7684666C9fd1d44527765433e01fF61d",
  [ChainId.ARBITRUM]: "0x2e9a6Df78E42a30712c10a9Dc4b1C8656f8F2879",
} as const

export const YFI_ADDRESS = {
  [ChainId.ETHEREUM]: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  [ChainId.POLYGON]: "0xDA537104D6A5edd53c6fBba9A898708E465260b6",
  [ChainId.ARBITRUM]: "0x82e3a8f066a6989666b031d916c43672085b1582",
} as const

export const ENJ_ADDRESS = {
  [ChainId.ETHEREUM]: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
} as const

export const CRV_ADDRESS = {
  [ChainId.ETHEREUM]: "0xD533a949740bb3306d119CC777fa900bA034cd52",
  [ChainId.POLYGON]: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
  [ChainId.ARBITRUM]: "0x11cdb42b0eb46d95f990bedd4695a6e3fa034978",
  [ChainId.OPTIMISM]: "0x0994206dfE8De6Ec6920FF4D779B0d950605Fb53",
} as const

export const ARB_ADDRESS = {
  [ChainId.ARBITRUM]: "0x912CE59144191C1204E64559FE8253a0e49E6548",
  [ChainId.ETHEREUM]: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
} as const

export const sETH2_ADDRESS = {
  [ChainId.ETHEREUM]: "0xFe2e637202056d30016725477c5da089Ab0A043A",
} as const

export const FEI_ADDRESS = {
  [ChainId.ETHEREUM]: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
} as const

export const OHM_ADDRESS = {
  [ChainId.ETHEREUM]: "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5",
} as const

export const SNX_ADDRESS = {
  [ChainId.ETHEREUM]: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
  [ChainId.POLYGON]: "0x50B728D8D964fd00C2d0AAD81718b71311feF68a",
  [ChainId.OPTIMISM]: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
} as const

export const UNI_ADDRESS = {
  [ChainId.ETHEREUM]: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  [ChainId.OPTIMISM]: "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
  [ChainId.BSC]: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
  [ChainId.POLYGON]: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
  [ChainId.ARBITRUM]: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
} as const

export const BUSD_ADDRESS = {
  [ChainId.BSC]: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
} as const

export const MAI_ADDRESS = {
  [ChainId.POLYGON]: "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1",
  [ChainId.ARBITRUM]: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  [ChainId.BSC]: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  [ChainId.OPTIMISM]: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
  [ChainId.ETHEREUM]: "0x8D6CeBD76f18E1558D4DB88138e2DeFB3909fAD6",
} as const

export const TUSD_ADDRESS = {
  [ChainId.ETHEREUM]: "0x0000000000085d4780B73119b644AE5ecd22b376",
} as const

export const ANKR_ADDRESS = {
  [ChainId.ETHEREUM]: "0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4",
} as const

export const COMP_ADDRESS = {
  [ChainId.ETHEREUM]: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
} as const

export const LUSD_ADDRESS = {
  [ChainId.ETHEREUM]: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
  [ChainId.OPTIMISM]: "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
} as const

export const SUSHI_ADDRESS = {
  [ChainId.ETHEREUM]: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  [ChainId.POLYGON]: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
  [ChainId.BSC]: "0x986cdF0fd180b40c4D6aEAA01Ab740B996D8b782",
  [ChainId.ARBITRUM]: "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A",
  [ChainId.OPTIMISM]: "0x3eaEb77b03dBc0F6321AE1b72b2E9aDb0F60112B",
  [ChainId.BASE]: "0x7D49a065D17d6d4a55dc13649901fdBB98B2AFBA",
  [ChainId.BASE_TESTNET]: "0x7D49a065D17d6d4a55dc13649901fdBB98B2AFBA", //
} as const

export const OP_ADDRESS = {
  [ChainId.OPTIMISM]: "0x4200000000000000000000000000000000000042",
} as const

export const AMPL_ADDRESS: Partial<Record<ChainId, `0x${string}`>> = {
  [ChainId.ETHEREUM]: "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
}

export const LINK_ADDRESS = {
  [ChainId.ETHEREUM]: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  [ChainId.POLYGON]: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
  [ChainId.BSC]: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
  [ChainId.OPTIMISM]: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
  [ChainId.ARBITRUM]: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
  [ChainId.BASE]: "0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
  [ChainId.BASE_TESTNET]: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
} as const

export const USDC_ADDRESS = {
  [ChainId.ETHEREUM]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [ChainId.ETHEREUM_TESTNET]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  [ChainId.POLYGON]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  [ChainId.POLYGON_TESTNET]: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
  [ChainId.BSC]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  [ChainId.BSC_TESTNET]: "0x64544969ed7EBf5f083679233325356EbE738930",
  [ChainId.ARBITRUM]: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  [ChainId.ARBITRUM_TESTNET]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  [ChainId.OPTIMISM]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  [ChainId.OPTIMISM_TESTNET]: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  [ChainId.BASE]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  [ChainId.BASE_TESTNET]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
} as const

export const USDT_ADDRESS = {
  [ChainId.ETHEREUM]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  [ChainId.POLYGON]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  [ChainId.BSC]: "0x55d398326f99059fF775485246999027B3197955",
  [ChainId.BSC_TESTNET]: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD",
  [ChainId.ARBITRUM]: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  [ChainId.OPTIMISM]: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
} as const

export const DAI_ADDRESS = {
  [ChainId.ETHEREUM]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  [ChainId.POLYGON]: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  [ChainId.BSC]: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
  [ChainId.ARBITRUM]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  [ChainId.OPTIMISM]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  [ChainId.BASE]: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
} as const

export const FRAX_ADDRESS = {
  [ChainId.ETHEREUM]: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
  [ChainId.BSC]: "0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40",
  [ChainId.ARBITRUM]: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
  [ChainId.POLYGON]: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
  [ChainId.OPTIMISM]: "0x2E3D870790dC77A83DD1d18184Acc7439A53f475",
} as const

export const FXS_ADDRESS = {
  [ChainId.ETHEREUM]: "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
  [ChainId.BSC]: "0xe48A3d7d0Bc88d552f730B62c006bC925eadB9eE",
  [ChainId.ARBITRUM]: "0x9d2F299715D94d8A7E6F5eaa8E654E8c74a988A7",
  [ChainId.POLYGON]: "0x3e121107F6F22DA4911079845a470757aF4e1A1b",
  [ChainId.OPTIMISM]: "0x67CCEA5bb16181E7b4109c9c2143c24a1c2205Be",
} as const

export const MANA = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "MANA",
    name: "Decentraland",
  },
  MANA_ADDRESS
) as Record<keyof typeof MANA_ADDRESS, Token>

export const MKR = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "MKR",
    name: "Maker",
  },
  MKR_ADDRESS
) as Record<keyof typeof MKR_ADDRESS, Token>

export const YFI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "YFI",
    name: "yearn.finance",
  },
  YFI_ADDRESS
) as Record<keyof typeof YFI_ADDRESS, Token>

export const ENJ = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "ENJ",
    name: "Enjin Coin",
  },
  ENJ_ADDRESS
) as Record<keyof typeof ENJ_ADDRESS, Token>

export const CRV = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "CRV",
    name: "Curve DAO Token",
  },
  CRV_ADDRESS
) as Record<keyof typeof CRV_ADDRESS, Token>

export const SNX = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "SNX",
    name: "Synthetix Network Token",
  },
  SNX_ADDRESS
) as Record<keyof typeof SNX_ADDRESS, Token>

export const ARB = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "ARB",
    name: "Arbitrum",
  },
  ARB_ADDRESS
) as Record<keyof typeof ARB_ADDRESS, Token>

export const KP3R = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "KP3R",
    name: "Keep3rV1",
  },
  KP3R_ADDRESS
) as Record<keyof typeof KP3R_ADDRESS, Token>

export const LDO = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "LDO",
    name: "Lido DAO Token",
  },
  LDO_ADDRESS
) as Record<keyof typeof LDO_ADDRESS, Token>

export const rETH2 = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "rETH2",
    name: "StakeWise Reward ETH2",
  },
  rETH2_ADDRESS
) as Record<keyof typeof rETH2_ADDRESS, Token>

export const sETH2 = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "sETH2",
    name: "StakeWise Staked ETH2",
  },
  sETH2_ADDRESS
) as Record<keyof typeof sETH2_ADDRESS, Token>

export const FEI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "FEI",
    name: "Fei USD",
  },
  FEI_ADDRESS
) as Record<keyof typeof FEI_ADDRESS, Token>

export const OHM = addressMapToTokenMap(
  {
    decimals: 9,
    symbol: "OHM",
    name: "Olympus",
  },
  OHM_ADDRESS
) as Record<keyof typeof OHM_ADDRESS, Token>

export const WBTC = addressMapToTokenMap(
  {
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped BTC",
  },
  WBTC_ADDRESS
) as Record<keyof typeof WBTC_ADDRESS, Token>

export const UNI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "UNI",
    name: "Uniswap",
  },
  UNI_ADDRESS
) as Record<keyof typeof UNI_ADDRESS, Token>

export const BUSD = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "BUSD",
    name: "BUSD Token",
  },
  BUSD_ADDRESS
) as Record<keyof typeof BUSD_ADDRESS, Token>

export const MAI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "MAI",
    name: "Mai Stablecoin",
  },
  MAI_ADDRESS
) as Record<keyof typeof MAI_ADDRESS, Token>

export const TUSD = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "TUSD",
    name: "TrueUSD",
  },
  TUSD_ADDRESS
) as Record<keyof typeof TUSD_ADDRESS, Token>

export const ANKR = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "ANKR",
    name: "Anker Network",
  },
  ANKR_ADDRESS
) as Record<keyof typeof ANKR_ADDRESS, Token>

export const AAVE = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "AAVE",
    name: "Aave Token",
  },
  AAVE_ADDRESS
) as Record<keyof typeof AAVE_ADDRESS, Token>

export const COMP = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "COMP",
    name: "Compound ",
  },
  COMP_ADDRESS
) as Record<keyof typeof COMP_ADDRESS, Token>

export const LUSD = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "LUSD",
    name: "LUSD Stablecoin",
  },
  LUSD_ADDRESS
) as Record<keyof typeof LUSD_ADDRESS, Token>

export const SUSHI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "SUSHI",
    name: "SushiToken",
  },
  SUSHI_ADDRESS
) as Record<keyof typeof SUSHI_ADDRESS, Token>

export const axlUSDC: Record<keyof typeof axlUSDC_ADDRESS, Token> =
  addressMapToTokenMap(
    {
      decimals: 6,
      symbol: "axlUSDC",
      name: "Axelar Wrapped USDC",
    },
    axlUSDC_ADDRESS
  ) as Record<keyof typeof axlUSDC_ADDRESS, Token>

export const USDC: Record<keyof typeof USDC_ADDRESS, Token> = {
  ...(addressMapToTokenMap(
    {
      decimals: 6,
      symbol: "USDC",
      name: "USD Coin",
    },
    USDC_ADDRESS
  ) as Omit<
    Record<keyof typeof USDC_ADDRESS, Token>,
    typeof ChainId.BSC & typeof ChainId.BSC_TESTNET
  >),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: USDC_ADDRESS[ChainId.BSC],
    decimals: 18,
    symbol: "USDC",
    name: "USD Coin",
  }),
} as const

export const USDT: Record<keyof typeof USDT_ADDRESS, Token> = {
  ...(addressMapToTokenMap(
    {
      decimals: 6,
      symbol: "USDT",
      name: "Tether USD",
    },
    USDT_ADDRESS
  ) as Omit<
    Record<keyof typeof USDT_ADDRESS, Token>,
    typeof ChainId.BSC & typeof ChainId.BSC_TESTNET
  >),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: USDT_ADDRESS[ChainId.BSC],
    decimals: 18,
    symbol: "USDT",
    name: "Tether USD",
  }),
  [ChainId.BSC_TESTNET]: new Token({
    chainId: ChainId.BSC_TESTNET,
    address: USDT_ADDRESS[ChainId.BSC_TESTNET],
    decimals: 18,
    symbol: "USDT",
    name: "Tether USD",
  }),
}

export const DAI = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "DAI",
    name: "Dai Stablecoin",
  },
  DAI_ADDRESS
) as Record<keyof typeof DAI_ADDRESS, Token>

export const FRAX = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "FRAX",
    name: "Frax",
  },
  FRAX_ADDRESS
) as Record<keyof typeof FRAX_ADDRESS, Token>

export const FXS = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "FXS",
    name: "Frax Share",
  },
  FXS_ADDRESS
) as Record<keyof typeof FXS_ADDRESS, Token>

export const OP = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "OP",
    name: "Optimism",
  },
  OP_ADDRESS
) as Record<keyof typeof OP_ADDRESS, Token>

export const LINK = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "LINK",
    name: "ChainLink Token",
  },
  LINK_ADDRESS
) as Record<keyof typeof LINK_ADDRESS, Token>

export const STABLES = {
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    LUSD[ChainId.ETHEREUM],
  ],
  [ChainId.POLYGON]: [
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.BSC]: [
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
    BUSD[ChainId.BSC],
  ],
  [ChainId.ARBITRUM]: [
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
  ],
  [ChainId.OPTIMISM]: [
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
  ],
  [ChainId.BASE]: [USDC[ChainId.BASE], DAI[ChainId.BASE]],
  [ChainId.POLYGON_TESTNET]: [USDC[ChainId.POLYGON_TESTNET]],
  [ChainId.OPTIMISM_TESTNET]: [USDC[ChainId.OPTIMISM_TESTNET]],
  [ChainId.BASE_TESTNET]: [USDC[ChainId.BASE_TESTNET]],
  [ChainId.ETHEREUM_TESTNET]: [USDC[ChainId.ETHEREUM_TESTNET]],
} as const

export type ProtocolOptions = Record<string, string>

export type Implementations = Record<Implementation, ProtocolOptions>
export type ChainsImplementations = Record<ChainId, Implementations>

export const FACTORY_ADDRESSES: any = {
  [ChainId.ETHEREUM]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      [Protocol.V3]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "", // "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362",
      [Protocol.V3]: "", // "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
      [Protocol.V3]: "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.BASE]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0x8909dc15e40173ff4699343b6eb8132c65e18ec6",
      [Protocol.V3]: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "", // "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      [Protocol.V3]: "", // "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0x71524B4f93c58fcbF659783284E38825f0622859",
      [Protocol.V3]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
      [Protocol.V3]: "",
    },
  },
  [ChainId.OPTIMISM]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf",
      [Protocol.V3]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.ARBITRUM]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9",
      [Protocol.V3]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "", // "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      [Protocol.V3]: "", // "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      [Protocol.V3]: "0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.POLYGON]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
      [Protocol.V3]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      [Protocol.V3]: "0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.POLYGON_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      [Protocol.V3]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.ETHEREUM_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0xB7f907f7A9eBC822a80BD25E224be42Ce0A698A0",
      [Protocol.V3]: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.ARBITRUM_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
      [Protocol.V3]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      [Protocol.V3]: "0xaa26771d497814E81D305c511Efbb3ceD90BF5bd",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.BSC]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
      [Protocol.V3]: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
      [Protocol.V3]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      [Protocol.V3]: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      [Protocol.V3]: "0x126555dd55a39328F69400d6aE4F782Bd4C34ABb",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.BASE_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: X7ContractsEnum.XchangeFactory,
      [Protocol.V3]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
}

export const PAIR_INIT_HASH: any = {
  [ChainId.ETHEREUM]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0xd75846df8bac2f946ea9ee78caa53b6812e7514197698275b8322d75e1543193",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]:
        "0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.OPTIMISM]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0x53d884ce77af368ae97db362056d00ce36bd01bfeca6bc8b482d0c611beedc4f",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.ARBITRUM]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0x53d884ce77af368ae97db362056d00ce36bd01bfeca6bc8b482d0c611beedc4f",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.POLYGON]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0x53d884ce77af368ae97db362056d00ce36bd01bfeca6bc8b482d0c611beedc4f",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.POLYGON_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]: "",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0x53d884ce77af368ae97db362056d00ce36bd01bfeca6bc8b482d0c611beedc4f",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.ETHEREUM_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0xfe97aac7998fcf386b3de32a30aa7d8b7dfc12c3fd412090e8c1bd3946d17522",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },

  [ChainId.ARBITRUM_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]: "",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.BSC]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]:
        "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },

  [ChainId.BASE_TESTNET]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0xd75846df8bac2f946ea9ee78caa53b6812e7514197698275b8322d75e1543193",
      [Protocol.V3]: "",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "",
      [Protocol.V3]: "",
    },
  },
  [ChainId.BASE]: {
    [Implementation.UNISWAP]: {
      [Protocol.V2]:
        "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0xd75846df8bac2f946ea9ee78caa53b6812e7514197698275b8322d75e1543193",
    },
    [Implementation.PANCAKESWAP]: {
      [Protocol.V2]: "",
      [Protocol.V3]:
        "0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2",
    },
    [Implementation.SUSHISWAP]: {
      [Protocol.V2]:
        "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
      [Protocol.V3]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    },
    [Implementation.AERODROME]: {
      [Protocol.V2]: "0xa4e46b4f701c62e14df11b48dce76a7d793cd6d7",
      [Protocol.V3]: "",
    },
  },
}

export const INIT_CODE_HASH: any = {
  [ChainId.ETHEREUM]: {
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0x60c060405234801561001057600080fd5b5060405161528a38038061528a83398101604081905261002f916100be565b8061003981610052565b50506001600160a01b039182166080521660a052610101565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146100b957600080fd5b919050565b6000806000606084860312156100d357600080fd5b6100dc846100a2565b92506100ea602085016100a2565b91506100f8604085016100a2565b90509250925092565b60805160a051614fea6102a0600039600081816101ec0152818161048401528181610680015281816106cf015281816107b001528181610a3901528181610e820152818161106a0152818161146b015281816115760152818161165d01528181611713015281816118970152818161192501528181611d3401528181611dec01528181611ea001528181611f4501528181611fb90152818161249a0152818161277b015281816127d1015281816128050152818161289a01528181612cda01528181612e460152612ed401526000818161052b015281816108540152818161096401528181610b1f01528181610bca01528181610cfe01528181610f2601528181611048015281816111bc015281816117b60152818161195701528181611ac701528181611feb015281816122420152818161244601528181612478015281816125de015281816127af01528181612a0a01528181612a8d01528181612d7d01528181612f0601528181613882015281816138d201528181613b9701528181613d50015281816142670152818161430901526143800152614fea6000f3fe6080604052600436106101dc5760003560e01c80638803dbee11610102578063c45a015511610095578063f2fde38b11610064578063f2fde38b146105c8578063f305d719146105e8578063f84b6a4c146105fb578063fb3bdb411461061b57600080fd5b8063c45a015514610519578063d06ca61f1461054d578063ded9382a1461056d578063e8e337001461058d57600080fd5b8063ad615dec116100d1578063ad615dec146104a6578063af2979eb146104c6578063b6f9de95146104e6578063baa2abde146104f957600080fd5b80638803dbee1461040d5780638da5cb5b1461042d578063ac9650d81461045f578063ad5c46481461047257600080fd5b80634a25d94a1161017a578063715018a611610149578063715018a6146103a5578063791ac947146103ba5780637ff36ab5146103da57806385f8c259146103ed57600080fd5b80634a25d94a146103325780635ae401dc146103525780635b0d5984146103655780635c11d7951461038557600080fd5b80631f00ca74116101b65780631f00ca74146102b25780631f0464d1146102d25780632195995c146102f257806338ed17391461031257600080fd5b806302751cec1461021d578063054d50d41461025757806318cbafe51461028557600080fd5b3661021857336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461021657600080fd5b005b600080fd5b34801561022957600080fd5b5061023d6102383660046145aa565b61062e565b604080519283526020830191909152015b60405180910390f35b34801561026357600080fd5b50610277610272366004614608565b610749565b60405190815260200161024e565b34801561029157600080fd5b506102a56102a0366004614679565b610760565b60405161024e91906146ec565b3480156102be57600080fd5b506102a56102cd366004614777565b610b18565b6102e56102e0366004614835565b610b50565b60405161024e91906148d1565b3480156102fe57600080fd5b5061023d61030d366004614959565b610bc0565b34801561031e57600080fd5b506102a561032d366004614679565b610cb3565b34801561033e57600080fd5b506102a561034d366004614679565b610e32565b6102e5610360366004614835565b610fed565b34801561037157600080fd5b50610277610380366004614a03565b611040565b34801561039157600080fd5b506102166103a0366004614679565b611147565b3480156103b157600080fd5b50610216611409565b3480156103c657600080fd5b506102166103d5366004614679565b61141d565b6102a56103e8366004614a99565b6116cb565b3480156103f957600080fd5b50610277610408366004614608565b611a6d565b34801561041957600080fd5b506102a5610428366004614679565b611a7c565b34801561043957600080fd5b506000546001600160a01b03165b6040516001600160a01b03909116815260200161024e565b6102e561046d366004614b00565b611b8e565b34801561047e57600080fd5b506104477f000000000000000000000000000000000000000000000000000000000000000081565b3480156104b257600080fd5b506102776104c1366004614608565b611cdb565b3480156104d257600080fd5b506102776104e13660046145aa565b611ce8565b6102166104f4366004614a99565b611e5a565b34801561050557600080fd5b5061023d610514366004614b42565b6121f4565b34801561052557600080fd5b506104477f000000000000000000000000000000000000000000000000000000000000000081565b34801561055957600080fd5b506102a5610568366004614777565b61243f565b34801561057957600080fd5b5061023d610588366004614a03565b61246e565b34801561059957600080fd5b506105ad6105a8366004614bb4565b61257b565b6040805193845260208401929092529082015260600161024e565b3480156105d457600080fd5b506102166105e3366004614c30565b61269c565b6105ad6105f63660046145aa565b61272c565b34801561060757600080fd5b5061023d610616366004614c54565b6129ae565b6102a5610629366004614a99565b612c92565b600080824281101561067a5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b60448201526064015b60405180910390fd5b6106a9897f00000000000000000000000000000000000000000000000000000000000000008a8a8a308a6121f4565b90935091506106b989868561305e565b604051632e1a7d4d60e01b8152600481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d90602401600060405180830381600087803b15801561071b57600080fd5b505af115801561072f573d6000803e3d6000fd5b5050505061073d858361318e565b50965096945050505050565b6000610758848484601461325c565b949350505050565b606081428110156107a65760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001686866107dd600182614ce4565b8181106107ec576107ec614cf7565b90506020020160208101906108019190614c30565b6001600160a01b03161461084f5760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b6108af7f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506133e892505050565b91508682600184516108c19190614ce4565b815181106108d1576108d1614cf7565b602002602001015110156109335760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b6109f88686600081811061094957610949614cf7565b905060200201602081019061095e9190614c30565b336109d87f00000000000000000000000000000000000000000000000000000000000000008a8a600081811061099657610996614cf7565b90506020020160208101906109ab9190614c30565b8b8b60018181106109be576109be614cf7565b90506020020160208101906109d39190614c30565b613569565b856000815181106109eb576109eb614cf7565b602002602001015161365a565b610a378287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525030925061379f915050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d8360018551610a759190614ce4565b81518110610a8557610a85614cf7565b60200260200101516040518263ffffffff1660e01b8152600401610aab91815260200190565b600060405180830381600087803b158015610ac557600080fd5b505af1158015610ad9573d6000803e3d6000fd5b50505050610b0d848360018551610af09190614ce4565b81518110610b0057610b00614cf7565b602002602001015161318e565b509695505050505050565b6060610b477f0000000000000000000000000000000000000000000000000000000000000000846014856139a0565b90505b92915050565b60608380610b5f600143614ce4565b4014610bad5760405162461bcd60e51b815260206004820152600960248201527f426c6f636b6861736800000000000000000000000000000000000000000000006044820152606401610671565b610bb78484611b8e565b95945050505050565b6000806000610bf07f00000000000000000000000000000000000000000000000000000000000000008f8f613569565b9050600087610bff578c610c03565b6000195b60405163d505accf60e01b815233600482015230602482015260448101829052606481018b905260ff8916608482015260a4810188905260c481018790529091506001600160a01b0383169063d505accf9060e401600060405180830381600087803b158015610c7257600080fd5b505af1158015610c86573d6000803e3d6000fd5b50505050610c998f8f8f8f8f8f8f6121f4565b809450819550505050509b509b9950505050505050505050565b60608142811015610cf95760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b610d597f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506133e892505050565b9150868260018451610d6b9190614ce4565b81518110610d7b57610d7b614cf7565b60200260200101511015610ddd5760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b610df38686600081811061094957610949614cf7565b610b0d8287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525089925061379f915050565b60608142811015610e785760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168686610eaf600182614ce4565b818110610ebe57610ebe614cf7565b9050602002016020810190610ed39190614c30565b6001600160a01b031614610f215760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b610f817f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506139a092505050565b91508682600081518110610f9757610f97614cf7565b602002602001015111156109335760405162461bcd60e51b815260206004820152601f60248201527f586368616e67653a204558434553534956455f494e5055545f414d4f554e54006044820152606401610671565b60608380421115610bad5760405162461bcd60e51b815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c64000000000000000000000000006044820152606401610671565b60008061108e7f00000000000000000000000000000000000000000000000000000000000000008d7f0000000000000000000000000000000000000000000000000000000000000000613569565b905060008661109d578b6110a1565b6000195b60405163d505accf60e01b815233600482015230602482015260448101829052606481018a905260ff8816608482015260a4810187905260c481018690529091506001600160a01b0383169063d505accf9060e401600060405180830381600087803b15801561111057600080fd5b505af1158015611124573d6000803e3d6000fd5b505050506111368d8d8d8d8d8d611ce8565b9d9c50505050505050505050505050565b804281101561118b5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b61121c858560008181106111a1576111a1614cf7565b90506020020160208101906111b69190614c30565b336112167f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b90506020020160208101906112039190614c30565b8a8a60018181106109be576109be614cf7565b8a61365a565b6000858561122b600182614ce4565b81811061123a5761123a614cf7565b905060200201602081019061124f9190614c30565b6040516370a0823160e01b81526001600160a01b03868116600483015291909116906370a0823190602401602060405180830381865afa158015611297573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112bb9190614d0d565b90506112fb868680806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250889250613b22915050565b8681878761130a600182614ce4565b81811061131957611319614cf7565b905060200201602081019061132e9190614c30565b6040516370a0823160e01b81526001600160a01b03888116600483015291909116906370a08231906024015b602060405180830381865afa158015611377573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061139b9190614d0d565b6113a59190614ce4565b10156113ff5760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b5050505050505050565b611411613e05565b61141b6000613e6e565b565b80428110156114615760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168585611498600182614ce4565b8181106114a7576114a7614cf7565b90506020020160208101906114bc9190614c30565b6001600160a01b03161461150a5760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b611520858560008181106111a1576111a1614cf7565b61155e858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250309250613b22915050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156115c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115e99190614d0d565b9050868110156116475760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b604051632e1a7d4d60e01b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d90602401600060405180830381600087803b1580156116a957600080fd5b505af11580156116bd573d6000803e3d6000fd5b505050506113ff848261318e565b606081428110156117115760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168686600081811061174e5761174e614cf7565b90506020020160208101906117639190614c30565b6001600160a01b0316146117b15760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b6118117f00000000000000000000000000000000000000000000000000000000000000003460148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506133e892505050565b91508682600184516118239190614ce4565b8151811061183357611833614cf7565b602002602001015110156118955760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0836000815181106118d7576118d7614cf7565b60200260200101516040518263ffffffff1660e01b81526004016000604051808303818588803b15801561190a57600080fd5b505af115801561191e573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb6119897f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b8460008151811061199c5761199c614cf7565b60200260200101516040518363ffffffff1660e01b81526004016119d59291906001600160a01b03929092168252602082015260400190565b6020604051808303816000875af11580156119f4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a189190614d26565b611a2457611a24614d43565b611a638287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525089925061379f915050565b5095945050505050565b60006107588484846014613ed6565b60608142811015611ac25760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b611b227f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506139a092505050565b91508682600081518110611b3857611b38614cf7565b60200260200101511115610ddd5760405162461bcd60e51b815260206004820152601f60248201527f586368616e67653a204558434553534956455f494e5055545f414d4f554e54006044820152606401610671565b60608167ffffffffffffffff811115611ba957611ba9614730565b604051908082528060200260200182016040528015611bdc57816020015b6060815260200190600190039081611bc75790505b50905060005b82811015611cd45760008030868685818110611c0057611c00614cf7565b9050602002810190611c129190614d59565b604051611c20929190614da0565b600060405180830381855af49150503d8060008114611c5b576040519150601f19603f3d011682016040523d82523d6000602084013e611c60565b606091505b509150915081611cac57604481511015611c7957600080fd5b60048101905080806020019051810190611c939190614db0565b60405162461bcd60e51b81526004016106719190614e3b565b80848481518110611cbf57611cbf614cf7565b60209081029190910101525050600101611be2565b5092915050565b6000610758848484614067565b60008142811015611d2e5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b611d5d887f000000000000000000000000000000000000000000000000000000000000000089898930896121f4565b6040516370a0823160e01b8152306004820152909350611dd69150899086906001600160a01b038316906370a0823190602401602060405180830381865afa158015611dad573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dd19190614d0d565b61305e565b604051632e1a7d4d60e01b8152600481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d90602401600060405180830381600087803b158015611e3857600080fd5b505af1158015611e4c573d6000803e3d6000fd5b50505050610b0d848361318e565b8042811015611e9e5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031685856000818110611edb57611edb614cf7565b9050602002016020810190611ef09190614c30565b6001600160a01b031614611f3e5760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b60003490507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b158015611f9e57600080fd5b505af1158015611fb2573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb61201d7f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b1681526001600160a01b039091166004820152602481018490526044016020604051808303816000875af1158015612082573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120a69190614d26565b6120b2576120b2614d43565b600086866120c1600182614ce4565b8181106120d0576120d0614cf7565b90506020020160208101906120e59190614c30565b6040516370a0823160e01b81526001600160a01b03878116600483015291909116906370a0823190602401602060405180830381865afa15801561212d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121519190614d0d565b9050612191878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613b22915050565b878188886121a0600182614ce4565b8181106121af576121af614cf7565b90506020020160208101906121c49190614c30565b6040516370a0823160e01b81526001600160a01b03898116600483015291909116906370a082319060240161135a565b600080824281101561223b5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b60006122687f00000000000000000000000000000000000000000000000000000000000000008c8c613569565b6040516323b872dd60e01b81523360048201526001600160a01b03821660248201819052604482018c90529192506323b872dd906064016020604051808303816000875af11580156122be573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122e29190614d26565b5060405163226bf2d160e21b81526001600160a01b03878116600483015260009182918416906389afcb449060240160408051808303816000875af115801561232f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123539190614e4e565b9150915060006123638e8e614144565b509050806001600160a01b03168e6001600160a01b031614612386578183612389565b82825b90975095508a8710156123de5760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f415f414d4f554e5400006044820152606401610671565b8986101561242e5760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f425f414d4f554e5400006044820152606401610671565b505050505097509795505050505050565b6060610b477f0000000000000000000000000000000000000000000000000000000000000000846014856133e8565b60008060006124be7f00000000000000000000000000000000000000000000000000000000000000008e7f0000000000000000000000000000000000000000000000000000000000000000613569565b90506000876124cd578c6124d1565b6000195b60405163d505accf60e01b815233600482015230602482015260448101829052606481018b905260ff8916608482015260a4810188905260c481018790529091506001600160a01b0383169063d505accf9060e401600060405180830381600087803b15801561254057600080fd5b505af1158015612554573d6000803e3d6000fd5b505050506125668e8e8e8e8e8e61062e565b909f909e509c50505050505050505050505050565b600080600083428110156125c45760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6125d28c8c8c8c8c8c614239565b909450925060006126047f00000000000000000000000000000000000000000000000000000000000000008e8e613569565b90506126128d33838861365a565b61261e8c33838761365a565b6040516335313c2160e11b81526001600160a01b038881166004830152821690636a627842906024016020604051808303816000875af1158015612666573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061268a9190614d0d565b92505050985098509895505050505050565b6126a4613e05565b6001600160a01b0381166127205760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610671565b61272981613e6e565b50565b600080600083428110156127755760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6127a38a7f00000000000000000000000000000000000000000000000000000000000000008b348c8c614239565b909450925060006127f57f00000000000000000000000000000000000000000000000000000000000000008c7f0000000000000000000000000000000000000000000000000000000000000000613569565b90506128038b33838861365a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0856040518263ffffffff1660e01b81526004016000604051808303818588803b15801561285e57600080fd5b505af1158015612872573d6000803e3d6000fd5b505060405163a9059cbb60e01b81526001600160a01b038581166004830152602482018990527f000000000000000000000000000000000000000000000000000000000000000016935063a9059cbb925060440190506020604051808303816000875af11580156128e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061290b9190614d26565b61291757612917614d43565b6040516335313c2160e11b81526001600160a01b038881166004830152821690636a627842906024016020604051808303816000875af115801561295f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129839190614d0d565b9250833411156129a0576129a03361299b8634614ce4565b61318e565b505096509650969350505050565b60008083428110156129f55760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b604051632eb8193d60e21b81523360048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063bae064f490602401602060405180830381865afa158015612a59573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a7d9190614d26565b612a8657600080fd5b6000612ab37f00000000000000000000000000000000000000000000000000000000000000008d8d613569565b6040516323b872dd60e01b81523360048201526001600160a01b03821660248201819052604482018d90529192506323b872dd906064016020604051808303816000875af1158015612b09573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b2d9190614d26565b5060405163023d845560e21b81526001600160a01b0388811660048301526024820187905260009182918416906308f611549060440160408051808303816000875af1158015612b81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ba59190614e4e565b915091506000612bb58f8f614144565b509050806001600160a01b03168f6001600160a01b031614612bd8578183612bdb565b82825b90975095508b871015612c305760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f415f414d4f554e5400006044820152606401610671565b8a861015612c805760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f425f414d4f554e5400006044820152606401610671565b50505050509850989650505050505050565b60608142811015612cd85760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031686866000818110612d1557612d15614cf7565b9050602002016020810190612d2a9190614c30565b6001600160a01b031614612d785760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b612dd87f00000000000000000000000000000000000000000000000000000000000000008860148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506139a092505050565b91503482600081518110612dee57612dee614cf7565b60200260200101511115612e445760405162461bcd60e51b815260206004820152601f60248201527f586368616e67653a204558434553534956455f494e5055545f414d4f554e54006044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db083600081518110612e8657612e86614cf7565b60200260200101516040518263ffffffff1660e01b81526004016000604051808303818588803b158015612eb957600080fd5b505af1158015612ecd573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb612f387f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b84600081518110612f4b57612f4b614cf7565b60200260200101516040518363ffffffff1660e01b8152600401612f849291906001600160a01b03929092168252602082015260400190565b6020604051808303816000875af1158015612fa3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612fc79190614d26565b612fd357612fd3614d43565b6130128287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525089925061379f915050565b8160008151811061302557613025614cf7565b6020026020010151341115611a6357611a63338360008151811061304b5761304b614cf7565b60200260200101513461299b9190614ce4565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1663a9059cbb60e01b17905291516000928392908716916130cf9190614e72565b6000604051808303816000865af19150503d806000811461310c576040519150601f19603f3d011682016040523d82523d6000602084013e613111565b606091505b509150915081801561313b57508051158061313b57508080602001905181019061313b9190614d26565b6131875760405162461bcd60e51b815260206004820152601f60248201527f5472616e7366657248656c7065723a205452414e534645525f4641494c4544006044820152606401610671565b5050505050565b604080516000808252602082019092526001600160a01b0384169083906040516131b89190614e72565b60006040518083038185875af1925050503d80600081146131f5576040519150601f19603f3d011682016040523d82523d6000602084013e6131fa565b606091505b50509050806132575760405162461bcd60e51b815260206004820152602360248201527f5472616e7366657248656c7065723a204554485f5452414e534645525f46414960448201526213115160ea1b6064820152608401610671565b505050565b60008085116132d35760405162461bcd60e51b815260206004820152602960248201527f586368616e67654c6962726172793a20494e53554646494349454e545f494e5060448201527f55545f414d4f554e5400000000000000000000000000000000000000000000006064820152608401610671565b6000841180156132e35750600083115b61333e5760405162461bcd60e51b815260206004820152602660248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4c495160448201526555494449545960d01b6064820152608401610671565b601482111561338f5760405162461bcd60e51b815260206004820152601d60248201527f586368616e67654c6962726172793a204558434553534956455f4645450000006044820152606401610671565b600061339d83612710614ce4565b6133a79087614e8e565b905060006133b58583614e8e565b90506000826133c688612710614e8e565b6133d09190614ea5565b90506133dc8183614eb8565b98975050505050505050565b606060028251101561343c5760405162461bcd60e51b815260206004820152601c60248201527f586368616e67654c6962726172793a20494e56414c49445f50415448000000006044820152606401610671565b815167ffffffffffffffff81111561345657613456614730565b60405190808252806020026020018201604052801561347f578160200160208202803683370190505b509050838160008151811061349657613496614cf7565b60200260200101818152505060005b600183516134b39190614ce4565b81101561356057600080613506888685815181106134d3576134d3614cf7565b6020026020010151878660016134e99190614ea5565b815181106134f9576134f9614cf7565b60200260200101516144bd565b9150915061352f84848151811061351f5761351f614cf7565b602002602001015183838961325c565b8461353b856001614ea5565b8151811061354b5761354b614cf7565b602090810291909101015250506001016134a5565b50949350505050565b60008060006135788585614144565b6040516bffffffffffffffffffffffff19606084811b8216602084015283901b16603482015291935091508690604801604051602081830303815290604052805190602001206040516020016136389291907fff00000000000000000000000000000000000000000000000000000000000000815260609290921b6bffffffffffffffffffffffff1916600183015260158201527fd75846df8bac2f946ea9ee78caa53b6812e7514197698275b8322d75e1543193603582015260550190565b60408051601f1981840301815291905280516020909101209695505050505050565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166323b872dd60e01b17905291516000928392908816916136d39190614e72565b6000604051808303816000865af19150503d8060008114613710576040519150601f19603f3d011682016040523d82523d6000602084013e613715565b606091505b509150915081801561373f57508051158061373f57508080602001905181019061373f9190614d26565b6137975760405162461bcd60e51b8152602060048201526024808201527f5472616e7366657248656c7065723a205452414e534645525f46524f4d5f46416044820152631253115160e21b6064820152608401610671565b505050505050565b60005b600183516137b09190614ce4565b81101561399a576000808483815181106137cc576137cc614cf7565b6020026020010151858460016137e29190614ea5565b815181106137f2576137f2614cf7565b602002602001015191509150600061380a8383614144565b50905060008761381b866001614ea5565b8151811061382b5761382b614cf7565b60200260200101519050600080836001600160a01b0316866001600160a01b0316146138595782600061385d565b6000835b91509150600060028a516138719190614ce4565b881061387d57886138cb565b6138cb7f0000000000000000000000000000000000000000000000000000000000000000878c6138ae8c6002614ea5565b815181106138be576138be614cf7565b6020026020010151613569565b90506138f87f00000000000000000000000000000000000000000000000000000000000000008888613569565b6001600160a01b031663022c0d9f84848460006040519080825280601f01601f191660200182016040528015613935576020820181803683370190505b506040518563ffffffff1660e01b81526004016139559493929190614eda565b600060405180830381600087803b15801561396f57600080fd5b505af1158015613983573d6000803e3d6000fd5b5050600190990198506137a2975050505050505050565b50505050565b60606002825110156139f45760405162461bcd60e51b815260206004820152601c60248201527f586368616e67654c6962726172793a20494e56414c49445f50415448000000006044820152606401610671565b815167ffffffffffffffff811115613a0e57613a0e614730565b604051908082528060200260200182016040528015613a37578160200160208202803683370190505b509050838160018351613a4a9190614ce4565b81518110613a5a57613a5a614cf7565b602002602001018181525050600060018351613a769190614ce4565b90505b801561356057600080613abc8886613a92600187614ce4565b81518110613aa257613aa2614cf7565b60200260200101518786815181106134f9576134f9614cf7565b91509150613ae5848481518110613ad557613ad5614cf7565b6020026020010151838389613ed6565b84613af1600186614ce4565b81518110613b0157613b01614cf7565b60200260200101818152505050508080613b1a90614f12565b915050613a79565b60005b60018351613b339190614ce4565b81101561325757600080848381518110613b4f57613b4f614cf7565b602002602001015185846001613b659190614ea5565b81518110613b7557613b75614cf7565b6020026020010151915091506000613b8d8383614144565b5090506000613bbd7f00000000000000000000000000000000000000000000000000000000000000008585613569565b9050600080600080846001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015613c03573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c279190614f47565b506dffffffffffffffffffffffffffff1691506dffffffffffffffffffffffffffff169150600080876001600160a01b03168a6001600160a01b031614613c6f578284613c72565b83835b6040516370a0823160e01b81526001600160a01b038a8116600483015292945090925083918c16906370a0823190602401602060405180830381865afa158015613cc0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ce49190614d0d565b613cee9190614ce4565b9550613cfd868383601461325c565b945050505050600080856001600160a01b0316886001600160a01b031614613d2757826000613d2b565b6000835b91509150600060028c51613d3f9190614ce4565b8a10613d4b578a613d7c565b613d7c7f0000000000000000000000000000000000000000000000000000000000000000898e6138ae8e6002614ea5565b6040805160008152602081019182905263022c0d9f60e01b9091529091506001600160a01b0387169063022c0d9f90613dbe9086908690869060248101614eda565b600060405180830381600087803b158015613dd857600080fd5b505af1158015613dec573d6000803e3d6000fd5b50506001909b019a50613b259950505050505050505050565b33613e186000546001600160a01b031690565b6001600160a01b03161461141b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610671565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000808511613f4d5760405162461bcd60e51b815260206004820152602a60248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4f555460448201527f5055545f414d4f554e54000000000000000000000000000000000000000000006064820152608401610671565b600084118015613f5d5750600083115b613fb85760405162461bcd60e51b815260206004820152602660248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4c495160448201526555494449545960d01b6064820152608401610671565b60148211156140095760405162461bcd60e51b815260206004820152601d60248201527f586368616e67654c6962726172793a204558434553534956455f4645450000006044820152606401610671565b60006140158686614e8e565b61402190612710614e8e565b9050600061403184612710614ce4565b61403b8887614ce4565b6140459190614e8e565b90506140518183614eb8565b61405c906001614ea5565b979650505050505050565b60008084116140c45760405162461bcd60e51b815260206004820152602360248201527f586368616e67654c6962726172793a20494e53554646494349454e545f414d4f60448201526215539560ea1b6064820152608401610671565b6000831180156140d45750600082115b61412f5760405162461bcd60e51b815260206004820152602660248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4c495160448201526555494449545960d01b6064820152608401610671565b8261413a8386614e8e565b6107589190614eb8565b600080826001600160a01b0316846001600160a01b0316036141b45760405162461bcd60e51b815260206004820152602360248201527f586368616e67654c6962726172793a204944454e544943414c5f41444452455360448201526253455360e81b6064820152608401610671565b826001600160a01b0316846001600160a01b0316106141d45782846141d7565b83835b90925090506001600160a01b0382166142325760405162461bcd60e51b815260206004820152601c60248201527f586368616e67654c6962726172793a205a45524f5f41444452455353000000006044820152606401610671565b9250929050565b60405163e6a4390560e01b81526001600160a01b0387811660048301528681166024830152600091829182917f00000000000000000000000000000000000000000000000000000000000000009091169063e6a4390590604401602060405180830381865afa1580156142b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906142d49190614f97565b6001600160a01b031603614378576040516364e329cb60e11b81526001600160a01b03898116600483015288811660248301527f0000000000000000000000000000000000000000000000000000000000000000169063c9c65396906044016020604051808303816000875af1158015614352573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906143769190614f97565b505b6000806143a67f00000000000000000000000000000000000000000000000000000000000000008b8b6144bd565b915091508160001480156143b8575080155b156143c8578793508692506144b0565b60006143d5898484614067565b9050878111614439578581101561442e5760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f425f414d4f554e5400006044820152606401610671565b8894509250826144ae565b6000614446898486614067565b90508981111561445857614458614d43565b878110156144a85760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f415f414d4f554e5400006044820152606401610671565b94508793505b505b5050965096945050505050565b60008060006144cc8585614144565b5090506000806144dd888888613569565b6001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa15801561451a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061453e9190614f47565b506dffffffffffffffffffffffffffff1691506dffffffffffffffffffffffffffff169150826001600160a01b0316876001600160a01b031614614583578082614586565b81815b90999098509650505050505050565b6001600160a01b038116811461272957600080fd5b60008060008060008060c087890312156145c357600080fd5b86356145ce81614595565b955060208701359450604087013593506060870135925060808701356145f381614595565b8092505060a087013590509295509295509295565b60008060006060848603121561461d57600080fd5b505081359360208301359350604090920135919050565b60008083601f84011261464657600080fd5b50813567ffffffffffffffff81111561465e57600080fd5b6020830191508360208260051b850101111561423257600080fd5b60008060008060008060a0878903121561469257600080fd5b8635955060208701359450604087013567ffffffffffffffff8111156146b757600080fd5b6146c389828a01614634565b90955093505060608701356146d781614595565b80925050608087013590509295509295509295565b6020808252825182820181905260009190848201906040850190845b8181101561472457835183529284019291840191600101614708565b50909695505050505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561476f5761476f614730565b604052919050565b6000806040838503121561478a57600080fd5b8235915060208084013567ffffffffffffffff808211156147aa57600080fd5b818601915086601f8301126147be57600080fd5b8135818111156147d0576147d0614730565b8060051b91506147e1848301614746565b81815291830184019184810190898411156147fb57600080fd5b938501935b83851015614825578435925061481583614595565b8282529385019390850190614800565b8096505050505050509250929050565b60008060006040848603121561484a57600080fd5b83359250602084013567ffffffffffffffff81111561486857600080fd5b61487486828701614634565b9497909650939450505050565b60005b8381101561489c578181015183820152602001614884565b50506000910152565b600081518084526148bd816020860160208601614881565b601f01601f19169290920160200192915050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561492857603f198886030184526149168583516148a5565b945092850192908501906001016148fa565b5092979650505050505050565b801515811461272957600080fd5b803560ff8116811461495457600080fd5b919050565b60008060008060008060008060008060006101608c8e03121561497b57600080fd5b8b3561498681614595565b9a5060208c013561499681614595565b995060408c0135985060608c0135975060808c0135965060a08c01356149bb81614595565b955060c08c0135945060e08c01356149d281614935565b93506149e16101008d01614943565b92506101208c013591506101408c013590509295989b509295989b9093969950565b6000806000806000806000806000806101408b8d031215614a2357600080fd5b8a35614a2e81614595565b995060208b0135985060408b0135975060608b0135965060808b0135614a5381614595565b955060a08b0135945060c08b0135614a6a81614935565b9350614a7860e08c01614943565b92506101008b013591506101208b013590509295989b9194979a5092959850565b600080600080600060808688031215614ab157600080fd5b85359450602086013567ffffffffffffffff811115614acf57600080fd5b614adb88828901614634565b9095509350506040860135614aef81614595565b949793965091946060013592915050565b60008060208385031215614b1357600080fd5b823567ffffffffffffffff811115614b2a57600080fd5b614b3685828601614634565b90969095509350505050565b600080600080600080600060e0888a031215614b5d57600080fd5b8735614b6881614595565b96506020880135614b7881614595565b955060408801359450606088013593506080880135925060a0880135614b9d81614595565b8092505060c0880135905092959891949750929550565b600080600080600080600080610100898b031215614bd157600080fd5b8835614bdc81614595565b97506020890135614bec81614595565b965060408901359550606089013594506080890135935060a0890135925060c0890135614c1881614595565b8092505060e089013590509295985092959890939650565b600060208284031215614c4257600080fd5b8135614c4d81614595565b9392505050565b600080600080600080600080610100898b031215614c7157600080fd5b8835614c7c81614595565b97506020890135614c8c81614595565b965060408901359550606089013594506080890135935060a0890135614cb181614595565b979a969950949793969295929450505060c08201359160e0013590565b634e487b7160e01b600052601160045260246000fd5b81810381811115610b4a57610b4a614cce565b634e487b7160e01b600052603260045260246000fd5b600060208284031215614d1f57600080fd5b5051919050565b600060208284031215614d3857600080fd5b8151614c4d81614935565b634e487b7160e01b600052600160045260246000fd5b6000808335601e19843603018112614d7057600080fd5b83018035915067ffffffffffffffff821115614d8b57600080fd5b60200191503681900382131561423257600080fd5b8183823760009101908152919050565b600060208284031215614dc257600080fd5b815167ffffffffffffffff80821115614dda57600080fd5b818401915084601f830112614dee57600080fd5b815181811115614e0057614e00614730565b614e13601f8201601f1916602001614746565b9150808252856020828501011115614e2a57600080fd5b613560816020840160208601614881565b602081526000610b4760208301846148a5565b60008060408385031215614e6157600080fd5b505080516020909101519092909150565b60008251614e84818460208701614881565b9190910192915050565b8082028115828204841417610b4a57610b4a614cce565b80820180821115610b4a57610b4a614cce565b600082614ed557634e487b7160e01b600052601260045260246000fd5b500490565b8481528360208201526001600160a01b0383166040820152608060608201526000614f0860808301846148a5565b9695505050505050565b600081614f2157614f21614cce565b506000190190565b80516dffffffffffffffffffffffffffff8116811461495457600080fd5b600080600060608486031215614f5c57600080fd5b614f6584614f29565b9250614f7360208501614f29565b9150604084015163ffffffff81168114614f8c57600080fd5b809150509250925092565b600060208284031215614fa957600080fd5b8151614c4d8161459556fea2646970667358221220d23ee3d8868e7b0bfdaba3641ca226722f56cc412625496b8fe1db314b7f995664736f6c634300081900330000000000000000000000008b76c05676d205563ffc1cbd11c0a6e3d83929c5000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000f7c5c8bdd689767e039c631ad42482128bd54ba3",
    },
  },
  [ChainId.BASE]: {
    [Implementation.XCHANGE]: {
      [Protocol.V2]:
        "0x60c060405234801561001057600080fd5b5060405161528d38038061528d83398101604081905261002f916100d1565b73c71a68467c5e090a61079797e1ed96df7da6926661004d81610065565b506001600160a01b039182166080521660a052610104565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146100cc57600080fd5b919050565b600080604083850312156100e457600080fd5b6100ed836100b5565b91506100fb602084016100b5565b90509250929050565b60805160a051614fea6102a3600039600081816101ec0152818161048401528181610680015281816106cf015281816107b001528181610a3901528181610e820152818161106a0152818161146b015281816115760152818161165d01528181611713015281816118970152818161192501528181611d3401528181611dec01528181611ea001528181611f4501528181611fb90152818161249a0152818161277b015281816127d1015281816128050152818161289a01528181612cda01528181612e460152612ed401526000818161052b015281816108540152818161096401528181610b1f01528181610bca01528181610cfe01528181610f2601528181611048015281816111bc015281816117b60152818161195701528181611ac701528181611feb015281816122420152818161244601528181612478015281816125de015281816127af01528181612a0a01528181612a8d01528181612d7d01528181612f0601528181613882015281816138d201528181613b9701528181613d50015281816142670152818161430901526143800152614fea6000f3fe6080604052600436106101dc5760003560e01c80638803dbee11610102578063c45a015511610095578063f2fde38b11610064578063f2fde38b146105c8578063f305d719146105e8578063f84b6a4c146105fb578063fb3bdb411461061b57600080fd5b8063c45a015514610519578063d06ca61f1461054d578063ded9382a1461056d578063e8e337001461058d57600080fd5b8063ad615dec116100d1578063ad615dec146104a6578063af2979eb146104c6578063b6f9de95146104e6578063baa2abde146104f957600080fd5b80638803dbee1461040d5780638da5cb5b1461042d578063ac9650d81461045f578063ad5c46481461047257600080fd5b80634a25d94a1161017a578063715018a611610149578063715018a6146103a5578063791ac947146103ba5780637ff36ab5146103da57806385f8c259146103ed57600080fd5b80634a25d94a146103325780635ae401dc146103525780635b0d5984146103655780635c11d7951461038557600080fd5b80631f00ca74116101b65780631f00ca74146102b25780631f0464d1146102d25780632195995c146102f257806338ed17391461031257600080fd5b806302751cec1461021d578063054d50d41461025757806318cbafe51461028557600080fd5b3661021857336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461021657600080fd5b005b600080fd5b34801561022957600080fd5b5061023d6102383660046145aa565b61062e565b604080519283526020830191909152015b60405180910390f35b34801561026357600080fd5b50610277610272366004614608565b610749565b60405190815260200161024e565b34801561029157600080fd5b506102a56102a0366004614679565b610760565b60405161024e91906146ec565b3480156102be57600080fd5b506102a56102cd366004614777565b610b18565b6102e56102e0366004614835565b610b50565b60405161024e91906148d1565b3480156102fe57600080fd5b5061023d61030d366004614959565b610bc0565b34801561031e57600080fd5b506102a561032d366004614679565b610cb3565b34801561033e57600080fd5b506102a561034d366004614679565b610e32565b6102e5610360366004614835565b610fed565b34801561037157600080fd5b50610277610380366004614a03565b611040565b34801561039157600080fd5b506102166103a0366004614679565b611147565b3480156103b157600080fd5b50610216611409565b3480156103c657600080fd5b506102166103d5366004614679565b61141d565b6102a56103e8366004614a99565b6116cb565b3480156103f957600080fd5b50610277610408366004614608565b611a6d565b34801561041957600080fd5b506102a5610428366004614679565b611a7c565b34801561043957600080fd5b506000546001600160a01b03165b6040516001600160a01b03909116815260200161024e565b6102e561046d366004614b00565b611b8e565b34801561047e57600080fd5b506104477f000000000000000000000000000000000000000000000000000000000000000081565b3480156104b257600080fd5b506102776104c1366004614608565b611cdb565b3480156104d257600080fd5b506102776104e13660046145aa565b611ce8565b6102166104f4366004614a99565b611e5a565b34801561050557600080fd5b5061023d610514366004614b42565b6121f4565b34801561052557600080fd5b506104477f000000000000000000000000000000000000000000000000000000000000000081565b34801561055957600080fd5b506102a5610568366004614777565b61243f565b34801561057957600080fd5b5061023d610588366004614a03565b61246e565b34801561059957600080fd5b506105ad6105a8366004614bb4565b61257b565b6040805193845260208401929092529082015260600161024e565b3480156105d457600080fd5b506102166105e3366004614c30565b61269c565b6105ad6105f63660046145aa565b61272c565b34801561060757600080fd5b5061023d610616366004614c54565b6129ae565b6102a5610629366004614a99565b612c92565b600080824281101561067a5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b60448201526064015b60405180910390fd5b6106a9897f00000000000000000000000000000000000000000000000000000000000000008a8a8a308a6121f4565b90935091506106b989868561305e565b604051632e1a7d4d60e01b8152600481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d90602401600060405180830381600087803b15801561071b57600080fd5b505af115801561072f573d6000803e3d6000fd5b5050505061073d858361318e565b50965096945050505050565b6000610758848484601461325c565b949350505050565b606081428110156107a65760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001686866107dd600182614ce4565b8181106107ec576107ec614cf7565b90506020020160208101906108019190614c30565b6001600160a01b03161461084f5760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b6108af7f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506133e892505050565b91508682600184516108c19190614ce4565b815181106108d1576108d1614cf7565b602002602001015110156109335760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b6109f88686600081811061094957610949614cf7565b905060200201602081019061095e9190614c30565b336109d87f00000000000000000000000000000000000000000000000000000000000000008a8a600081811061099657610996614cf7565b90506020020160208101906109ab9190614c30565b8b8b60018181106109be576109be614cf7565b90506020020160208101906109d39190614c30565b613569565b856000815181106109eb576109eb614cf7565b602002602001015161365a565b610a378287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525030925061379f915050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d8360018551610a759190614ce4565b81518110610a8557610a85614cf7565b60200260200101516040518263ffffffff1660e01b8152600401610aab91815260200190565b600060405180830381600087803b158015610ac557600080fd5b505af1158015610ad9573d6000803e3d6000fd5b50505050610b0d848360018551610af09190614ce4565b81518110610b0057610b00614cf7565b602002602001015161318e565b509695505050505050565b6060610b477f0000000000000000000000000000000000000000000000000000000000000000846014856139a0565b90505b92915050565b60608380610b5f600143614ce4565b4014610bad5760405162461bcd60e51b815260206004820152600960248201527f426c6f636b6861736800000000000000000000000000000000000000000000006044820152606401610671565b610bb78484611b8e565b95945050505050565b6000806000610bf07f00000000000000000000000000000000000000000000000000000000000000008f8f613569565b9050600087610bff578c610c03565b6000195b60405163d505accf60e01b815233600482015230602482015260448101829052606481018b905260ff8916608482015260a4810188905260c481018790529091506001600160a01b0383169063d505accf9060e401600060405180830381600087803b158015610c7257600080fd5b505af1158015610c86573d6000803e3d6000fd5b50505050610c998f8f8f8f8f8f8f6121f4565b809450819550505050509b509b9950505050505050505050565b60608142811015610cf95760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b610d597f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506133e892505050565b9150868260018451610d6b9190614ce4565b81518110610d7b57610d7b614cf7565b60200260200101511015610ddd5760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b610df38686600081811061094957610949614cf7565b610b0d8287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525089925061379f915050565b60608142811015610e785760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168686610eaf600182614ce4565b818110610ebe57610ebe614cf7565b9050602002016020810190610ed39190614c30565b6001600160a01b031614610f215760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b610f817f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506139a092505050565b91508682600081518110610f9757610f97614cf7565b602002602001015111156109335760405162461bcd60e51b815260206004820152601f60248201527f586368616e67653a204558434553534956455f494e5055545f414d4f554e54006044820152606401610671565b60608380421115610bad5760405162461bcd60e51b815260206004820152601360248201527f5472616e73616374696f6e20746f6f206f6c64000000000000000000000000006044820152606401610671565b60008061108e7f00000000000000000000000000000000000000000000000000000000000000008d7f0000000000000000000000000000000000000000000000000000000000000000613569565b905060008661109d578b6110a1565b6000195b60405163d505accf60e01b815233600482015230602482015260448101829052606481018a905260ff8816608482015260a4810187905260c481018690529091506001600160a01b0383169063d505accf9060e401600060405180830381600087803b15801561111057600080fd5b505af1158015611124573d6000803e3d6000fd5b505050506111368d8d8d8d8d8d611ce8565b9d9c50505050505050505050505050565b804281101561118b5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b61121c858560008181106111a1576111a1614cf7565b90506020020160208101906111b69190614c30565b336112167f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b90506020020160208101906112039190614c30565b8a8a60018181106109be576109be614cf7565b8a61365a565b6000858561122b600182614ce4565b81811061123a5761123a614cf7565b905060200201602081019061124f9190614c30565b6040516370a0823160e01b81526001600160a01b03868116600483015291909116906370a0823190602401602060405180830381865afa158015611297573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112bb9190614d0d565b90506112fb868680806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250889250613b22915050565b8681878761130a600182614ce4565b81811061131957611319614cf7565b905060200201602081019061132e9190614c30565b6040516370a0823160e01b81526001600160a01b03888116600483015291909116906370a08231906024015b602060405180830381865afa158015611377573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061139b9190614d0d565b6113a59190614ce4565b10156113ff5760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b5050505050505050565b611411613e05565b61141b6000613e6e565b565b80428110156114615760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168585611498600182614ce4565b8181106114a7576114a7614cf7565b90506020020160208101906114bc9190614c30565b6001600160a01b03161461150a5760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b611520858560008181106111a1576111a1614cf7565b61155e858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250309250613b22915050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156115c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115e99190614d0d565b9050868110156116475760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b604051632e1a7d4d60e01b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d90602401600060405180830381600087803b1580156116a957600080fd5b505af11580156116bd573d6000803e3d6000fd5b505050506113ff848261318e565b606081428110156117115760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168686600081811061174e5761174e614cf7565b90506020020160208101906117639190614c30565b6001600160a01b0316146117b15760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b6118117f00000000000000000000000000000000000000000000000000000000000000003460148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506133e892505050565b91508682600184516118239190614ce4565b8151811061183357611833614cf7565b602002602001015110156118955760405162461bcd60e51b815260206004820152602360248201527f586368616e67653a20494e53554646494349454e545f4f55545055545f414d4f60448201526215539560ea1b6064820152608401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0836000815181106118d7576118d7614cf7565b60200260200101516040518263ffffffff1660e01b81526004016000604051808303818588803b15801561190a57600080fd5b505af115801561191e573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb6119897f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b8460008151811061199c5761199c614cf7565b60200260200101516040518363ffffffff1660e01b81526004016119d59291906001600160a01b03929092168252602082015260400190565b6020604051808303816000875af11580156119f4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a189190614d26565b611a2457611a24614d43565b611a638287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525089925061379f915050565b5095945050505050565b60006107588484846014613ed6565b60608142811015611ac25760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b611b227f00000000000000000000000000000000000000000000000000000000000000008960148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506139a092505050565b91508682600081518110611b3857611b38614cf7565b60200260200101511115610ddd5760405162461bcd60e51b815260206004820152601f60248201527f586368616e67653a204558434553534956455f494e5055545f414d4f554e54006044820152606401610671565b60608167ffffffffffffffff811115611ba957611ba9614730565b604051908082528060200260200182016040528015611bdc57816020015b6060815260200190600190039081611bc75790505b50905060005b82811015611cd45760008030868685818110611c0057611c00614cf7565b9050602002810190611c129190614d59565b604051611c20929190614da0565b600060405180830381855af49150503d8060008114611c5b576040519150601f19603f3d011682016040523d82523d6000602084013e611c60565b606091505b509150915081611cac57604481511015611c7957600080fd5b60048101905080806020019051810190611c939190614db0565b60405162461bcd60e51b81526004016106719190614e3b565b80848481518110611cbf57611cbf614cf7565b60209081029190910101525050600101611be2565b5092915050565b6000610758848484614067565b60008142811015611d2e5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b611d5d887f000000000000000000000000000000000000000000000000000000000000000089898930896121f4565b6040516370a0823160e01b8152306004820152909350611dd69150899086906001600160a01b038316906370a0823190602401602060405180830381865afa158015611dad573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dd19190614d0d565b61305e565b604051632e1a7d4d60e01b8152600481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d90602401600060405180830381600087803b158015611e3857600080fd5b505af1158015611e4c573d6000803e3d6000fd5b50505050610b0d848361318e565b8042811015611e9e5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031685856000818110611edb57611edb614cf7565b9050602002016020810190611ef09190614c30565b6001600160a01b031614611f3e5760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b60003490507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b158015611f9e57600080fd5b505af1158015611fb2573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb61201d7f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b1681526001600160a01b039091166004820152602481018490526044016020604051808303816000875af1158015612082573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120a69190614d26565b6120b2576120b2614d43565b600086866120c1600182614ce4565b8181106120d0576120d0614cf7565b90506020020160208101906120e59190614c30565b6040516370a0823160e01b81526001600160a01b03878116600483015291909116906370a0823190602401602060405180830381865afa15801561212d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906121519190614d0d565b9050612191878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613b22915050565b878188886121a0600182614ce4565b8181106121af576121af614cf7565b90506020020160208101906121c49190614c30565b6040516370a0823160e01b81526001600160a01b03898116600483015291909116906370a082319060240161135a565b600080824281101561223b5760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b60006122687f00000000000000000000000000000000000000000000000000000000000000008c8c613569565b6040516323b872dd60e01b81523360048201526001600160a01b03821660248201819052604482018c90529192506323b872dd906064016020604051808303816000875af11580156122be573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122e29190614d26565b5060405163226bf2d160e21b81526001600160a01b03878116600483015260009182918416906389afcb449060240160408051808303816000875af115801561232f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123539190614e4e565b9150915060006123638e8e614144565b509050806001600160a01b03168e6001600160a01b031614612386578183612389565b82825b90975095508a8710156123de5760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f415f414d4f554e5400006044820152606401610671565b8986101561242e5760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f425f414d4f554e5400006044820152606401610671565b505050505097509795505050505050565b6060610b477f0000000000000000000000000000000000000000000000000000000000000000846014856133e8565b60008060006124be7f00000000000000000000000000000000000000000000000000000000000000008e7f0000000000000000000000000000000000000000000000000000000000000000613569565b90506000876124cd578c6124d1565b6000195b60405163d505accf60e01b815233600482015230602482015260448101829052606481018b905260ff8916608482015260a4810188905260c481018790529091506001600160a01b0383169063d505accf9060e401600060405180830381600087803b15801561254057600080fd5b505af1158015612554573d6000803e3d6000fd5b505050506125668e8e8e8e8e8e61062e565b909f909e509c50505050505050505050505050565b600080600083428110156125c45760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6125d28c8c8c8c8c8c614239565b909450925060006126047f00000000000000000000000000000000000000000000000000000000000000008e8e613569565b90506126128d33838861365a565b61261e8c33838761365a565b6040516335313c2160e11b81526001600160a01b038881166004830152821690636a627842906024016020604051808303816000875af1158015612666573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061268a9190614d0d565b92505050985098509895505050505050565b6126a4613e05565b6001600160a01b0381166127205760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610671565b61272981613e6e565b50565b600080600083428110156127755760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b6127a38a7f00000000000000000000000000000000000000000000000000000000000000008b348c8c614239565b909450925060006127f57f00000000000000000000000000000000000000000000000000000000000000008c7f0000000000000000000000000000000000000000000000000000000000000000613569565b90506128038b33838861365a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0856040518263ffffffff1660e01b81526004016000604051808303818588803b15801561285e57600080fd5b505af1158015612872573d6000803e3d6000fd5b505060405163a9059cbb60e01b81526001600160a01b038581166004830152602482018990527f000000000000000000000000000000000000000000000000000000000000000016935063a9059cbb925060440190506020604051808303816000875af11580156128e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061290b9190614d26565b61291757612917614d43565b6040516335313c2160e11b81526001600160a01b038881166004830152821690636a627842906024016020604051808303816000875af115801561295f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129839190614d0d565b9250833411156129a0576129a03361299b8634614ce4565b61318e565b505096509650969350505050565b60008083428110156129f55760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b604051632eb8193d60e21b81523360048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063bae064f490602401602060405180830381865afa158015612a59573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a7d9190614d26565b612a8657600080fd5b6000612ab37f00000000000000000000000000000000000000000000000000000000000000008d8d613569565b6040516323b872dd60e01b81523360048201526001600160a01b03821660248201819052604482018d90529192506323b872dd906064016020604051808303816000875af1158015612b09573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b2d9190614d26565b5060405163023d845560e21b81526001600160a01b0388811660048301526024820187905260009182918416906308f611549060440160408051808303816000875af1158015612b81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ba59190614e4e565b915091506000612bb58f8f614144565b509050806001600160a01b03168f6001600160a01b031614612bd8578183612bdb565b82825b90975095508b871015612c305760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f415f414d4f554e5400006044820152606401610671565b8a861015612c805760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f425f414d4f554e5400006044820152606401610671565b50505050509850989650505050505050565b60608142811015612cd85760405162461bcd60e51b815260206004820152601060248201526f1618da185b99d94e881156141254915160821b6044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031686866000818110612d1557612d15614cf7565b9050602002016020810190612d2a9190614c30565b6001600160a01b031614612d785760405162461bcd60e51b81526020600482015260156024820152740b0c6d0c2dcceca7440929cac82989288bea082a89605b1b6044820152606401610671565b612dd87f00000000000000000000000000000000000000000000000000000000000000008860148989808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506139a092505050565b91503482600081518110612dee57612dee614cf7565b60200260200101511115612e445760405162461bcd60e51b815260206004820152601f60248201527f586368616e67653a204558434553534956455f494e5055545f414d4f554e54006044820152606401610671565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db083600081518110612e8657612e86614cf7565b60200260200101516040518263ffffffff1660e01b81526004016000604051808303818588803b158015612eb957600080fd5b505af1158015612ecd573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb612f387f0000000000000000000000000000000000000000000000000000000000000000898960008181106111ee576111ee614cf7565b84600081518110612f4b57612f4b614cf7565b60200260200101516040518363ffffffff1660e01b8152600401612f849291906001600160a01b03929092168252602082015260400190565b6020604051808303816000875af1158015612fa3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612fc79190614d26565b612fd357612fd3614d43565b6130128287878080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525089925061379f915050565b8160008151811061302557613025614cf7565b6020026020010151341115611a6357611a63338360008151811061304b5761304b614cf7565b60200260200101513461299b9190614ce4565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1663a9059cbb60e01b17905291516000928392908716916130cf9190614e72565b6000604051808303816000865af19150503d806000811461310c576040519150601f19603f3d011682016040523d82523d6000602084013e613111565b606091505b509150915081801561313b57508051158061313b57508080602001905181019061313b9190614d26565b6131875760405162461bcd60e51b815260206004820152601f60248201527f5472616e7366657248656c7065723a205452414e534645525f4641494c4544006044820152606401610671565b5050505050565b604080516000808252602082019092526001600160a01b0384169083906040516131b89190614e72565b60006040518083038185875af1925050503d80600081146131f5576040519150601f19603f3d011682016040523d82523d6000602084013e6131fa565b606091505b50509050806132575760405162461bcd60e51b815260206004820152602360248201527f5472616e7366657248656c7065723a204554485f5452414e534645525f46414960448201526213115160ea1b6064820152608401610671565b505050565b60008085116132d35760405162461bcd60e51b815260206004820152602960248201527f586368616e67654c6962726172793a20494e53554646494349454e545f494e5060448201527f55545f414d4f554e5400000000000000000000000000000000000000000000006064820152608401610671565b6000841180156132e35750600083115b61333e5760405162461bcd60e51b815260206004820152602660248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4c495160448201526555494449545960d01b6064820152608401610671565b601482111561338f5760405162461bcd60e51b815260206004820152601d60248201527f586368616e67654c6962726172793a204558434553534956455f4645450000006044820152606401610671565b600061339d83612710614ce4565b6133a79087614e8e565b905060006133b58583614e8e565b90506000826133c688612710614e8e565b6133d09190614ea5565b90506133dc8183614eb8565b98975050505050505050565b606060028251101561343c5760405162461bcd60e51b815260206004820152601c60248201527f586368616e67654c6962726172793a20494e56414c49445f50415448000000006044820152606401610671565b815167ffffffffffffffff81111561345657613456614730565b60405190808252806020026020018201604052801561347f578160200160208202803683370190505b509050838160008151811061349657613496614cf7565b60200260200101818152505060005b600183516134b39190614ce4565b81101561356057600080613506888685815181106134d3576134d3614cf7565b6020026020010151878660016134e99190614ea5565b815181106134f9576134f9614cf7565b60200260200101516144bd565b9150915061352f84848151811061351f5761351f614cf7565b602002602001015183838961325c565b8461353b856001614ea5565b8151811061354b5761354b614cf7565b602090810291909101015250506001016134a5565b50949350505050565b60008060006135788585614144565b6040516bffffffffffffffffffffffff19606084811b8216602084015283901b16603482015291935091508690604801604051602081830303815290604052805190602001206040516020016136389291907fff00000000000000000000000000000000000000000000000000000000000000815260609290921b6bffffffffffffffffffffffff1916600183015260158201527fd75846df8bac2f946ea9ee78caa53b6812e7514197698275b8322d75e1543193603582015260550190565b60408051601f1981840301815291905280516020909101209695505050505050565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166323b872dd60e01b17905291516000928392908816916136d39190614e72565b6000604051808303816000865af19150503d8060008114613710576040519150601f19603f3d011682016040523d82523d6000602084013e613715565b606091505b509150915081801561373f57508051158061373f57508080602001905181019061373f9190614d26565b6137975760405162461bcd60e51b8152602060048201526024808201527f5472616e7366657248656c7065723a205452414e534645525f46524f4d5f46416044820152631253115160e21b6064820152608401610671565b505050505050565b60005b600183516137b09190614ce4565b81101561399a576000808483815181106137cc576137cc614cf7565b6020026020010151858460016137e29190614ea5565b815181106137f2576137f2614cf7565b602002602001015191509150600061380a8383614144565b50905060008761381b866001614ea5565b8151811061382b5761382b614cf7565b60200260200101519050600080836001600160a01b0316866001600160a01b0316146138595782600061385d565b6000835b91509150600060028a516138719190614ce4565b881061387d57886138cb565b6138cb7f0000000000000000000000000000000000000000000000000000000000000000878c6138ae8c6002614ea5565b815181106138be576138be614cf7565b6020026020010151613569565b90506138f87f00000000000000000000000000000000000000000000000000000000000000008888613569565b6001600160a01b031663022c0d9f84848460006040519080825280601f01601f191660200182016040528015613935576020820181803683370190505b506040518563ffffffff1660e01b81526004016139559493929190614eda565b600060405180830381600087803b15801561396f57600080fd5b505af1158015613983573d6000803e3d6000fd5b5050600190990198506137a2975050505050505050565b50505050565b60606002825110156139f45760405162461bcd60e51b815260206004820152601c60248201527f586368616e67654c6962726172793a20494e56414c49445f50415448000000006044820152606401610671565b815167ffffffffffffffff811115613a0e57613a0e614730565b604051908082528060200260200182016040528015613a37578160200160208202803683370190505b509050838160018351613a4a9190614ce4565b81518110613a5a57613a5a614cf7565b602002602001018181525050600060018351613a769190614ce4565b90505b801561356057600080613abc8886613a92600187614ce4565b81518110613aa257613aa2614cf7565b60200260200101518786815181106134f9576134f9614cf7565b91509150613ae5848481518110613ad557613ad5614cf7565b6020026020010151838389613ed6565b84613af1600186614ce4565b81518110613b0157613b01614cf7565b60200260200101818152505050508080613b1a90614f12565b915050613a79565b60005b60018351613b339190614ce4565b81101561325757600080848381518110613b4f57613b4f614cf7565b602002602001015185846001613b659190614ea5565b81518110613b7557613b75614cf7565b6020026020010151915091506000613b8d8383614144565b5090506000613bbd7f00000000000000000000000000000000000000000000000000000000000000008585613569565b9050600080600080846001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015613c03573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613c279190614f47565b506dffffffffffffffffffffffffffff1691506dffffffffffffffffffffffffffff169150600080876001600160a01b03168a6001600160a01b031614613c6f578284613c72565b83835b6040516370a0823160e01b81526001600160a01b038a8116600483015292945090925083918c16906370a0823190602401602060405180830381865afa158015613cc0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ce49190614d0d565b613cee9190614ce4565b9550613cfd868383601461325c565b945050505050600080856001600160a01b0316886001600160a01b031614613d2757826000613d2b565b6000835b91509150600060028c51613d3f9190614ce4565b8a10613d4b578a613d7c565b613d7c7f0000000000000000000000000000000000000000000000000000000000000000898e6138ae8e6002614ea5565b6040805160008152602081019182905263022c0d9f60e01b9091529091506001600160a01b0387169063022c0d9f90613dbe9086908690869060248101614eda565b600060405180830381600087803b158015613dd857600080fd5b505af1158015613dec573d6000803e3d6000fd5b50506001909b019a50613b259950505050505050505050565b33613e186000546001600160a01b031690565b6001600160a01b03161461141b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610671565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000808511613f4d5760405162461bcd60e51b815260206004820152602a60248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4f555460448201527f5055545f414d4f554e54000000000000000000000000000000000000000000006064820152608401610671565b600084118015613f5d5750600083115b613fb85760405162461bcd60e51b815260206004820152602660248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4c495160448201526555494449545960d01b6064820152608401610671565b60148211156140095760405162461bcd60e51b815260206004820152601d60248201527f586368616e67654c6962726172793a204558434553534956455f4645450000006044820152606401610671565b60006140158686614e8e565b61402190612710614e8e565b9050600061403184612710614ce4565b61403b8887614ce4565b6140459190614e8e565b90506140518183614eb8565b61405c906001614ea5565b979650505050505050565b60008084116140c45760405162461bcd60e51b815260206004820152602360248201527f586368616e67654c6962726172793a20494e53554646494349454e545f414d4f60448201526215539560ea1b6064820152608401610671565b6000831180156140d45750600082115b61412f5760405162461bcd60e51b815260206004820152602660248201527f586368616e67654c6962726172793a20494e53554646494349454e545f4c495160448201526555494449545960d01b6064820152608401610671565b8261413a8386614e8e565b6107589190614eb8565b600080826001600160a01b0316846001600160a01b0316036141b45760405162461bcd60e51b815260206004820152602360248201527f586368616e67654c6962726172793a204944454e544943414c5f41444452455360448201526253455360e81b6064820152608401610671565b826001600160a01b0316846001600160a01b0316106141d45782846141d7565b83835b90925090506001600160a01b0382166142325760405162461bcd60e51b815260206004820152601c60248201527f586368616e67654c6962726172793a205a45524f5f41444452455353000000006044820152606401610671565b9250929050565b60405163e6a4390560e01b81526001600160a01b0387811660048301528681166024830152600091829182917f00000000000000000000000000000000000000000000000000000000000000009091169063e6a4390590604401602060405180830381865afa1580156142b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906142d49190614f97565b6001600160a01b031603614378576040516364e329cb60e11b81526001600160a01b03898116600483015288811660248301527f0000000000000000000000000000000000000000000000000000000000000000169063c9c65396906044016020604051808303816000875af1158015614352573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906143769190614f97565b505b6000806143a67f00000000000000000000000000000000000000000000000000000000000000008b8b6144bd565b915091508160001480156143b8575080155b156143c8578793508692506144b0565b60006143d5898484614067565b9050878111614439578581101561442e5760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f425f414d4f554e5400006044820152606401610671565b8894509250826144ae565b6000614446898486614067565b90508981111561445857614458614d43565b878110156144a85760405162461bcd60e51b815260206004820152601e60248201527f586368616e67653a20494e53554646494349454e545f415f414d4f554e5400006044820152606401610671565b94508793505b505b5050965096945050505050565b60008060006144cc8585614144565b5090506000806144dd888888613569565b6001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa15801561451a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061453e9190614f47565b506dffffffffffffffffffffffffffff1691506dffffffffffffffffffffffffffff169150826001600160a01b0316876001600160a01b031614614583578082614586565b81815b90999098509650505050505050565b6001600160a01b038116811461272957600080fd5b60008060008060008060c087890312156145c357600080fd5b86356145ce81614595565b955060208701359450604087013593506060870135925060808701356145f381614595565b8092505060a087013590509295509295509295565b60008060006060848603121561461d57600080fd5b505081359360208301359350604090920135919050565b60008083601f84011261464657600080fd5b50813567ffffffffffffffff81111561465e57600080fd5b6020830191508360208260051b850101111561423257600080fd5b60008060008060008060a0878903121561469257600080fd5b8635955060208701359450604087013567ffffffffffffffff8111156146b757600080fd5b6146c389828a01614634565b90955093505060608701356146d781614595565b80925050608087013590509295509295509295565b6020808252825182820181905260009190848201906040850190845b8181101561472457835183529284019291840191600101614708565b50909695505050505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561476f5761476f614730565b604052919050565b6000806040838503121561478a57600080fd5b8235915060208084013567ffffffffffffffff808211156147aa57600080fd5b818601915086601f8301126147be57600080fd5b8135818111156147d0576147d0614730565b8060051b91506147e1848301614746565b81815291830184019184810190898411156147fb57600080fd5b938501935b83851015614825578435925061481583614595565b8282529385019390850190614800565b8096505050505050509250929050565b60008060006040848603121561484a57600080fd5b83359250602084013567ffffffffffffffff81111561486857600080fd5b61487486828701614634565b9497909650939450505050565b60005b8381101561489c578181015183820152602001614884565b50506000910152565b600081518084526148bd816020860160208601614881565b601f01601f19169290920160200192915050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561492857603f198886030184526149168583516148a5565b945092850192908501906001016148fa565b5092979650505050505050565b801515811461272957600080fd5b803560ff8116811461495457600080fd5b919050565b60008060008060008060008060008060006101608c8e03121561497b57600080fd5b8b3561498681614595565b9a5060208c013561499681614595565b995060408c0135985060608c0135975060808c0135965060a08c01356149bb81614595565b955060c08c0135945060e08c01356149d281614935565b93506149e16101008d01614943565b92506101208c013591506101408c013590509295989b509295989b9093969950565b6000806000806000806000806000806101408b8d031215614a2357600080fd5b8a35614a2e81614595565b995060208b0135985060408b0135975060608b0135965060808b0135614a5381614595565b955060a08b0135945060c08b0135614a6a81614935565b9350614a7860e08c01614943565b92506101008b013591506101208b013590509295989b9194979a5092959850565b600080600080600060808688031215614ab157600080fd5b85359450602086013567ffffffffffffffff811115614acf57600080fd5b614adb88828901614634565b9095509350506040860135614aef81614595565b949793965091946060013592915050565b60008060208385031215614b1357600080fd5b823567ffffffffffffffff811115614b2a57600080fd5b614b3685828601614634565b90969095509350505050565b600080600080600080600060e0888a031215614b5d57600080fd5b8735614b6881614595565b96506020880135614b7881614595565b955060408801359450606088013593506080880135925060a0880135614b9d81614595565b8092505060c0880135905092959891949750929550565b600080600080600080600080610100898b031215614bd157600080fd5b8835614bdc81614595565b97506020890135614bec81614595565b965060408901359550606089013594506080890135935060a0890135925060c0890135614c1881614595565b8092505060e089013590509295985092959890939650565b600060208284031215614c4257600080fd5b8135614c4d81614595565b9392505050565b600080600080600080600080610100898b031215614c7157600080fd5b8835614c7c81614595565b97506020890135614c8c81614595565b965060408901359550606089013594506080890135935060a0890135614cb181614595565b979a969950949793969295929450505060c08201359160e0013590565b634e487b7160e01b600052601160045260246000fd5b81810381811115610b4a57610b4a614cce565b634e487b7160e01b600052603260045260246000fd5b600060208284031215614d1f57600080fd5b5051919050565b600060208284031215614d3857600080fd5b8151614c4d81614935565b634e487b7160e01b600052600160045260246000fd5b6000808335601e19843603018112614d7057600080fd5b83018035915067ffffffffffffffff821115614d8b57600080fd5b60200191503681900382131561423257600080fd5b8183823760009101908152919050565b600060208284031215614dc257600080fd5b815167ffffffffffffffff80821115614dda57600080fd5b818401915084601f830112614dee57600080fd5b815181811115614e0057614e00614730565b614e13601f8201601f1916602001614746565b9150808252856020828501011115614e2a57600080fd5b613560816020840160208601614881565b602081526000610b4760208301846148a5565b60008060408385031215614e6157600080fd5b505080516020909101519092909150565b60008251614e84818460208701614881565b9190910192915050565b8082028115828204841417610b4a57610b4a614cce565b80820180821115610b4a57610b4a614cce565b600082614ed557634e487b7160e01b600052601260045260246000fd5b500490565b8481528360208201526001600160a01b0383166040820152608060608201526000614f0860808301846148a5565b9695505050505050565b600081614f2157614f21614cce565b506000190190565b80516dffffffffffffffffffffffffffff8116811461495457600080fd5b600080600060608486031215614f5c57600080fd5b614f6584614f29565b9250614f7360208501614f29565b9150604084015163ffffffff81168114614f8c57600080fd5b809150509250925092565b600060208284031215614fa957600080fd5b8151614c4d8161459556fea2646970667358221220d850c259ea2000ca6b41105882b1080aa0c126469f0c9de00c644b7f4609475f64736f6c634300081900330000000000000000000000008b76c05676d205563ffc1cbd11c0a6e3d83929c50000000000000000000000004200000000000000000000000000000000000006",
    },
  },
}
