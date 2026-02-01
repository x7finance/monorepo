/* oxlint-disable @typescript-eslint/no-explicit-any */

import type { ProviderConfig } from "../../../../providers/provider"
import type { IV2PoolProvider } from "../../../../providers/v2/pool-provider"
import type { V2RouteWithValidQuote } from "../../entities/route-with-valid-quote"
import type {
  BuildV2GasModelFactoryType,
  GasModelProviderConfig,
  IGasModel,
} from "../gas-model"
import type { Pair } from "@x7/sdk"
import type { ChainId, Token } from "@x7/utils"

/* oxlint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import _ from "lodash"

import { LogCodes } from "@x7/utils"

import { CurrencyAmount, log, WRAPPED_NATIVE_CURRENCY } from "../../../../utils"
import {
  calculateL1GasFeesHelper,
  getV2NativePool,
} from "../../../../utils/gas-factory-helpers"
import {
  getQuoteThroughNativePool,
  IV2GasModelFactory,
  usdGasTokensByChain,
} from "../gas-model"

// Constant cost for doing any swap regardless of pools.
export const BASE_SWAP_COST = BigInt(135000)

// Constant per extra hop in the route.
export const COST_PER_EXTRA_HOP = BigInt(50000)

/**
 * Computes a gas estimate for a V2 swap using heuristics.
 * Considers number of hops in the route and the typical base cost for a swap.
 *
 * We compute gas estimates off-chain because
 *  1/ Calling eth_estimateGas for a swaps requires the caller to have
 *     the full balance token being swapped, and approvals.
 *  2/ Tracking gas used using a wrapper contract is not accurate with Multicall
 *     due to EIP-2929. We would have to make a request for every swap we wanted to estimate.
 *  3/ For V2 we simulate all our swaps off-chain so have no way to track gas used.
 *
 * Note, certain tokens e.g. rebasing/fee-on-transfer, may incur higher gas costs than
 * what we estimate here. This is because they run extra logic on token transfer.
 *
 * @export
 * @class V2HeuristicGasModelFactory
 */
export class V2HeuristicGasModelFactory extends IV2GasModelFactory {
  public async buildGasModel({
    chainId,
    gasPriceWei,
    poolProvider,
    token,
    l2GasDataProvider,
    providerConfig,
  }: BuildV2GasModelFactoryType): Promise<IGasModel<V2RouteWithValidQuote>> {
    const l2GasData = l2GasDataProvider
      ? await l2GasDataProvider.getGasData(providerConfig)
      : undefined

    const usdPoolPromise: Promise<Pair> = this.getHighestLiquidityUSDPool(
      chainId,
      poolProvider,
      providerConfig
    )

    // Only fetch the native gasToken pool if specified by the config AND the gas token is not the native currency.
    const nativeAndSpecifiedGasTokenPoolPromise =
      providerConfig?.gasToken &&
      !providerConfig?.gasToken.equals(WRAPPED_NATIVE_CURRENCY[chainId]!)
        ? this.getEthPool(
            chainId,
            providerConfig.gasToken,
            poolProvider,
            providerConfig
          )
        : Promise.resolve(null)

    const [usdPool, nativeAndSpecifiedGasTokenPool] = await Promise.all([
      usdPoolPromise,
      nativeAndSpecifiedGasTokenPoolPromise,
    ])

    let ethPool: Pair | null = null

    if (!token.equals(WRAPPED_NATIVE_CURRENCY[chainId]!)) {
      ethPool = await this.getEthPool(
        chainId,
        token,
        poolProvider,
        providerConfig
      )
    }

    const usdToken =
      usdPool.token0.address === WRAPPED_NATIVE_CURRENCY[chainId]!.address
        ? usdPool.token1
        : usdPool.token0

    const calculateL1GasFees = async (
      route: V2RouteWithValidQuote[]
    ): Promise<{
      gasUsedL1: bigint
      gasUsedL1OnL2: bigint
      gasCostL1USD: CurrencyAmount
      gasCostL1QuoteToken: CurrencyAmount
    }> => {
      const nativePool = !token.equals(WRAPPED_NATIVE_CURRENCY[chainId])
        ? await getV2NativePool(token, poolProvider, providerConfig)
        : null

      return await calculateL1GasFeesHelper(
        route,
        chainId,
        usdPool,
        token,
        nativePool,
        l2GasData
      )
    }

    return {
      estimateGasCost: (routeWithValidQuote: V2RouteWithValidQuote) => {
        const { gasCostInEth, gasUse } = this.estimateGas(
          routeWithValidQuote,
          gasPriceWei,
          chainId,
          providerConfig
        )

        /** ------ MARK: USD logic  -------- */
        const gasCostInTermsOfUSD = getQuoteThroughNativePool(
          chainId,
          gasCostInEth,
          usdPool
        )

        /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
        let gasCostInTermsOfGasToken: CurrencyAmount | undefined = undefined
        if (nativeAndSpecifiedGasTokenPool) {
          gasCostInTermsOfGasToken = getQuoteThroughNativePool(
            chainId,
            gasCostInEth,
            nativeAndSpecifiedGasTokenPool
          )
        }
        // if the gasToken is the native currency, we can just use the gasCostInEth
        else if (
          providerConfig?.gasToken?.equals(WRAPPED_NATIVE_CURRENCY[chainId]!)
        ) {
          gasCostInTermsOfGasToken = gasCostInEth
        }

        /** ------ MARK: return early if quoteToken is wrapped native currency ------- */
        if (token.equals(WRAPPED_NATIVE_CURRENCY[chainId]!)) {
          return {
            gasEstimate: gasUse,
            gasCostInToken: gasCostInEth,
            gasCostInUSD: gasCostInTermsOfUSD,
            gasCostInGasToken: gasCostInTermsOfGasToken,
          }
        }

        // If the quote token is not WETH, we convert the gas cost to be in terms of the quote token.
        // We do this by getting the highest liquidity <token>/ETH pool.
        if (!ethPool) {
          // log.info(
          //   "Unable to find ETH pool with the quote token to produce gas adjusted costs. Route will not account for gas.",
          // );
          return {
            gasEstimate: gasUse,
            gasCostInToken: CurrencyAmount.fromRawAmount(token, 0),
            gasCostInUSD: CurrencyAmount.fromRawAmount(usdToken, 0),
          }
        }

        const gasCostInTermsOfQuoteToken = getQuoteThroughNativePool(
          chainId,
          gasCostInEth,
          ethPool
        )

        return {
          gasEstimate: gasUse,
          gasCostInToken: gasCostInTermsOfQuoteToken,
          gasCostInUSD: gasCostInTermsOfUSD!,
          gasCostInGasToken: gasCostInTermsOfGasToken,
        }
      },
      calculateL1GasFees,
    }
  }

