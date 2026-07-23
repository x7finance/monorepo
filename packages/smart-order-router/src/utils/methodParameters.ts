/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import _ from "lodash"

import type { RouteV2Wrapper, RouteV3Wrapper } from "@x7/sdk"
import {
  generateRouterAddress,
  MixedRouteSDK,
  SwapRouter as SwapRouter02,
  Trade,
  SwapRouter as UniveralRouter,
  UNIVERSAL_ROUTER_ADDRESS,
  RouteV2 as V2RouteRaw,
  RouteV3 as V3RouteRaw,
} from "@x7/sdk"
import type { ChainId, Currency } from "@x7/utils"
import { Protocol, TradeType } from "@x7/utils"

import type {
  MixedRouteWithValidQuote,
  RouteWithValidQuote,
  V2RouteWithValidQuote,
  V3RouteWithValidQuote,
} from "../routers/alpha-router/entities/route-with-valid-quote"
import type { MethodParameters, SwapOptions } from "../routers/router"
import { SwapType } from "../routers/router"

import { CurrencyAmount } from "./amounts"

export function buildTrade<TTradeType extends TradeType>(
  tokenInCurrency: Currency,
  tokenOutCurrency: Currency,
  tradeType: TTradeType,
  routeAmounts: RouteWithValidQuote[]
): Trade<Currency, Currency, TTradeType> {
  /// Removed partition because of new mixedRoutes
  const v3RouteAmounts = _.filter(
    routeAmounts,
    (routeAmount) => routeAmount.protocol === Protocol.V3
  )
  const v2RouteAmounts = _.filter(
    routeAmounts,
    (routeAmount) => routeAmount.protocol === Protocol.V2
  )
  const mixedRouteAmounts = _.filter(
    routeAmounts,
    (routeAmount) => routeAmount.protocol === Protocol.MIXED
  )

  const v3Routes = _.map<
    V3RouteWithValidQuote,
    {
      routev3: V3RouteRaw<Currency, Currency>
      inputAmount: CurrencyAmount
      outputAmount: CurrencyAmount
    }
  >(v3RouteAmounts, (routeAmount: V3RouteWithValidQuote) => {
    const { route, amount, quote } = routeAmount

    // The route, amount and quote are all in terms of wrapped tokens.
    // When constructing the Trade object the inputAmount/outputAmount must
    // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
    if (tradeType === TradeType.EXACT_INPUT) {
      const amountCurrency = CurrencyAmount.fromFractionalAmount(
        tokenInCurrency,
        amount.numerator,
        amount.denominator
      )
      const quoteCurrency = CurrencyAmount.fromFractionalAmount(
        tokenOutCurrency,
        quote.numerator,
        quote.denominator
      )

      const routeRaw = new V3RouteRaw(
        route.pools,
        amountCurrency.currency,
        quoteCurrency.currency
      )

      return {
        routev3: routeRaw,
        inputAmount: amountCurrency,
        outputAmount: quoteCurrency,
      }
    } else {
      const quoteCurrency = CurrencyAmount.fromFractionalAmount(
        tokenInCurrency,
        quote.numerator,
        quote.denominator
      )

      const amountCurrency = CurrencyAmount.fromFractionalAmount(
        tokenOutCurrency,
        amount.numerator,
        amount.denominator
      )

      const routeCurrency = new V3RouteRaw(
        route.pools,
        quoteCurrency.currency,
        amountCurrency.currency
      )

      return {
        routev3: routeCurrency,
        inputAmount: quoteCurrency,
        outputAmount: amountCurrency,
      }
    }
  })

  const v2Routes = _.map<
    V2RouteWithValidQuote,
    {
      routev2: V2RouteRaw<Currency, Currency>
      inputAmount: CurrencyAmount
      outputAmount: CurrencyAmount
    }
  >(v2RouteAmounts, (routeAmount: V2RouteWithValidQuote) => {
    const { route, amount, quote } = routeAmount

    // The route, amount and quote are all in terms of wrapped tokens.
    // When constructing the Trade object the inputAmount/outputAmount must
    // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
    if (tradeType === TradeType.EXACT_INPUT) {
      const amountCurrency = CurrencyAmount.fromFractionalAmount(
        tokenInCurrency,
        amount.numerator,
        amount.denominator
      )
      const quoteCurrency = CurrencyAmount.fromFractionalAmount(
        tokenOutCurrency,
        quote.numerator,
        quote.denominator
      )

      const routeV2SDK = new V2RouteRaw(
        route.pairs,
        amountCurrency.currency,
        quoteCurrency.currency
      )

      return {
        routev2: routeV2SDK,
        inputAmount: amountCurrency,
        outputAmount: quoteCurrency,
      }
    } else {
      const quoteCurrency = CurrencyAmount.fromFractionalAmount(
        tokenInCurrency,
        quote.numerator,
        quote.denominator
      )

      const amountCurrency = CurrencyAmount.fromFractionalAmount(
        tokenOutCurrency,
        amount.numerator,
        amount.denominator
      )

      const routeV2SDK = new V2RouteRaw(
        route.pairs,
        quoteCurrency.currency,
        amountCurrency.currency
      )

      return {
        routev2: routeV2SDK,
        inputAmount: quoteCurrency,
        outputAmount: amountCurrency,
      }
    }
  })

  const mixedRoutes = _.map<
    MixedRouteWithValidQuote,
    {
      mixedRoute: MixedRouteSDK<Currency, Currency>
      inputAmount: CurrencyAmount
      outputAmount: CurrencyAmount
    }
  >(mixedRouteAmounts, (routeAmount: MixedRouteWithValidQuote) => {
    const { route, amount, quote } = routeAmount

    if (tradeType !== TradeType.EXACT_INPUT) {
      throw new Error("Mixed routes are only supported for exact input trades")
    }

    // The route, amount and quote are all in terms of wrapped tokens.
    // When constructing the Trade object the inputAmount/outputAmount must
    // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
    const amountCurrency = CurrencyAmount.fromFractionalAmount(
      tokenInCurrency,
      amount.numerator,
      amount.denominator
    )
    const quoteCurrency = CurrencyAmount.fromFractionalAmount(
      tokenOutCurrency,
      quote.numerator,
      quote.denominator
    )

    const routeRaw = new MixedRouteSDK(
      route.pools,
      amountCurrency.currency,
      quoteCurrency.currency
    )

    return {
      mixedRoute: routeRaw,
      inputAmount: amountCurrency,
      outputAmount: quoteCurrency,
    }
  })

  const trade = new Trade({ v2Routes, v3Routes, mixedRoutes, tradeType })

  return trade
}

