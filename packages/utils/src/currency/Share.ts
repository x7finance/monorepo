/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import invariant from "tiny-invariant";
import { maxUint128 } from "viem";

import { CurrencyAmount, Fraction, Rounding, ZERO } from "../math";
import Big from "../math/Big";
import type { Currency } from "./Type";

export class Share<T extends Currency> extends Fraction {
  public readonly currency: T;
  public readonly scale: bigint;

  public static fromRawShare<T extends Currency>(
    currency: T,
    rawShare: bigint | number = 0,
  ): Share<T> {
    return new Share(currency, rawShare);
  }

  protected constructor(
    currency: T,
    numerator: bigint | number,
    denominator?: bigint,
  ) {
    super(numerator, denominator);
    invariant(this.quotient <= maxUint128, "SHARE");
    this.currency = currency;
    this.scale = 10n ** BigInt(currency.decimals);
  }

  public toAmount(rebase: { base: bigint; elastic: bigint }, roundUp = false) {
    if (rebase.base === ZERO)
      return CurrencyAmount.fromRawAmount(this.currency, this.quotient);

    const elastic = (this.quotient * rebase.elastic) / rebase.base;

    if (roundUp && (elastic * rebase.base) / rebase.elastic < this.quotient) {
      return CurrencyAmount.fromRawAmount(this.currency, elastic + 1n);
    }

    return CurrencyAmount.fromRawAmount(this.currency, elastic);
  }

  /**
   * Construct a currency share with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token share
   * @param denominator the denominator of the fractional token share
   */
  public static fromFractionalShare<T extends Currency>(
    currency: T,
    numerator: bigint,
    denominator: bigint,
  ): Share<T> {
    return new Share(currency, numerator, denominator);
  }

  public override add(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), "CURRENCY");
    const added = super.add(other);
    return Share.fromFractionalShare(
      this.currency,
      added.numerator,
      added.denominator,
    );
  }

  public override subtract(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), "CURRENCY");
    const subtracted = super.subtract(other);
    return Share.fromFractionalShare(
      this.currency,
      subtracted.numerator,
      subtracted.denominator,
    );
  }

  public override multiply(other: Fraction | bigint): Share<T> {
    const multiplied = super.multiply(other);
    return Share.fromFractionalShare(
      this.currency,
      multiplied.numerator,
      multiplied.denominator,
    );
  }

  public override divide(other: Fraction | bigint): Share<T> {
    const divided = super.divide(other);
    return Share.fromFractionalShare(
      this.currency,
      divided.numerator,
      divided.denominator,
    );
  }

  public override toSignificant(
    significantDigits = 6,
    format?: any,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return super
      .divide(this.scale)
      .toSignificant(significantDigits, format, rounding);
  }

  public override toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, "DECIMALS");
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding);
  }

  public toExact(
    format: { groupSeparator?: string } = { groupSeparator: "" },
  ): string {
    Big.DP = this.currency.decimals;

    const exactNumber = new Big(this.quotient.toString()).div(
      this.scale.toString(),
    );

    const result = exactNumber.toString();

    if (!format.groupSeparator) {
      return result;
    }

    const [integerPart, decimalPart] = result.split(".");

    const formattedIntegerPart = integerPart?.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      format.groupSeparator,
    );

    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : `${formattedIntegerPart}`;
  }
}
