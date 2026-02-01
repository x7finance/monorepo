import { ChainId } from "../chain";
import { addressMapToTokenMap } from "./functions/address-map-to-token-map";
import { Token } from "./Token";
import { WETH9_ADDRESS, WRAPPED_CONTRACTS } from "./weth-addresses";

export { DEAD_ADDRESS, WRAPPED_CONTRACTS } from "./weth-addresses";

export const WETH9 = addressMapToTokenMap(
  {
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
  },
  WETH9_ADDRESS,
) as Record<keyof typeof WETH9_ADDRESS, Token>;

export const WNATIVE = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.ETHEREUM_TESTNET]: WETH9[ChainId.ETHEREUM_TESTNET],
  [ChainId.OPTIMISM]: WETH9[ChainId.OPTIMISM],
  [ChainId.OPTIMISM_TESTNET]: WETH9[ChainId.OPTIMISM_TESTNET],
  [ChainId.ARBITRUM]: WETH9[ChainId.ARBITRUM],
  [ChainId.ARBITRUM_TESTNET]: WETH9[ChainId.ARBITRUM_TESTNET],
  [ChainId.BASE]: WETH9[ChainId.BASE],
  [ChainId.BASE_TESTNET]: WETH9[ChainId.BASE_TESTNET],
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: WRAPPED_CONTRACTS.WMATIC,
    decimals: 18,
    symbol: "WMATIC",
    name: "Wrapped Matic",
  }),
  [ChainId.POLYGON_TESTNET]: new Token({
    chainId: ChainId.POLYGON_TESTNET,
    address: WRAPPED_CONTRACTS.WMATIC_TESTNET,
    decimals: 18,
    symbol: "WMATIC",
    name: "Wrapped Matic",
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
} as const;
