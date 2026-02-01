import type { ITokenProvider } from "../../providers/token-provider"
import type { Token } from "@x7/utils"

import { ChainId } from "@x7/utils"

import {
  BTC_BNB,
  BUSD_BNB,
  DAI_BNB,
  DAI_MAINNET,
  USDC_BASE,
  USDC_BNB,
  USDC_MAINNET,
  USDT_BNB,
  USDT_MAINNET,
  WBTC_MAINNET,
  WMATIC_POLYGON,
  WMATIC_POLYGON_MUMBAI,
} from "../../providers/token-provider"
import { WRAPPED_NATIVE_CURRENCY } from "../../utils/chains"

type ChainTokenList = Readonly<Record<ChainId, Token[]>>

export const BASES_TO_CHECK_TRADES_AGAINST = (
  _tokenProvider: ITokenProvider
): ChainTokenList => {
  return {
    [ChainId.ETHEREUM]: [
      WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM],
      DAI_MAINNET,
      USDC_MAINNET,
      USDT_MAINNET,
      WBTC_MAINNET,
    ],

    [ChainId.ETHEREUM_TESTNET]: [
      WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM_TESTNET],
    ],
    [ChainId.OPTIMISM]: [WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM]],
    [ChainId.OPTIMISM_TESTNET]: [
      WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM_TESTNET],
    ],
    [ChainId.ARBITRUM]: [WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM]],
    [ChainId.ARBITRUM_TESTNET]: [
      WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM_TESTNET],
    ],
    [ChainId.POLYGON]: [WMATIC_POLYGON],
    [ChainId.POLYGON_TESTNET]: [WMATIC_POLYGON_MUMBAI],
    [ChainId.BSC]: [
      WRAPPED_NATIVE_CURRENCY[ChainId.BSC],
      BUSD_BNB,
      DAI_BNB,
      USDC_BNB,
      USDT_BNB,
      BTC_BNB,
    ],
    [ChainId.BSC_TESTNET]: [WRAPPED_NATIVE_CURRENCY[ChainId.BSC_TESTNET]],
    [ChainId.BASE]: [WRAPPED_NATIVE_CURRENCY[ChainId.BASE], USDC_BASE],
    [ChainId.BASE_TESTNET]: [WRAPPED_NATIVE_CURRENCY[ChainId.BASE_TESTNET]],
  }
}

const getBasePairByAddress = async (
  tokenProvider: ITokenProvider,
  _chainId: ChainId,
  fromAddress: string,
  toAddress: string
): Promise<Record<string, Token[]>> => {
  const accessor = await tokenProvider.getTokens([toAddress])
  const toToken: Token | undefined = accessor.getTokenByAddress(toAddress)

  if (!toToken) return {}

  return {
    [fromAddress]: [toToken],
  }
}

// TODO: figure out if this is still necessary
export const ADDITIONAL_BASES = async (
  tokenProvider: ITokenProvider
): Promise<Partial<Record<ChainId, Record<string, Token[]>>>> => {
  return {
    [ChainId.ETHEREUM]: {
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18",
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0x561a4717537ff4AF5c687328c0f7E90a319705C0",
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
        "0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0x853d955acef822db058eb8505911ed77f175b99e",
        "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
        "0x853d955acef822db058eb8505911ed77f175b99e"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d"
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d",
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
      )),
    },
  }
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES = async (
  tokenProvider: ITokenProvider
): Promise<Partial<Record<ChainId, Record<string, Token[]>>>> => {
  return {
    [ChainId.ETHEREUM]: {
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
        DAI_MAINNET.address
      )),
      ...(await getBasePairByAddress(
        tokenProvider,
        ChainId.ETHEREUM,
        "0xd46ba6d942050d489dbd938a2c909a5d5039a161",
        WRAPPED_NATIVE_CURRENCY[1].address
      )),
    },
  }
}
