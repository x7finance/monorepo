/* oxlint-disable @typescript-eslint/no-non-null-assertion */

import type { Token } from "@x7/utils"

import {
  AMPL_ADDRESS,
  DAI,
  FRAX,
  FRAX_ADDRESS,
  FXS,
  FXS_ADDRESS,
  KP3R,
  KP3R_ADDRESS,
  LDO,
  LDO_ADDRESS,
  LINK,
  LUSD,
  OHM,
  rETH2_ADDRESS,
  sETH2,
  SUSHI,
  USDC,
  USDT,
  WBTC,
} from "@x7/sdk"
import { ChainId, WETH9, WNATIVE } from "@x7/utils"

export const BASES_TO_CHECK_TRADES_AGAINST: Readonly<Record<number, Token[]>> =
  {
    [ChainId.ETHEREUM]: [
      WNATIVE[ChainId.ETHEREUM],
      WBTC[ChainId.ETHEREUM],
      USDC[ChainId.ETHEREUM],
      USDT[ChainId.ETHEREUM],
      DAI[ChainId.ETHEREUM],
      FRAX[ChainId.ETHEREUM],
      OHM[ChainId.ETHEREUM],
      LINK[ChainId.ETHEREUM],
      SUSHI[ChainId.ETHEREUM],
    ],
    [ChainId.POLYGON]: [
      WNATIVE[ChainId.POLYGON],
      WETH9[ChainId.POLYGON],
      WBTC[ChainId.POLYGON],
      USDC[ChainId.POLYGON],
      USDT[ChainId.POLYGON],
      DAI[ChainId.POLYGON],
      FRAX[ChainId.POLYGON],
    ],
    [ChainId.POLYGON_TESTNET]: [
      WNATIVE[ChainId.POLYGON_TESTNET],
      USDC[ChainId.POLYGON_TESTNET],
    ],
    [ChainId.BSC]: [
      WNATIVE[ChainId.BSC],
      WETH9[ChainId.BSC],
      USDC[ChainId.BSC],
      USDT[ChainId.BSC],
      DAI[ChainId.BSC],
      FRAX[ChainId.BSC],
    ],
    [ChainId.ARBITRUM]: [
      WNATIVE[ChainId.ARBITRUM],
      WBTC[ChainId.ARBITRUM],
      USDC[ChainId.ARBITRUM],
      USDT[ChainId.ARBITRUM],
      DAI[ChainId.ARBITRUM],
    ],
    [ChainId.OPTIMISM]: [
      WNATIVE[ChainId.OPTIMISM],
      WBTC[ChainId.OPTIMISM],
      USDC[ChainId.OPTIMISM],
      USDT[ChainId.OPTIMISM],
      DAI[ChainId.OPTIMISM],
      LUSD[ChainId.OPTIMISM],
      FRAX[ChainId.OPTIMISM],
    ],
    [ChainId.BASE]: [
      WNATIVE[ChainId.BASE],
      USDC[ChainId.BASE],
      DAI[ChainId.BASE],
    ],
  }

export const ADDITIONAL_BASES: Record<number, Record<string, Token[]>> = {
  [ChainId.ETHEREUM]: {
    [rETH2_ADDRESS[ChainId.ETHEREUM]]: [sETH2[ChainId.ETHEREUM]],
    [FRAX_ADDRESS[ChainId.ETHEREUM]]: [FXS[ChainId.ETHEREUM]],
    [FXS_ADDRESS[ChainId.ETHEREUM]]: [FRAX[ChainId.ETHEREUM]],
    [KP3R_ADDRESS[ChainId.ETHEREUM]]: [LDO[ChainId.ETHEREUM]],
    [LDO_ADDRESS[ChainId.ETHEREUM]]: [KP3R[ChainId.ETHEREUM]],
  },
  [ChainId.POLYGON]: {
    [FRAX_ADDRESS[ChainId.POLYGON]]: [FXS[ChainId.POLYGON]],
    [FXS_ADDRESS[ChainId.POLYGON]]: [FRAX[ChainId.POLYGON]],
  },
  [ChainId.ARBITRUM]: {
    [FRAX_ADDRESS[ChainId.ARBITRUM]]: [FXS[ChainId.ARBITRUM]],
    [FXS_ADDRESS[ChainId.ARBITRUM]]: [FRAX[ChainId.ARBITRUM]],
  },
  [ChainId.BSC]: {
    [FRAX_ADDRESS[ChainId.BSC]]: [FXS[ChainId.BSC]],
    [FXS_ADDRESS[ChainId.BSC]]: [FRAX[ChainId.BSC]],
  },
  [ChainId.OPTIMISM]: {
    [FRAX_ADDRESS[ChainId.OPTIMISM]]: [FXS[ChainId.OPTIMISM]],
    [FXS_ADDRESS[ChainId.OPTIMISM]]: [FRAX[ChainId.OPTIMISM]],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: Record<number, Record<string, Token[]>> = {
  [ChainId.ETHEREUM]: {
    [AMPL_ADDRESS[ChainId.ETHEREUM]!]: [
      DAI[ChainId.ETHEREUM],
      WNATIVE[ChainId.ETHEREUM],
    ],
  },
}
