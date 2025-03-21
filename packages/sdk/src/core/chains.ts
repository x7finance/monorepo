import { ChainId, WRAPPED_CONTRACTS } from "@x7/utils";

export function generateChainEtherTokenEnum(chainId?: ChainId): `0x${string}` {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return WRAPPED_CONTRACTS.WETH;
    case ChainId.BSC:
      return WRAPPED_CONTRACTS.WBNB;
    case ChainId.POLYGON:
      return WRAPPED_CONTRACTS.WMATIC;
    case ChainId.OPTIMISM:
      return WRAPPED_CONTRACTS.OPTIMISM_WETH;
    case ChainId.ARBITRUM:
      return WRAPPED_CONTRACTS.ARBITRUM_WETH;
    case ChainId.BASE:
      return WRAPPED_CONTRACTS.BASE_WETH;
    case ChainId.BASE_TESTNET:
      return WRAPPED_CONTRACTS.WETH_BASE_TESTNET;
    default:
      return WRAPPED_CONTRACTS.WETH;
  }
}
