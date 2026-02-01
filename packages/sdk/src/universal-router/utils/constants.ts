/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import { ChainId, WRAPPED_CONTRACTS } from "@x7/utils"

interface ChainConfig {
  router: `0x${string}`
  creationBlock: number
  weth: `0x${string}`
}

// TODO: explain
const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  [ChainId.ETHEREUM]: {
    router: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    weth: WRAPPED_CONTRACTS.WETH,
    creationBlock: 17143817,
  },
  [ChainId.BASE]: {
    router: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    weth: WRAPPED_CONTRACTS.BASE_WETH,
    creationBlock: 3229053,
  },
  [ChainId.BSC]: {
    router: "0x4Dae2f939ACf50408e13d58534Ff8c2776d45265",
    weth: WRAPPED_CONTRACTS.WBNB,
    creationBlock: 31254967,
  },
  [ChainId.POLYGON]: {
    router: "0x643770E279d5D0733F21d6DC03A8efbABf3255B4",
    weth: WRAPPED_CONTRACTS.WMATIC,
    creationBlock: 46866777,
  },
  [ChainId.OPTIMISM]: {
    router: "0xCb1355ff08Ab38bBCE60111F1bb2B784bE25D7e8",
    weth: "0x4200000000000000000000000000000000000006",
    creationBlock: 108825869,
  },
  [ChainId.ARBITRUM]: {
    router: "0x5E325eDA8064b456f4781070C0738d849c824258",
    weth: WRAPPED_CONTRACTS.ARBITRUM_WETH,
    creationBlock: 125861718,
  },
  [ChainId.POLYGON_TESTNET]: {
    router: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    weth: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    creationBlock: 35176052,
  },
  [ChainId.ETHEREUM_TESTNET]: {
    router: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    weth: WRAPPED_CONTRACTS.WETH_TESTNET,
    creationBlock: 3543575,
  },
  [ChainId.ARBITRUM_TESTNET]: {
    router: "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",
    weth: WRAPPED_CONTRACTS.WETH_ARBITRUM_TESTNET,
    creationBlock: 18815277,
  },
  [ChainId.BASE_TESTNET]: {
    router: "0x050E797f3625EC8785265e1d9BDd4799b97528A1",
    weth: WRAPPED_CONTRACTS.WETH_BASE_TESTNET,
    creationBlock: 6915289,
  },
}

export const UNIVERSAL_ROUTER_ADDRESS = (chainId: number): `0x${string}` => {
  if (!(chainId in CHAIN_CONFIGS)) {
    throw new Error(`Universal Router not deployed on chain ${chainId}`)
  }

  return CHAIN_CONFIGS[chainId]!.router
}

export const WETH_ADDRESS = (chainId: number): `0x${string}` => {
  if (!(chainId in CHAIN_CONFIGS)) {
    throw new Error(`Universal Router not deployed on chain ${chainId}`)
  }

  return CHAIN_CONFIGS[chainId]!.weth
}

export const CONTRACT_BALANCE = BigInt(2) ** BigInt(255)

export const OPENSEA_CONDUIT_SPENDER_ID = 0
export const SUDOSWAP_SPENDER_ID = 1
