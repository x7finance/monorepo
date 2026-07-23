import type { Currency } from "../currency/Type"
import Fraction from "../math/Fraction"
import type { CurrencyAmount } from "../math/fractions/currencyAmount"
import type Percent from "../math/Percent"

const ONE = new Fraction(1, 1)

export function slippageAmount(
  value: CurrencyAmount<Currency>,
  slippage: Percent
): [bigint, bigint] {
  if (slippage.lessThan(0) || slippage.greaterThan(ONE))
    throw new Error("Unexpected slippage")
  return [
    value.multiply(ONE.subtract(slippage)).quotient,
    value.multiply(ONE.add(slippage)).quotient,
  ]
}
