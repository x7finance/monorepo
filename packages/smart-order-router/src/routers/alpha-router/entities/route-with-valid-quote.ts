import _ from "lodash"

import { Pool } from "@x7/sdk"
import type { Token } from "@x7/utils"
import { Protocol, TradeType } from "@x7/utils"

import type { IV2PoolProvider } from "../../../providers/v2/pool-provider"
import type { IV3PoolProvider } from "../../../providers/v3/pool-provider"
import { CurrencyAmount } from "../../../utils/amounts"
import { routeToString } from "../../../utils/route-string"
import type { MixedRoute, V2Route, V3Route } from "../../route-types"
import type { IGasModel } from "../gas-models/gas-model-types"

export interface BestSwapRoute {
  quote: CurrencyAmount
  quoteGasAdjusted: CurrencyAmount
  estimatedGasUsed: bigint
  estimatedGasUsedUSD: CurrencyAmount
  estimatedGasUsedQuoteToken: CurrencyAmount
  routes: RouteWithValidQuote[]
}

/**
 * Represents a route, a quote for swapping some amount on it, and other
 * metadata used by the routing algorithm.
 *
 * @export
 * @interface IRouteWithValidQuote
 * @template Route
 */
export interface IRouteWithValidQuote<
  Route extends V3Route | V2Route | MixedRoute,
> {
  amount: CurrencyAmount
  percent: number
  // If exact in, this is (quote - gasCostInToken). If exact out, this is (quote + gasCostInToken).
  quoteAdjustedForGas: CurrencyAmount
  quote: CurrencyAmount
  route: Route
  gasEstimate: bigint
  // The gas cost in terms of the quote token.
  gasCostInToken: CurrencyAmount
  gasCostInUSD: CurrencyAmount
  tradeType: TradeType
  poolAddresses: string[]
  tokenPath: Token[]
}

// Discriminated unions on protocol field to narrow types.
export type IV2RouteWithValidQuote = {
  protocol: Protocol.V2
} & IRouteWithValidQuote<V2Route>

export type IV3RouteWithValidQuote = {
  protocol: Protocol.V3
} & IRouteWithValidQuote<V3Route>

export type IMixedRouteWithValidQuote = {
  protocol: Protocol.MIXED
} & IRouteWithValidQuote<MixedRoute>

export type RouteWithValidQuote =
  | V2RouteWithValidQuote
  | V3RouteWithValidQuote
  | MixedRouteWithValidQuote

export interface V2RouteWithValidQuoteParams {
  amount: CurrencyAmount
  rawQuote: bigint
  percent: number
  route: V2Route
  gasModel: IGasModel<V2RouteWithValidQuote>
  quoteToken: Token
  tradeType: TradeType
  v2PoolProvider: IV2PoolProvider
}
/**
 * Represents a quote for swapping on a V2 only route. Contains all information
 * such as the route used, the amount specified by the user, the type of quote
 * (exact in or exact out), the quote itself, and gas estimates.
 *
 * @export
 * @class V2RouteWithValidQuote
 */
export class V2RouteWithValidQuote implements IV2RouteWithValidQuote {
  public readonly protocol = Protocol.V2
  public amount: CurrencyAmount
  public rawQuote: bigint
  public quote: CurrencyAmount
  public quoteAdjustedForGas: CurrencyAmount
  public percent: number
  public route: V2Route
  public quoteToken: Token
  public gasModel: IGasModel<V2RouteWithValidQuote>
  public gasEstimate: bigint
  public gasCostInToken: CurrencyAmount
  public gasCostInUSD: CurrencyAmount
  public tradeType: TradeType
  public poolAddresses: string[]
  public tokenPath: Token[]

  public toString(): string {
    return `${this.percent.toFixed(
      2
    )}% QuoteGasAdj[${this.quoteAdjustedForGas.toExact()}] Quote[${this.quote.toExact()}] Gas[${this.gasEstimate.toString()}] = ${routeToString(
      this.route
    )}`
  }

