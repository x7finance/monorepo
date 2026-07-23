/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import _ from "lodash"

import { Percent, Protocol } from "@x7/utils"

import type { MixedRoute, V2Route, V3Route } from "../routers/route-types"

import { CurrencyAmount } from "./amounts"
import { routeToString } from "./route-string"

export { routeToString, poolToString } from "./route-string"

// Minimal interface to avoid cyclic imports from alpha-router
interface RouteWithValidQuoteMinimal {
  amount: CurrencyAmount
  protocol: Protocol
  route: V3Route | V2Route | MixedRoute
}

export const routeAmountsToString = (
  routeAmounts: RouteWithValidQuoteMinimal[]
): string => {
  const total = _.reduce(
    routeAmounts,
    (acc: CurrencyAmount, cur: RouteWithValidQuoteMinimal) => {
      return acc.add(cur.amount)
    },
    CurrencyAmount.fromRawAmount(routeAmounts[0]!.amount.currency, 0)
  )

  const routeStrings = _.map(routeAmounts, ({ protocol, route, amount }) => {
    const portion = amount.divide(total)
    const percent = new Percent(portion.numerator, portion.denominator)
    /// @dev special case for MIXED routes we want to show user friendly V2+V3 instead
    return `[${
      protocol === Protocol.MIXED ? "V2 + V3" : protocol
    }] ${percent.toFixed(2)}% = ${routeToString(route)}`
  })

  return _.join(routeStrings, ", ")
}

export const routeAmountToString = (
  routeAmount: RouteWithValidQuoteMinimal
): string => {
  const { route, amount } = routeAmount
  return `${amount.toExact()} = ${routeToString(route)}`
}
