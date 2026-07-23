/* oxlint-disable @typescript-eslint/no-unused-vars */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/require-await */

import _ from "lodash"

import type { Pair, Pool } from "@x7/sdk"
import type { Currency } from "@x7/utils"
import {
  ChainId,
  CurrencyAmount,
  FeeAmount,
  LogCodes,
  Percent,
  Protocol,
  Token,
  TradeType,
} from "@x7/utils"

import type { IPortionProvider } from "../providers/portion-provider"
import type { ProviderConfig } from "../providers/provider"
import type { IV2PoolProvider } from "../providers/v2/pool-provider"
import type { ArbitrumGasData } from "../providers/v3/gas-data-provider"
import type { IV3PoolProvider } from "../providers/v3/pool-provider"
import type { RouteWithValidQuote } from "../routers/alpha-router/entities/route-with-valid-quote"
import {
  MixedRouteWithValidQuote,
  V2RouteWithValidQuote,
  V3RouteWithValidQuote,
} from "../routers/alpha-router/entities/route-with-valid-quote"
import type { GasModelProviderConfig } from "../routers/alpha-router/gas-models/gas-model"
import {
  getQuoteThroughNativePool,
  usdGasTokensByChain,
} from "../routers/alpha-router/gas-models/gas-model"
import type {
  MethodParameters,
  SwapOptions,
  SwapOptionsUniversalRouter,
  SwapRoute,
} from "../routers/router"
import { SwapType } from "../routers/router"

import { WRAPPED_NATIVE_CURRENCY } from "./chains"
import { opStackChains } from "./l2-fee-chains"
import { log } from "./log"
import { buildSwapMethodParameters, buildTrade } from "./methodParameters"