// TODO(multiimplement): BUILD BASED ON pairTypes on pairs in v2
export function buildSwapMethodParameters(
  trade: Trade<Currency, Currency, TradeType>,
  swapConfig: SwapOptions,
  chainId: ChainId
): MethodParameters {
  if (swapConfig.type === SwapType.UNIVERSAL_ROUTER) {
    return {
      ...UniveralRouter.swapCallParameters(trade, swapConfig),
      to: UNIVERSAL_ROUTER_ADDRESS(chainId),
    }
  } else if (swapConfig.type === SwapType.SWAP_ROUTER_02) {
    const { recipient, slippageTolerance, deadline, inputTokenPermit } =
      swapConfig

    const imp =
      trade.routes[0]?.protocol === Protocol.V2
        ? (trade.routes[0] as RouteV2Wrapper<Currency, Currency>).pairs[0]!
            .pairType
        : (trade.routes[0] as RouteV3Wrapper<Currency, Currency>).pools[0]!
            .poolType

    return {
      ...SwapRouter02.swapCallParameters(
        trade,
        {
          recipient: recipient as `0x${string}`,
          slippageTolerance,
          deadlineOrPreviousBlockhash: deadline,
          inputTokenPermit,
        },
        imp
      ),
      to: generateRouterAddress(chainId, imp, trade.routes[0]?.protocol),
    }
  }

  throw new Error(`Unsupported swap type ${swapConfig}`)
}
