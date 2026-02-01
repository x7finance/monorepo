/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unsafe-return */
import invariant from "tiny-invariant";
import { maxUint128 } from "viem";
import { MAX_UINT256, ZERO } from "../constants/numbers";
import Fraction from "../Fraction";
import Rounding from "../Rounding";
import { Native } from "../../currency/Native";
import { Token } from "../../currency/Token";
import { amountSchema } from "../../currency/zod";
import Big from "../Big";
export class Share extends Fraction {
    currency;
    scale;
    static fromRawShare(currency, rawShare = 0) {
        return new Share(currency, rawShare);
    }
    constructor(currency, numerator, denominator) {
        super(numerator, denominator);
        invariant(this.quotient <= maxUint128, "SHARE");
        this.currency = currency;
        this.scale = 10n ** BigInt(currency.decimals);
    }
    toAmount(rebase, roundUp = false) {
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
    static fromFractionalShare(currency, numerator, denominator) {
        return new Share(currency, numerator, denominator);
    }
    add(other) {
        invariant(this.currency.equals(other.currency), "CURRENCY");
        const added = super.add(other);
        return Share.fromFractionalShare(this.currency, added.numerator, added.denominator);
    }
    subtract(other) {
        invariant(this.currency.equals(other.currency), "CURRENCY");
        const subtracted = super.subtract(other);
        return Share.fromFractionalShare(this.currency, subtracted.numerator, subtracted.denominator);
    }
    multiply(other) {
        const multiplied = super.multiply(other);
        return Share.fromFractionalShare(this.currency, multiplied.numerator, multiplied.denominator);
    }
    divide(other) {
        const divided = super.divide(other);
        return Share.fromFractionalShare(this.currency, divided.numerator, divided.denominator);
    }
    toSignificant(significantDigits = 6, format, rounding = Rounding.ROUND_DOWN) {
        return super
            .divide(this.scale)
            .toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = this.currency.decimals, format, rounding = Rounding.ROUND_DOWN) {
        invariant(decimalPlaces <= this.currency.decimals, "DECIMALS");
        return super.divide(this.scale).toFixed(decimalPlaces, format, rounding);
    }
    toExact(format = { groupSeparator: "" }) {
        Big.DP = this.currency.decimals;
        const exactNumber = new Big(this.quotient.toString()).div(this.scale.toString());
        const result = exactNumber.toString();
        if (!format.groupSeparator) {
            return result;
        }
        const [integerPart, decimalPart] = result.split(".");
        const formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, format.groupSeparator);
        return decimalPart
            ? `${formattedIntegerPart}.${decimalPart}`
            : `${formattedIntegerPart}`;
    }
}
export class CurrencyAmount extends Fraction {
    currency;
    scale;
    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    static fromRawAmount(currency, rawAmount) {
        return new CurrencyAmount(currency, rawAmount);
    }
    static fromShare(currency, shares, rebase, roundUp = false) {
        if (rebase.base === ZERO)
            return new CurrencyAmount(currency, shares);
        const sharesBI = typeof shares === "bigint" ? shares : BigInt(shares);
        const elastic = (sharesBI * rebase.elastic) / rebase.base;
        if (roundUp && (elastic * rebase.base) / rebase.elastic < sharesBI) {
            return new CurrencyAmount(currency, elastic + 1n);
        }
        return new CurrencyAmount(currency, elastic);
    }
    toShare(rebase, roundUp = false) {
        if (rebase.elastic === ZERO)
            return Share.fromRawShare(this.currency, this.quotient);
        const base = (this.quotient * rebase.base) / rebase.elastic;
        if (roundUp && (base * rebase.elastic) / rebase.base < this.quotient) {
            return Share.fromRawShare(this.currency, base + 1n);
        }
        return Share.fromRawShare(this.currency, base);
    }
    /**
     * Construct a currency amount with a denominator that is not equal to 1
     * @param currency the currency
     * @param numerator the numerator of the fractional token amount
     * @param denominator the denominator of the fractional token amount
     */
    static fromFractionalAmount(currency, numerator, denominator) {
        return new CurrencyAmount(currency, numerator, denominator);
    }
    constructor(currency, numerator, denominator) {
        super(numerator, denominator);
        invariant(this.quotient <= MAX_UINT256, "AMOUNT");
        this.currency = currency;
        this.scale = 10n ** BigInt(currency.decimals);
    }
    add(other) {
        invariant(this.currency.equals(other.currency), "CURRENCY");
        const added = super.add(other);
        return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
    }
    subtract(other) {
        invariant(this.currency.equals(other.currency), "CURRENCY");
        const subtracted = super.subtract(other);
        return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
    }
    multiply(other) {
        const multiplied = super.multiply(other);
        return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
    }
    divide(other) {
        const divided = super.divide(other);
        return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
    }
    toSignificant(significantDigits = 6, format, rounding = Rounding.ROUND_DOWN) {
        return super
            .divide(this.scale)
            .toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = this.currency.decimals, format, rounding = Rounding.ROUND_DOWN) {
        decimalPlaces = Math.min(decimalPlaces, this.currency.decimals);
        invariant(decimalPlaces <= this.currency.decimals, "DECIMALS");
        return super.divide(this.scale).toFixed(decimalPlaces, format, rounding);
    }
    toHex() {
        return `0x${this.quotient.toString(16)}`;
    }
    toExact(groupSeparator = "") {
        Big.DP = this.currency.decimals;
        const exactNumber = new Big(this.quotient.toString()).div(this.scale.toString());
        const result = exactNumber.toString();
        const [integerPart, decimalPart] = result.split(".");
        const formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
        return decimalPart
            ? `${formattedIntegerPart}.${decimalPart}`
            : `${formattedIntegerPart}`;
    }
    get wrapped() {
        if (this.currency.isToken)
            return this;
        return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
    }
    serialize() {
        return amountSchema.parse({
            amount: this.quotient.toString(),
            currency: this.currency.serialize(),
        });
    }
    static deserialize(amount) {
        if (amount.currency.isNative)
            return CurrencyAmount.fromRawAmount(Native.deserialize(amount.currency), BigInt(amount.amount));
        return CurrencyAmount.fromRawAmount(Token.deserialize(amount.currency), BigInt(amount.amount));
    }
}
//# sourceMappingURL=currencyAmount.js.map