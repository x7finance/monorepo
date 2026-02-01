import type Rounding from "./Rounding"

/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import Fraction from "./Fraction"

const ONE_HUNDRED = new Fraction(100n)

/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction: Fraction): Percent {
  return new Percent(fraction.numerator, fraction.denominator)
}

class Percent extends Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  public readonly isPercent = true as const

  override add(other: Fraction | bigint | number): Percent {
    return toPercent(super.add(other))
  }

  override subtract(other: Fraction | bigint): Percent {
    return toPercent(super.subtract(other))
  }

  override multiply(other: Fraction | bigint | number): Percent {
    return toPercent(super.multiply(other))
  }

  override divide(other: Fraction | bigint): Percent {
    return toPercent(super.divide(other))
  }

  public override toSignificant(
    significantDigits = 5,
    format?: any,
    rounding?: Rounding
  ): string {
    return super
      .multiply(ONE_HUNDRED)
      .toSignificant(significantDigits, format, rounding)
  }

  public override toFixed(
    decimalPlaces = 2,
    format?: object,
    rounding?: Rounding
  ): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding)
  }
}

export default Percent