  private estimateGas(
    routeWithValidQuote: V2RouteWithValidQuote,
    gasPriceWei: any,
    chainId: ChainId,
    providerConfig?: GasModelProviderConfig
  ) {
    const hops = routeWithValidQuote.route.pairs.length
    let gasUse = BASE_SWAP_COST + COST_PER_EXTRA_HOP * BigInt(hops - 1)

    if (providerConfig?.additionalGasOverhead) {
      gasUse = gasUse + providerConfig.additionalGasOverhead
    }

    const totalGasCostWei = gasPriceWei * gasUse

    const weth = WRAPPED_NATIVE_CURRENCY[chainId]!

    const gasCostInEth = CurrencyAmount.fromRawAmount(weth, totalGasCostWei)

    return { gasCostInEth, gasUse }
  }

  private async getEthPool(
    chainId: ChainId,
    token: Token,
    poolProvider: IV2PoolProvider,
    providerConfig?: ProviderConfig
  ): Promise<Pair | null> {
    const weth = WRAPPED_NATIVE_CURRENCY[chainId]!

    const poolAccessor = await poolProvider.getPools(
      [[weth, token]],
      providerConfig
    )
    const poolsRaw = poolAccessor.getPool(weth, token)

    const pools: Pair[] = poolsRaw.filter((pool): pool is Pair => {
      return (
        pool !== undefined &&
        pool.reserve0.greaterThan(0) &&
        pool.reserve1.greaterThan(0)
      )
    })

    if (pools.length === 0) {
      log.error(
        LogCodes.FAIL,
        `[v2 Heurstic Gas Model] Could not find a valid WETH pool with ${token.symbol} for computing gas costs.`,
        {
          weth,
          token,
          poolData: poolsRaw.map((pool) => ({
            pool,
            reserve0: pool?.reserve0.toExact(),
            reserve1: pool?.reserve1.toExact(),
          })),
        }
      )

      return null
    }

    const maxPool = _.maxBy(pools, (pool) => {
      if (pool.token0.equals(WRAPPED_NATIVE_CURRENCY[chainId])) {
        return parseFloat(pool.reserve0.toFixed(2))
      } else {
        return parseFloat(pool.reserve1.toFixed(2))
      }
    })!

    return maxPool
  }

  private async getHighestLiquidityUSDPool(
    chainId: ChainId,
    poolProvider: IV2PoolProvider,
    providerConfig?: ProviderConfig
  ): Promise<Pair> {
    const usdTokens = usdGasTokensByChain[chainId]

    if (!usdTokens) {
      throw new Error(
        `Could not find a USD token for computing gas costs on ${chainId}`
      )
    }

    const usdPools = _.map<Token, [Token, Token]>(usdTokens, (usdToken) => [
      usdToken,
      WRAPPED_NATIVE_CURRENCY[chainId]!,
    ])
    const poolAccessor = await poolProvider.getPools(usdPools, {
      ...providerConfig,
      forceAllImplementations: true,
    })

    const poolsRaw = poolAccessor.getAllPools()

    const pools = _.filter(
      poolsRaw,
      (pool) =>
        pool.reserve0.greaterThan(0) &&
        pool.reserve1.greaterThan(0) &&
        // this case should never happen in production, but when we mock the pool provider it may return non native pairs
        (pool.token0.equals(WRAPPED_NATIVE_CURRENCY[chainId]!) ||
          pool.token1.equals(WRAPPED_NATIVE_CURRENCY[chainId]!))
    )

    if (pools.length === 0) {
      log.error(
        LogCodes.NOT_FOUND,
        { pools },
        `Could not find a USD/WETH pool for computing!! gas costs.`
      )
      throw new Error(`Can't find USD/WETH pool for computing gas costs.`)
    }

    const maxPool = _.maxBy(pools, (pool) => {
      if (pool.token0.equals(WRAPPED_NATIVE_CURRENCY[chainId]!)) {
        return parseFloat(pool.reserve0.toSignificant(2))
      } else {
        return parseFloat(pool.reserve1.toSignificant(2))
      }
    })!

    return maxPool
  }
}
