import type { Currency } from "../Type"

/* oxlint-disable @typescript-eslint/no-unused-vars */
import { parseUnits } from "viem"

import { CurrencyAmount } from "../../math/fractions/currencyAmount"

// try to parse a user entered amount for a given token
export function tryParseAmount<T extends Currency>(
  value?: string,
  currency?: T
): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()

    if (typedValueParsed !== "0") {
      return CurrencyAmount.fromRawAmount(currency, BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    // console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined
}