  constructor({
    amount,
    rawQuote,
    percent,
    route,
    gasModel,
    quoteToken,
    tradeType,
    v2PoolProvider,
  }: V2RouteWithValidQuoteParams) {
    this.amount = amount
    this.rawQuote = rawQuote
    this.quote = CurrencyAmount.fromRawAmount(quoteToken, rawQuote)
    this.percent = percent
    this.route = route
    this.gasModel = gasModel
    this.quoteToken = quoteToken
    this.tradeType = tradeType

    const { gasEstimate, gasCostInToken, gasCostInUSD } =
      this.gasModel.estimateGasCost(this)

    this.gasCostInToken = gasCostInToken
    this.gasCostInUSD = gasCostInUSD
    this.gasEstimate = gasEstimate

    // If its exact out, we need to request *more* of the input token to account for the gas.
    if (this.tradeType === TradeType.EXACT_INPUT) {
      const quoteGasAdjusted = this.quote.subtract(gasCostInToken)
      this.quoteAdjustedForGas = quoteGasAdjusted
    } else {
      const quoteGasAdjusted = this.quote.add(gasCostInToken)
      this.quoteAdjustedForGas = quoteGasAdjusted
    }

    this.poolAddresses = _.flatMap(route.pairs, (p) =>
      v2PoolProvider
        .getPoolAddresses(p.token0, p.token1)
        .poolAddresses.map((imp) => imp.address)
    )

    this.tokenPath = this.route.path
  }
}

export interface V3RouteWithValidQuoteParams {
  amount: CurrencyAmount
  rawQuote: bigint
  sqrtPriceX96AfterList: bigint[]
  initializedTicksCrossedList: number[]
  quoterGasEstimate: bigint
  percent: number
  route: V3Route
  gasModel: IGasModel<V3RouteWithValidQuote>
  quoteToken: Token
  tradeType: TradeType
  v3PoolProvider: IV3PoolProvider
}

/**
 * Represents a quote for swapping on a V3 only route. Contains all information
 * such as the route used, the amount specified by the user, the type of quote
 * (exact in or exact out), the quote itself, and gas estimates.
 *
 * @export
 * @class V3RouteWithValidQuote
 */
export class V3RouteWithValidQuote implements IV3RouteWithValidQuote {
  public readonly protocol = Protocol.V3
  public amount: CurrencyAmount
  public rawQuote: bigint
  public quote: CurrencyAmount
  public quoteAdjustedForGas: CurrencyAmount
  public sqrtPriceX96AfterList: bigint[]
  public initializedTicksCrossedList: number[]
  public quoterGasEstimate: bigint
  public percent: number
  public route: V3Route
  public quoteToken: Token
  public gasModel: IGasModel<V3RouteWithValidQuote>
  public gasEstimate: bigint
  public gasCostInToken: CurrencyAmount
  public gasCostInUSD: CurrencyAmount
  public tradeType: TradeType
  public poolAddresses: string[]
  public tokenPath: Token[]

  public toString(): string {
    return `${this.percent.toFixed(
      2
    )}% QuoteGasAdj[${this.quoteAdjustedForGas.toExact()}] Quote[${this.quote.toExact()}] Gas[${this.gasEstimate.toString()}] = ${routeToString(
      this.route
    )}`
  }

  constructor({
    amount,
    rawQuote,
    sqrtPriceX96AfterList,
    initializedTicksCrossedList,
    quoterGasEstimate,
    percent,
    route,
    gasModel,
    quoteToken,
    tradeType,
    v3PoolProvider,
  }: V3RouteWithValidQuoteParams) {
    this.amount = amount
    this.rawQuote = rawQuote
    this.sqrtPriceX96AfterList = sqrtPriceX96AfterList
    this.initializedTicksCrossedList = initializedTicksCrossedList
    this.quoterGasEstimate = quoterGasEstimate
    this.quote = CurrencyAmount.fromRawAmount(quoteToken, rawQuote)
    this.percent = percent
    this.route = route
    this.gasModel = gasModel
    this.quoteToken = quoteToken
    this.tradeType = tradeType

    const { gasEstimate, gasCostInToken, gasCostInUSD } =
      this.gasModel.estimateGasCost(this)

    this.gasCostInToken = gasCostInToken
    this.gasCostInUSD = gasCostInUSD
    this.gasEstimate = gasEstimate

    // If its exact out, we need to request *more* of the input token to account for the gas.
    if (this.tradeType === TradeType.EXACT_INPUT) {
      const quoteGasAdjusted = this.quote.subtract(gasCostInToken)
      this.quoteAdjustedForGas = quoteGasAdjusted
    } else {
      const quoteGasAdjusted = this.quote.add(gasCostInToken)
      this.quoteAdjustedForGas = quoteGasAdjusted
    }

    // this.poolAddresses = _.map(
    //   route.pools,
    //   (p) =>
    //     v3PoolProvider.getPoolAddress(p.token0, p.token1, p.fee).poolAddress,
    // );

    this.poolAddresses = _.flatMap(route.pools, (p) => {
      return v3PoolProvider
        .getPoolAddresses(p.token0, p.token1, p.fee)
        .poolAddresses.map((imp) => imp.address)
    })

    this.tokenPath = this.route.tokenPath
  }
}

