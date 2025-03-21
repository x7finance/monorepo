import { ChainId, Token, WRAPPED_CONTRACTS } from "@x7/utils";

export const chainIdToSubgraphChainName = (id: ChainId): string => {
  switch (id) {
    case ChainId.ETHEREUM:
      return "mainnet";
    case ChainId.ETHEREUM_TESTNET:
      return "sepolia";
    case ChainId.BSC:
      return "bnb-mainnet";
    case ChainId.OPTIMISM:
      return "optimism-mainnet";
    case ChainId.ARBITRUM:
      return "arbitrum-mainnet";
    case ChainId.POLYGON:
      return "polygon-mainnet";
    case ChainId.BASE:
      return "base-mainnet";
    case ChainId.BASE_TESTNET:
      return "base-sepolia";
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

export const WRAPPED_NATIVE_CURRENCY: Record<ChainId, Token> = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: WRAPPED_CONTRACTS.WETH,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.ETHEREUM_TESTNET]: new Token({
    chainId: ChainId.ETHEREUM_TESTNET,
    address: WRAPPED_CONTRACTS.WETH_TESTNET,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.BSC]: new Token({
    chainId: ChainId.BSC,
    address: WRAPPED_CONTRACTS.WBNB,
    decimals: 18,
    symbol: "WBNB",
    name: "Wrapped BNB",
  }),
  [ChainId.BSC_TESTNET]: new Token({
    chainId: ChainId.BSC_TESTNET,
    address: WRAPPED_CONTRACTS.WBNB_TESTNET,
    decimals: 18,
    symbol: "WBNB",
    name: "Wrapped BNB",
  }),
  [ChainId.OPTIMISM]: new Token({
    chainId: ChainId.OPTIMISM,
    address: WRAPPED_CONTRACTS.OPTIMISM_WETH,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.OPTIMISM_TESTNET]: new Token({
    chainId: ChainId.OPTIMISM,
    address: WRAPPED_CONTRACTS.WETH_OPTIMISM_TESTNET,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.ARBITRUM]: new Token({
    chainId: ChainId.ARBITRUM,
    address: WRAPPED_CONTRACTS.ARBITRUM_WETH,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.ARBITRUM_TESTNET]: new Token({
    chainId: ChainId.ARBITRUM_TESTNET,
    address: WRAPPED_CONTRACTS.WETH_ARBITRUM_TESTNET,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: WRAPPED_CONTRACTS.WMATIC,
    decimals: 18,
    symbol: "WMATIC",
    name: "Wrapped MATIC",
  }),
  [ChainId.POLYGON_TESTNET]: new Token({
    chainId: ChainId.POLYGON_TESTNET,
    address: WRAPPED_CONTRACTS.WMATIC_TESTNET,
    decimals: 18,
    symbol: "WMATIC",
    name: "Wrapped MATIC",
  }),
  [ChainId.BASE]: new Token({
    chainId: ChainId.BASE,
    address: WRAPPED_CONTRACTS.BASE_WETH,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
  [ChainId.BASE_TESTNET]: new Token({
    chainId: ChainId.BASE_TESTNET,
    address: WRAPPED_CONTRACTS.WETH_BASE_TESTNET,
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  }),
};
