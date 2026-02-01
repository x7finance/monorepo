/* eslint-disable @typescript-eslint/no-non-null-assertion */
import _ from "lodash";

import { Percent, Protocol } from "@x7/utils";

import { CurrencyAmount } from "./amounts";
import { routeToString } from "./route-string";
import type { RouteWithValidQuote } from "../routers/alpha-router/entities/route-with-valid-quote";

export { routeToString, poolToString } from "./route-string";

export const routeAmountsToString = (
  routeAmounts: RouteWithValidQuote[],
): string => {
  const total = _.reduce(
    routeAmounts,
    (total: CurrencyAmount, cur: RouteWithValidQuote) => {
      return total.add(cur.amount);
    },
    CurrencyAmount.fromRawAmount(routeAmounts[0]!.amount.currency, 0),
  );

  const routeStrings = _.map(routeAmounts, ({ protocol, route, amount }) => {
    const portion = amount.divide(total);
    const percent = new Percent(portion.numerator, portion.denominator);
    /// @dev special case for MIXED routes we want to show user friendly V2+V3 instead
    return `[${
      protocol === Protocol.MIXED ? "V2 + V3" : protocol
    }] ${percent.toFixed(2)}% = ${routeToString(route)}`;
  });

  return _.join(routeStrings, ", ");
};

export const routeAmountToString = (
  routeAmount: RouteWithValidQuote,
): string => {
  const { route, amount } = routeAmount;
  return `${amount.toExact()} = ${routeToString(route)}`;
};