export interface MixedRouteWithValidQuoteParams {
  amount: CurrencyAmount
  rawQuote: bigint
  sqrtPriceX96AfterList: bigint[]
  initializedTicksCrossedList: number[]
  quoterGasEstimate: bigint
  percent: number
  route: MixedRoute
  mixedRouteGasModel: IGasModel<MixedRouteWithValidQuote>
  quoteToken: Token
  tradeType: TradeType
  v3PoolProvider: IV3PoolProvider
  v2PoolProvider: IV2PoolProvider
}

/**
 * Represents a quote for swapping on a Mixed Route. Contains all information
 * such as the route used, the amount specified by the user, the type of quote
 * (exact in or exact out), the quote itself, and gas estimates.
 *
 * @export
 * @class MixedRouteWithValidQuote
 */
export class MixedRouteWithValidQuote implements IMixedRouteWithValidQuote {
  public readonly protocol = Protocol.MIXED
  public amount: CurrencyAmount
  public rawQuote: bigint
  public quote: CurrencyAmount
  public quoteAdjustedForGas: CurrencyAmount
  public sqrtPriceX96AfterList: bigint[]
  public initializedTicksCrossedList: number[]
  public quoterGasEstimate: bigint
  public percent: number
  public route: MixedRoute
  public quoteToken: Token
  public gasModel: IGasModel<MixedRouteWithValidQuote>
  public gasEstimate: bigint
  public gasCostInToken: CurrencyAmount
  public gasCostInUSD: CurrencyAmount
  public tradeType: TradeType
  public poolAddresses: string[]
  public tokenPath: Token[]

  public toString(): string {
    return `${this.percent.toFixed(
      2
    )}% QuoteGasAdj[${this.quoteAdjustedForGas.toExact()}] Quote[${this.quote.toExact()}] Gas[${this.gasEstimate.toString()}] = ${routeToString(
      this.route
    )}`
  }

  constructor({
    amount,
    rawQuote,
    sqrtPriceX96AfterList,
    initializedTicksCrossedList,
    quoterGasEstimate,
    percent,
    route,
    mixedRouteGasModel,
    quoteToken,
    tradeType,
    v3PoolProvider,
    v2PoolProvider,
  }: MixedRouteWithValidQuoteParams) {
    this.amount = amount
    this.rawQuote = rawQuote
    this.sqrtPriceX96AfterList = sqrtPriceX96AfterList
    this.initializedTicksCrossedList = initializedTicksCrossedList
    this.quoterGasEstimate = quoterGasEstimate
    this.quote = CurrencyAmount.fromRawAmount(quoteToken, rawQuote)
    this.percent = percent
    this.route = route
    this.gasModel = mixedRouteGasModel
    this.quoteToken = quoteToken
    this.tradeType = tradeType

    const { gasEstimate, gasCostInToken, gasCostInUSD } =
      this.gasModel.estimateGasCost(this)

    this.gasCostInToken = gasCostInToken
    this.gasCostInUSD = gasCostInUSD
    this.gasEstimate = gasEstimate

    // If its exact out, we need to request *more* of the input token to account for the gas.
    if (this.tradeType === TradeType.EXACT_INPUT) {
      const quoteGasAdjusted = this.quote.subtract(gasCostInToken)
      this.quoteAdjustedForGas = quoteGasAdjusted
    } else {
      const quoteGasAdjusted = this.quote.add(gasCostInToken)
      this.quoteAdjustedForGas = quoteGasAdjusted
    }

    this.poolAddresses = _.flatMap(route.pools, (p) => {
      return p instanceof Pool
        ? v3PoolProvider
            .getPoolAddresses(p.token0, p.token1, p.fee)
            .poolAddresses.map((imp) => imp.address)
        : v2PoolProvider
            .getPoolAddresses(p.token0, p.token1)
            .poolAddresses.map((imp) => imp.address)
    })

    this.tokenPath = this.route.path
  }
}
