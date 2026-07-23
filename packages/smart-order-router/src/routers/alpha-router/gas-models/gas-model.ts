/* oxlint-disable @typescript-eslint/prefer-for-of */
import type { Pair, Pool } from "@x7/sdk"
import type { CurrencyAmount as CurrencyAmountRaw, Token } from "@x7/utils"
import { ChainId } from "@x7/utils"

import type { ProviderConfig } from "../../../providers/provider"
import {
  DAI_ARBITRUM,
  DAI_BNB,
  DAI_MAINNET,
  DAI_OPTIMISM,
  DAI_OPTIMISM_SEPOLIA,
  DAI_POLYGON_MUMBAI,
  DAI_SEPOLIA,
  USDC_ARBITRUM,
  USDC_ARBITRUM_TESTNET,
  USDC_BASE,
  USDC_BASE_SEPOLIA,
  USDC_BNB,
  USDC_MAINNET,
  USDC_NATIVE_ARBITRUM,
  USDC_NATIVE_BASE,
  USDC_NATIVE_OPTIMISM,
  USDC_OPTIMISM,
  USDC_OPTIMISM_SEPOLIA,
  USDC_POLYGON,
  USDC_SEPOLIA,
  USDT_ARBITRUM,
  USDT_BNB,
  USDT_MAINNET,
  USDT_OPTIMISM,
  USDT_OPTIMISM_SEPOLIA,
  USDT_POLYGON,
} from "../../../providers/token-provider"
import type { IV2PoolProvider } from "../../../providers/v2/pool-provider"
import type {
  ArbitrumGasData,
  IL2GasDataProvider,
} from "../../../providers/v3/gas-data-provider"
import type { CurrencyAmount } from "../../../utils/amounts"
import { WRAPPED_NATIVE_CURRENCY } from "../../../utils/chains"
import type {
  MixedRouteWithValidQuote,
  RouteWithValidQuote,
  V2RouteWithValidQuote,
  V3RouteWithValidQuote,
} from "../entities/route-with-valid-quote"

import type { IGasModel } from "./gas-model-types"

// Re-export for backwards compatibility
export type { IGasModel, L1ToL2GasCosts } from "./gas-model-types"

// When adding new usd gas tokens, ensure the tokens are ordered
// from tokens with highest decimals to lowest decimals. For example,
// DAI_AVAX has 18 decimals and comes before USDC_AVAX which has 6 decimals.
export const usdGasTokensByChain: Partial<Record<ChainId, Token[]>> = {
  [ChainId.ETHEREUM]: [DAI_MAINNET, USDC_MAINNET, USDT_MAINNET],
  [ChainId.ETHEREUM_TESTNET]: [USDC_SEPOLIA, DAI_SEPOLIA],
  [ChainId.ARBITRUM]: [
    DAI_ARBITRUM,
    USDC_ARBITRUM,
    USDC_NATIVE_ARBITRUM,
    USDT_ARBITRUM,
  ],
  [ChainId.ARBITRUM_TESTNET]: [USDC_ARBITRUM_TESTNET],
  [ChainId.OPTIMISM]: [
    DAI_OPTIMISM,
    USDC_OPTIMISM,
    USDC_NATIVE_OPTIMISM,
    USDT_OPTIMISM,
  ],
  [ChainId.OPTIMISM_TESTNET]: [
    DAI_OPTIMISM_SEPOLIA,
    USDC_OPTIMISM_SEPOLIA,
    USDT_OPTIMISM_SEPOLIA,
  ],
  [ChainId.POLYGON]: [USDT_POLYGON, USDC_POLYGON],
  [ChainId.POLYGON_TESTNET]: [DAI_POLYGON_MUMBAI],
  [ChainId.BSC]: [USDT_BNB, USDC_BNB, DAI_BNB],
  [ChainId.BSC_TESTNET]: [USDC_BNB],
  [ChainId.BASE]: [USDC_BASE, USDC_NATIVE_BASE],
  [ChainId.BASE_TESTNET]: [USDC_BASE_SEPOLIA],
}

export type GasModelProviderConfig = ProviderConfig & {
  /*
   * Any additional overhead to add to the gas estimate
   */
  additionalGasOverhead?: bigint

  gasToken?: Token
}

export interface BuildOnChainGasModelFactoryType {
  chainId: ChainId
  gasPriceWei: bigint
  pools: LiquidityCalculationPools
  amountToken: Token
  quoteToken: Token
  v2poolProvider: IV2PoolProvider
  l2GasDataProvider?: IL2GasDataProvider<ArbitrumGasData>
  providerConfig?: GasModelProviderConfig
}

export interface BuildV2GasModelFactoryType {
  chainId: ChainId
  gasPriceWei: bigint
  poolProvider: IV2PoolProvider
  token: Token
  l2GasDataProvider?: IL2GasDataProvider<ArbitrumGasData>
  providerConfig?: GasModelProviderConfig
}

export interface LiquidityCalculationPools {
  usdPool: Pool
  nativeAndQuoteTokenV3Pool: Pool | null
  nativeAndAmountTokenV3Pool: Pool | null
  nativeAndSpecifiedGasTokenV3Pool: Pool | null
}

export interface GasModelType {
  v2GasModel?: IGasModel<V2RouteWithValidQuote>
  v3GasModel: IGasModel<V3RouteWithValidQuote>
  mixedRouteGasModel: IGasModel<MixedRouteWithValidQuote>
}

/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IV2GasModelFactory
 */
export abstract class IV2GasModelFactory {
  public abstract buildGasModel({
    chainId,
    gasPriceWei,
    poolProvider,
    token,
    providerConfig,
  }: BuildV2GasModelFactoryType): Promise<IGasModel<V2RouteWithValidQuote>>
}

/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IOnChainGasModelFactory
 */
export abstract class IOnChainGasModelFactory<
  TRouteWithValidQuote extends RouteWithValidQuote,
> {
  public abstract buildGasModel({
    chainId,
    gasPriceWei,
    pools,
    amountToken,
    quoteToken,
    v2poolProvider,
    l2GasDataProvider,
    providerConfig,
  }: BuildOnChainGasModelFactoryType): Promise<IGasModel<TRouteWithValidQuote>>

  protected totalInitializedTicksCrossed(
    initializedTicksCrossedList: number[]
  ) {
    let ticksCrossed = 0
    for (let i = 0; i < initializedTicksCrossedList.length; i++) {
      // oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (initializedTicksCrossedList[i]! > 0) {
        // Quoter returns Array<number of calls to crossTick + 1>, so we need to subtract 1 here.
        // oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
        ticksCrossed += initializedTicksCrossedList[i]! - 1
      }
    }

    return ticksCrossed
  }
}

// Determines if native currency is token0
// Gets the native price of the pool, dependent on 0 or 1
// quotes across the pool
export const getQuoteThroughNativePool = (
  chainId: ChainId,
  nativeTokenAmount: CurrencyAmountRaw<Token>,
  nativeTokenPool: Pool | Pair
): CurrencyAmount => {
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[chainId]
  const isToken0 = nativeTokenPool.token0.equals(nativeCurrency)
  // returns mid price in terms of the native currency (the ratio of token/nativeToken)
  const nativeTokenPrice = isToken0
    ? nativeTokenPool.token0Price
    : nativeTokenPool.token1Price
  // return gas cost in terms of the non native currency
  return nativeTokenPrice.quote(nativeTokenAmount) as CurrencyAmount
}
