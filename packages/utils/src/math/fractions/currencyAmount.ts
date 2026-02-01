/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unsafe-return */

import type { Currency } from "../../currency/Type"
import type { SerializedAmount } from "../../currency/zod"

import invariant from "tiny-invariant"
import { maxUint128 } from "viem"

import { Native } from "../../currency/Native"
import { Token } from "../../currency/Token"
import { amountSchema } from "../../currency/zod"
import Big from "../Big"
import { MAX_UINT256, ZERO } from "../constants/numbers"
import Fraction from "../Fraction"
import Rounding from "../Rounding"

export class Share<T extends Currency> extends Fraction {
  public readonly currency: T
  public readonly scale: bigint

  public static fromRawShare<T extends Currency>(
    currency: T,
    rawShare: bigint | number = 0
  ): Share<T> {
    return new Share(currency, rawShare)
  }

  protected constructor(
    currency: T,
    numerator: bigint | number,
    denominator?: bigint
  ) {
    super(numerator, denominator)
    invariant(this.quotient <= maxUint128, "SHARE")
    this.currency = currency
    this.scale = 10n ** BigInt(currency.decimals)
  }

  public toAmount(rebase: { base: bigint; elastic: bigint }, roundUp = false) {
    if (rebase.base === ZERO)
      return CurrencyAmount.fromRawAmount(this.currency, this.quotient)

    const elastic = (this.quotient * rebase.elastic) / rebase.base

    if (roundUp && (elastic * rebase.base) / rebase.elastic < this.quotient) {
      return CurrencyAmount.fromRawAmount(this.currency, elastic + 1n)
    }

    return CurrencyAmount.fromRawAmount(this.currency, elastic)
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
    denominator: bigint
  ): Share<T> {
    return new Share(currency, numerator, denominator)
  }

  public override add(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), "CURRENCY")
    const added = super.add(other)
    return Share.fromFractionalShare(
      this.currency,
      added.numerator,
      added.denominator
    )
  }

  public override subtract(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), "CURRENCY")
    const subtracted = super.subtract(other)
    return Share.fromFractionalShare(
      this.currency,
      subtracted.numerator,
      subtracted.denominator
    )
  }

  public override multiply(other: Fraction | bigint): Share<T> {
    const multiplied = super.multiply(other)
    return Share.fromFractionalShare(
      this.currency,
      multiplied.numerator,
      multiplied.denominator
    )
  }

  public override divide(other: Fraction | bigint): Share<T> {
    const divided = super.divide(other)
    return Share.fromFractionalShare(
      this.currency,
      divided.numerator,
      divided.denominator
    )
  }

  public override toSignificant(
    significantDigits = 6,
    format?: any,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super
      .divide(this.scale)
      .toSignificant(significantDigits, format, rounding)
  }

  public override toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, "DECIMALS")
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(
    format: { groupSeparator?: string } = { groupSeparator: "" }
  ): string {
    Big.DP = this.currency.decimals

    const exactNumber = new Big(this.quotient.toString()).div(
      this.scale.toString()
    )

    const result = exactNumber.toString()

    if (!format.groupSeparator) {
      return result
    }

    const [integerPart, decimalPart] = result.split(".")

    const formattedIntegerPart = integerPart?.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      format.groupSeparator
    )

    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : `${formattedIntegerPart}`
  }
}

export class CurrencyAmount<T extends Currency> extends Fraction {
  public readonly currency: T
  public readonly scale: bigint
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends Currency>(
    currency: T,
    rawAmount: bigint | number
  ): CurrencyAmount<T> {
    return new CurrencyAmount(currency, rawAmount)
  }

  public static fromShare<T extends Currency>(
    currency: T,
    shares: bigint,
    rebase: { base: bigint; elastic: bigint },
    roundUp = false
  ): CurrencyAmount<T> {
    if (rebase.base === ZERO) return new CurrencyAmount(currency, shares)

    const sharesBI = typeof shares === "bigint" ? shares : BigInt(shares)

    const elastic = (sharesBI * rebase.elastic) / rebase.base

    if (roundUp && (elastic * rebase.base) / rebase.elastic < sharesBI) {
      return new CurrencyAmount(currency, elastic + 1n)
    }

    return new CurrencyAmount(currency, elastic)
  }

  public toShare(rebase: { base: bigint; elastic: bigint }, roundUp = false) {
    if (rebase.elastic === ZERO)
      return Share.fromRawShare(this.currency, this.quotient)

    const base = (this.quotient * rebase.base) / rebase.elastic

    if (roundUp && (base * rebase.elastic) / rebase.base < this.quotient) {
      return Share.fromRawShare(this.currency, base + 1n)
    }

    return Share.fromRawShare(this.currency, base)
  }

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends Currency>(
    currency: T,
    numerator: bigint | number,
    denominator: bigint | number
  ): CurrencyAmount<T> {
    return new CurrencyAmount(currency, numerator, denominator)
  }

  protected constructor(
    currency: T,
    numerator: bigint | number,
    denominator?: bigint | number
  ) {
    super(numerator, denominator)
    invariant(this.quotient <= MAX_UINT256, "AMOUNT")
    this.currency = currency
    this.scale = 10n ** BigInt(currency.decimals)
  }

  public override add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), "CURRENCY")
    const added = super.add(other)
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      added.numerator,
      added.denominator
    )
  }

  public override subtract(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), "CURRENCY")
    const subtracted = super.subtract(other)
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      subtracted.numerator,
      subtracted.denominator
    )
  }

  public override multiply(other: Fraction | bigint): CurrencyAmount<T> {
    const multiplied = super.multiply(other)
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      multiplied.numerator,
      multiplied.denominator
    )
  }

  public override divide(other: Fraction | bigint | number): CurrencyAmount<T> {
    const divided = super.divide(other)
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      divided.numerator,
      divided.denominator
    )
  }

  public override toSignificant(
    significantDigits = 6,
    format?: any,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super
      .divide(this.scale)
      .toSignificant(significantDigits, format, rounding)
  }

  public override toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    decimalPlaces = Math.min(decimalPlaces, this.currency.decimals)
    invariant(decimalPlaces <= this.currency.decimals, "DECIMALS")
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding)
  }

  public toHex(): string {
    return `0x${this.quotient.toString(16)}`
  }

  public toExact(groupSeparator = ""): string {
    Big.DP = this.currency.decimals

    const exactNumber = new Big(this.quotient.toString()).div(
      this.scale.toString()
    )

    const result = exactNumber.toString()

    const [integerPart, decimalPart] = result.split(".")

    const formattedIntegerPart = integerPart?.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      groupSeparator
    )

    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : `${formattedIntegerPart}`
  }

  public get wrapped(): CurrencyAmount<Token> {
    if (this.currency.isToken) return this as CurrencyAmount<Token>
    return CurrencyAmount.fromFractionalAmount(
      this.currency.wrapped,
      this.numerator,
      this.denominator
    )
  }

  public serialize(): SerializedAmount {
    return amountSchema.parse({
      amount: this.quotient.toString(),
      currency: this.currency.serialize(),
    })
  }

  public static deserialize<T extends Currency>(
    amount: SerializedAmount
  ): CurrencyAmount<T> {
    if (amount.currency.isNative)
      return CurrencyAmount.fromRawAmount(
        Native.deserialize(amount.currency) as T,
        BigInt(amount.amount)
      )
    return CurrencyAmount.fromRawAmount(
      Token.deserialize(amount.currency) as T,
      BigInt(amount.amount)
    )
  }
}