export async function getV2NativePool(
  token: Token,
  poolProvider: IV2PoolProvider,
  providerConfig?: ProviderConfig
): Promise<Pair | null> {
  const chainId = token.chainId
  const weth = WRAPPED_NATIVE_CURRENCY[chainId]

  const poolAccessor = await poolProvider.getPools([[token, weth]], {
    ...providerConfig,
    forceAllImplementations: providerConfig?.forceAllImplementations ?? false,
  })

  const poolsRaw = poolAccessor.getPool(token, weth)

  const pools: Pair[] = poolsRaw.filter((pool): pool is Pair => {
    return (
      !!pool && pool.reserve0.greaterThan(0) && pool.reserve1.greaterThan(0)
    )
  })

  if (pools.length === 0) {
    log.error(
      LogCodes.FAIL,
      `[Gas Factory Helpers] Could not find a valid WETH pool with ${token.symbol} for computing gas costs.`,
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

export async function getHighestLiquidityV3NativePool(
  token: Token,
  poolProvider: IV3PoolProvider,
  providerConfig?: ProviderConfig
): Promise<Pool | null> {
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[token.chainId]

  const nativePools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .map<[Token, Token, FeeAmount]>((feeAmount) => {
      return [nativeCurrency, token, feeAmount]
    })
    .value()

  const poolAccessor = await poolProvider.getPools(nativePools, {
    ...providerConfig,
    forceAllImplementations: true,
  })

  const pools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .map((feeAmount) => {
      return poolAccessor.getPool(nativeCurrency, token, feeAmount)
    })
    .compact()
    .value()
    .flat(1)

  if (pools.length === 0) {
    log.error(
      LogCodes.FAIL,
      { pools },
      `[V3] Could not find a ${nativeCurrency.symbol} pool with ${token.symbol} for computing gas costs.`
    )

    return null
  }

  const maxPool = pools.reduce((p, c) =>
    (p?.liquidity ?? 0) > (c?.liquidity ?? 0) ? p : c
  )

  return maxPool ?? null
}

export async function getHighestLiquidityV3USDPool(
  chainId: ChainId,
  poolProvider: IV3PoolProvider,
  providerConfig?: ProviderConfig
): Promise<Pool> {
  const usdTokens = usdGasTokensByChain[chainId]
  const wrappedCurrency = WRAPPED_NATIVE_CURRENCY[chainId]

  if (!usdTokens) {
    throw new Error(
      `Could not find a USD token for computing gas costs on ${chainId}`
    )
  }

  const usdPools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .flatMap((feeAmount) => {
      return _.map<Token, [Token, Token, FeeAmount]>(usdTokens, (usdToken) => [
        wrappedCurrency,
        usdToken,
        feeAmount,
      ])
    })
    .value()

  const poolAccessor = await poolProvider.getPools(usdPools, {
    ...providerConfig,
    forceAllImplementations: true,
  })

  const pools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .flatMap((feeAmount) => {
      const feePools = []

      for (const usdToken of usdTokens) {
        const pool = poolAccessor.getPool(wrappedCurrency, usdToken, feeAmount)
        log.info(
          LogCodes.FETCHING_POOLS,
          "Get Highest Liquidity V3 USD Pools",
          {
            pool,
            feeAmount,
            usdToken,
            wrappedCurrency,
          }
        )

        if (pool.length > 0) {
          feePools.push(...pool)
        }
      }

      return feePools
    })
    .compact()
    .value()

  log.info(
    LogCodes.FETCHING_POOLS,
    `Get Highest Liquidity V3 USD Pools: ${pools.length}`,
    { pools }
  )

  if (pools.length === 0) {
    const message = `Could not find a USD/${wrappedCurrency.symbol} pool for computing gas costs.`
    log.error(LogCodes.FAIL, message, { pools })
    throw new Error(message)
  }

  const maxPool = _.maxBy(pools, (pool) => {
    return pool.liquidity
  })!

  return maxPool
}

export function getGasCostInUSD(
  usdPools: (Pool | (Pair | null))[],
  costNativeCurrency: CurrencyAmount<Token>
) {
  const nativeCurrency = costNativeCurrency.currency
  // convert fee into usd
  const costs = []
  for (const pool of usdPools) {
    const nativeTokenPrice =
      pool?.token0.address === nativeCurrency.address
        ? pool.token0Price
        : pool?.token1Price

    if (nativeTokenPrice) {
      const gasCostUSD = nativeTokenPrice.quote(costNativeCurrency)
      costs.push(gasCostUSD)
    }
  }

  return costs.toSorted((a, b) => (a.greaterThan(b) ? 1 : -1))[0]!
}

export function getGasCostInNativeCurrency(
  nativeCurrency: Token,
  gasCostInWei: bigint
) {
  // wrap fee to native currency
  const costNativeCurrency = CurrencyAmount.fromRawAmount(
    nativeCurrency,
    gasCostInWei
  )
  return costNativeCurrency
}

export async function getGasCostInQuoteToken(
  quoteToken: Token,
  nativePool: Pool | Pair,
  costNativeCurrency: CurrencyAmount<Token>
): Promise<any> {
  const nativeTokenPrice =
    nativePool.token0.address === quoteToken.address
      ? nativePool.token1Price
      : nativePool.token0Price
  const gasCostQuoteToken = nativeTokenPrice.quote(costNativeCurrency)

  return gasCostQuoteToken
}

// export function calculateArbitrumToL1FeeFromCalldata(
//   calldata: string,
//   gasData: ArbitrumGasData,
// ): [bigint, bigint] {
//   const { perL2TxFee, perL1CalldataFee } = gasData;
//   // calculates gas amounts based on bytes of calldata, use 0 as overhead.
//   const l1GasUsed = getL2ToL1GasUsed(calldata, BigInt(0));
//   // multiply by the fee per calldata and add the flat l2 fee
//   let l1Fee = BigInt(l1GasUsed) * BigInt(perL1CalldataFee);
//   l1Fee = BigInt(l1Fee) + BigInt(perL2TxFee);
//   return [l1GasUsed, l1Fee];
// }

export function calculateArbitrumToL1FeeFromCalldata(
  calldata: string,
  gasData: ArbitrumGasData,
  chainId: ChainId
): [bigint, bigint, bigint] {
  const { perL2TxFee, perL1CalldataFee, perArbGasTotal } = gasData
  // calculates gas amounts based on bytes of calldata, use 0 as overhead.
  const l1GasUsed = getL2ToL1GasUsed(calldata, chainId)
  // multiply by the fee per calldata and add the flat l2 fee
  const l1Fee = l1GasUsed * perL1CalldataFee + perL2TxFee
  const gasUsedL1OnL2 = l1Fee / perArbGasTotal
  return [l1GasUsed, l1Fee, gasUsedL1OnL2]
}

export async function calculateOptimismToL1FeeFromCalldata(
  calldata: string,
  chainId: ChainId
): Promise<[bigint, bigint]> {
  // TOOD: implement with viem instead of the optimism sdk as suggested by their repo
  // https://github.com/ethereum-optimism/ecosystem/tree/main/packages/sdk#readme
  const tx: any = {
    data: calldata,
    chainId: chainId,
    type: 2, // sign the transaction as EIP-1559, otherwise it will fail at maxFeePerGas
  }

  const [l1GasUsed, l1GasCost] = await Promise.all([
    0n,
    0n,
    // estimateL1Gas(provider, tx),
    // estimateL1GasCost(provider, tx),
  ])

  return [l1GasUsed, l1GasCost]
}

export function getArbitrumBytes(data: string): bigint {
  if (data === "") return 0n

  // NOTE: brotli is not supported in node.js
  const compressed = Buffer.from(data.replace("0x", ""), "hex")
  // const compressed = brotli.compress(
  //   Buffer.from(data.replace("0x", ""), "hex"),
  //   {
  //     mode: 0,
  //     quality: 1,
  //     lgwin: 22,
  //   },
  // );
  // TODO: This is a rough estimate of the compressed size
  // Brotli 0 should be used, but this brotli library doesn't support it
  // https://github.com/foliojs/brotli.js/issues/38
  // There are other brotli libraries that do support it, but require async
  // We workaround by using Brotli 1 with a 20% bump in size
  return (BigInt(compressed.length) * BigInt(120)) / BigInt(100)
}

// based on the code from the optimism OVM_GasPriceOracle contract

export function getL2ToL1GasUsed(data: string, chainId: ChainId): bigint {
  switch (chainId) {
    case ChainId.ARBITRUM:
    case ChainId.ARBITRUM_TESTNET: {
      // calculates bytes of compressed calldata
      const l1ByteUsed = getArbitrumBytes(data)
      return l1ByteUsed * 16n
    }
    default:
      return 0n
  }
}

export async function calculateGasUsed(
  chainId: ChainId,
  route: SwapRoute,
  simulatedGasUsed: bigint,
  v2PoolProvider: IV2PoolProvider,
  v3PoolProvider: IV3PoolProvider,
  providerConfig?: GasModelProviderConfig
): Promise<{
  estimatedGasUsedUSD: CurrencyAmount<Currency>
  estimatedGasUsedQuoteToken: CurrencyAmount<Currency>
  estimatedGasUsedGasToken?: CurrencyAmount<Currency>
  quoteGasAdjusted: CurrencyAmount<Currency>
}> {
  const quoteToken = route.quote.currency.wrapped
  const gasPriceWei = route.gasPriceWei
  // calculate L2 to L1 security fee if relevant
  let l2toL1FeeInWei = 0n
  // @ts-expect-error: dont worry
  if (opStackChains.includes(chainId)) {
    l2toL1FeeInWei = (
      await calculateOptimismToL1FeeFromCalldata(
        route.methodParameters!.calldata,
        chainId
      )
    )[1]
  }

  // add l2 to l1 fee and wrap fee to native currency
  const gasCostInWei = gasPriceWei * simulatedGasUsed + l2toL1FeeInWei
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[chainId]
  const costNativeCurrency = getGasCostInNativeCurrency(
    nativeCurrency,
    gasCostInWei
  )

  const usdPool: Pool = await getHighestLiquidityV3USDPool(
    chainId,
    v3PoolProvider,
    providerConfig
  )

  /** ------ MARK: USD logic  -------- */
  const gasCostUSD = getQuoteThroughNativePool(
    chainId,
    costNativeCurrency,
    usdPool
  )

  /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
  let gasCostInTermsOfGasToken: CurrencyAmount<Currency> | undefined = undefined
  if (providerConfig?.gasToken) {
    if (providerConfig.gasToken.equals(nativeCurrency)) {
      gasCostInTermsOfGasToken = costNativeCurrency
    } else {
      const nativeAndSpecifiedGasTokenPool =
        await getHighestLiquidityV3NativePool(
          providerConfig.gasToken,
          v3PoolProvider,
          providerConfig
        )
      if (nativeAndSpecifiedGasTokenPool) {
        gasCostInTermsOfGasToken = getQuoteThroughNativePool(
          chainId,
          costNativeCurrency,
          nativeAndSpecifiedGasTokenPool
        )
      } else {
        log.info(
          LogCodes.NOT_FOUND,
          `Could not find a V3 pool for gas token ${providerConfig.gasToken.symbol}`
        )
      }
    }
  }

  /** ------ MARK: Main gas logic in terms of quote token -------- */
  let gasCostQuoteToken: CurrencyAmount<Currency> | undefined = undefined
  // shortcut if quote token is native currency
  if (quoteToken.equals(nativeCurrency)) {
    gasCostQuoteToken = costNativeCurrency
  }
  // get fee in terms of quote token
  else {
    const nativePools = await Promise.all([
      getHighestLiquidityV3NativePool(quoteToken, v3PoolProvider, {
        ...providerConfig,
        forceAllImplementations: true,
      }),
      getV2NativePool(quoteToken, v2PoolProvider, {
        ...providerConfig,
        forceAllImplementations: true,
      }),
    ])
    const nativePool = nativePools.find((pool) => pool !== null)

    if (!nativePool) {
      log.info(
        LogCodes.NOT_FOUND,
        "Could not find any V2 or V3 pools to convert the cost into the quote token"
      )
      gasCostQuoteToken = CurrencyAmount.fromRawAmount(quoteToken, 0)
    } else {
      gasCostQuoteToken = getQuoteThroughNativePool(
        chainId,
        costNativeCurrency,
        nativePool
      )
    }
  }

  // Adjust quote for gas fees
  let quoteGasAdjusted
  if (route.trade.tradeType === TradeType.EXACT_OUTPUT) {
    // Exact output - need more of tokenIn to get the desired amount of tokenOut
    quoteGasAdjusted = route.quote.add(gasCostQuoteToken)
  } else {
    // Exact input - can get less of tokenOut due to fees
    quoteGasAdjusted = route.quote.subtract(gasCostQuoteToken)
  }

  return {
    estimatedGasUsedUSD: gasCostUSD,
    estimatedGasUsedQuoteToken: gasCostQuoteToken,
    estimatedGasUsedGasToken: gasCostInTermsOfGasToken,
    quoteGasAdjusted: quoteGasAdjusted,
  }
}

export function initSwapRouteFromExisting(
  swapRoute: SwapRoute,
  v2PoolProvider: IV2PoolProvider,
  v3PoolProvider: IV3PoolProvider,
  portionProvider: IPortionProvider,
  quoteGasAdjusted: CurrencyAmount<Currency>,
  estimatedGasUsed: bigint,
  estimatedGasUsedQuoteToken: CurrencyAmount<Currency>,
  estimatedGasUsedUSD: CurrencyAmount<Currency>,
  swapOptions: SwapOptions
): SwapRoute {
  const currencyIn = swapRoute.trade.inputAmount.currency
  const currencyOut = swapRoute.trade.outputAmount.currency
  const tradeType = swapRoute.trade.tradeType.valueOf()
    ? TradeType.EXACT_OUTPUT
    : TradeType.EXACT_INPUT
  const routesWithValidQuote = swapRoute.route.map((route) => {
    switch (route.protocol) {
      case Protocol.V3:
        return new V3RouteWithValidQuote({
          amount: CurrencyAmount.fromFractionalAmount(
            route.amount.currency,
            route.amount.numerator,
            route.amount.denominator
          ),
          rawQuote: BigInt(route.rawQuote),
          sqrtPriceX96AfterList: route.sqrtPriceX96AfterList.map((num) =>
            BigInt(num)
          ),
          initializedTicksCrossedList: [...route.initializedTicksCrossedList],
          quoterGasEstimate: BigInt(route.gasEstimate),
          percent: route.percent,
          route: route.route,
          gasModel: route.gasModel,
          quoteToken: new Token({
            chainId: currencyIn.chainId,
            address: route.quoteToken.address,
            decimals: route.quoteToken.decimals,
            symbol: route.quoteToken.symbol,
            name: route.quoteToken.name,
          }),
          tradeType: tradeType,
          v3PoolProvider: v3PoolProvider,
        })
      case Protocol.V2:
        return new V2RouteWithValidQuote({
          amount: CurrencyAmount.fromFractionalAmount(
            route.amount.currency,
            route.amount.numerator,
            route.amount.denominator
          ),
          rawQuote: BigInt(route.rawQuote),
          percent: route.percent,
          route: route.route,
          gasModel: route.gasModel,
          quoteToken: new Token({
            chainId: currencyIn.chainId,
            address: route.quoteToken.address,
            decimals: route.quoteToken.decimals,
            symbol: route.quoteToken.symbol,
            name: route.quoteToken.name,
          }),
          tradeType: tradeType,
          v2PoolProvider: v2PoolProvider,
        })
      case Protocol.MIXED:
        return new MixedRouteWithValidQuote({
          amount: CurrencyAmount.fromFractionalAmount(
            route.amount.currency,
            route.amount.numerator,
            route.amount.denominator
          ),
          rawQuote: BigInt(route.rawQuote),
          sqrtPriceX96AfterList: route.sqrtPriceX96AfterList.map((num) =>
            BigInt(num)
          ),
          initializedTicksCrossedList: [...route.initializedTicksCrossedList],
          quoterGasEstimate: BigInt(route.gasEstimate),
          percent: route.percent,
          route: route.route,
          mixedRouteGasModel: route.gasModel,
          v2PoolProvider,
          quoteToken: new Token({
            chainId: currencyIn.chainId,
            address: route.quoteToken.address,
            decimals: route.quoteToken.decimals,
            symbol: route.quoteToken.symbol,
            name: route.quoteToken.name,
          }),
          tradeType: tradeType,
          v3PoolProvider: v3PoolProvider,
        })
    }
  })
  const trade = buildTrade<typeof tradeType>(
    currencyIn,
    currencyOut,
    tradeType,
    routesWithValidQuote
  )

  const quoteGasAndPortionAdjusted = swapRoute.portionAmount
    ? portionProvider.getQuoteGasAndPortionAdjusted(
        swapRoute.trade.tradeType,
        quoteGasAdjusted,
        swapRoute.portionAmount
      )
    : undefined
  const routesWithValidQuotePortionAdjusted =
    portionProvider.getRouteWithQuotePortionAdjusted(
      swapRoute.trade.tradeType,
      routesWithValidQuote,
      swapOptions
    )

  return {
    quote: swapRoute.quote,
    quoteGasAdjusted,
    quoteGasAndPortionAdjusted,
    estimatedGasUsed: BigInt(estimatedGasUsed),
    estimatedGasUsedQuoteToken,
    estimatedGasUsedUSD,
    gasPriceWei: BigInt(swapRoute.gasPriceWei),
    trade,
    route: routesWithValidQuotePortionAdjusted,
    blockNumber: BigInt(swapRoute.blockNumber),
    methodParameters: swapRoute.methodParameters
      ? ({
          calldata: swapRoute.methodParameters.calldata,
          value: swapRoute.methodParameters.value,
          to: swapRoute.methodParameters.to,
        } as MethodParameters)
      : undefined,
    simulationStatus: swapRoute.simulationStatus,
    portionAmount: swapRoute.portionAmount,
  }
}

export const calculateL1GasFeesHelper = async (
  route: RouteWithValidQuote[],
  chainId: ChainId,
  usdPool: Pair | Pool,
  quoteToken: Token,
  nativePool: Pair | Pool | null,
  l2GasData?: ArbitrumGasData
): Promise<{
  gasUsedL1: bigint
  gasUsedL1OnL2: bigint
  gasCostL1USD: CurrencyAmount<Currency>
  gasCostL1QuoteToken: CurrencyAmount<Currency>
}> => {
  const swapOptions: SwapOptionsUniversalRouter = {
    type: SwapType.UNIVERSAL_ROUTER,
    recipient: "0x0000000000000000000000000000000000000001",
    deadlineOrPreviousBlockhash: 100,
    slippageTolerance: new Percent(5, 10_000),
  }
  let mainnetGasUsed = 0n
  let mainnetFeeInWei = 0n
  let gasUsedL1OnL2 = 0n
  // @ts-expect-error: dont worry
  if (opStackChains.includes(chainId)) {
    ;[mainnetGasUsed, mainnetFeeInWei] = await calculateOptimismToL1SecurityFee(
      route,
      swapOptions,
      chainId
    )
  } else if (
    chainId === ChainId.ARBITRUM ||
    chainId === ChainId.ARBITRUM_TESTNET
  ) {
    ;[mainnetGasUsed, mainnetFeeInWei, gasUsedL1OnL2] =
      calculateArbitrumToL1SecurityFee(route, swapOptions, l2GasData!, chainId)
  }

  // wrap fee to native currency
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[chainId]
  const costNativeCurrency = CurrencyAmount.fromRawAmount(
    nativeCurrency,
    mainnetFeeInWei
  )

  // convert fee into usd
  const gasCostL1USD: CurrencyAmount<Currency> = getQuoteThroughNativePool(
    chainId,
    costNativeCurrency,
    usdPool
  )

  let gasCostL1QuoteToken = costNativeCurrency
  // if the inputted token is not in the native currency, quote a native/quote token pool to get the gas cost in terms of the quote token
  if (!quoteToken.equals(nativeCurrency)) {
    if (!nativePool) {
      log.info(
        LogCodes.NOT_FOUND,
        "Could not find a pool to convert the cost into the quote token"
      )
      gasCostL1QuoteToken = CurrencyAmount.fromRawAmount(quoteToken, 0)
    } else {
      const nativeTokenPrice =
        nativePool.token0.address === nativeCurrency.address
          ? nativePool.token0Price
          : nativePool.token1Price
      gasCostL1QuoteToken = nativeTokenPrice.quote(costNativeCurrency)
    }
  }
  // gasUsedL1 is the gas units used calculated from the bytes of the calldata
  // gasCostL1USD and gasCostL1QuoteToken is the cost of gas in each of those tokens
  return {
    gasUsedL1: mainnetGasUsed,
    gasUsedL1OnL2,
    gasCostL1USD,
    gasCostL1QuoteToken,
  }

  /**
   * To avoid having a call to optimism's L1 security fee contract for every route and amount combination,
   * we replicate the gas cost accounting here.
   */
  async function calculateOptimismToL1SecurityFee(
    routes: RouteWithValidQuote[],
    swapConfig: SwapOptionsUniversalRouter,
    opChainId: ChainId
  ): Promise<[bigint, bigint]> {
    const firstRoute: RouteWithValidQuote = routes[0]!
    const amountToken =
      firstRoute.tradeType === TradeType.EXACT_INPUT
        ? firstRoute.amount.currency
        : firstRoute.quote.currency
    const outputToken =
      firstRoute.tradeType === TradeType.EXACT_INPUT
        ? firstRoute.quote.currency
        : firstRoute.amount.currency

    // build trade for swap calldata
    const trade = buildTrade(
      amountToken,
      outputToken,
      firstRoute.tradeType,
      routes
    )
    const data = buildSwapMethodParameters(
      trade,
      swapConfig,
      ChainId.OPTIMISM
    ).calldata

    const [l1GasUsed, l1GasCost] = await calculateOptimismToL1FeeFromCalldata(
      data,
      opChainId
    )
    return [l1GasUsed, l1GasCost]
  }

  function calculateArbitrumToL1SecurityFee(
    routes: RouteWithValidQuote[],
    swapConfig: SwapOptionsUniversalRouter,
    gasData: ArbitrumGasData,
    arbChainId: ChainId
  ): [bigint, bigint, bigint] {
    const firstRoute: RouteWithValidQuote = routes[0]!

    const amountToken =
      firstRoute.tradeType === TradeType.EXACT_INPUT
        ? firstRoute.amount.currency
        : firstRoute.quote.currency
    const outputToken =
      firstRoute.tradeType === TradeType.EXACT_INPUT
        ? firstRoute.quote.currency
        : firstRoute.amount.currency

    // build trade for swap calldata
    const trade = buildTrade(
      amountToken,
      outputToken,
      firstRoute.tradeType,
      routes
    )
    const data = buildSwapMethodParameters(
      trade,
      swapConfig,
      ChainId.ARBITRUM
    ).calldata

    return calculateArbitrumToL1FeeFromCalldata(data, gasData, arbChainId)
  }
}
