/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
import invariant from "tiny-invariant";
import { MAX_UINT256, ZERO } from "../math/constants/numbers";
import Fraction from "../math/Fraction";
import Rounding from "../math/Rounding";
import Big from "../math/Big";
import { Native } from "./Native";
import { Share } from "./Share";
import { Token } from "./Token";
import { amountSchema } from "./zod";
export class Amount extends Fraction {
    currency;
    scale;
    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    static fromRawAmount(currency, rawAmount) {
        return new Amount(currency, rawAmount);
    }
    static fromShare(currency, shares, rebase, roundUp = false) {
        if (rebase.base === ZERO)
            return new Amount(currency, shares);
        const sharesBI = typeof shares === "bigint" ? shares : BigInt(shares.toString());
        const elastic = (sharesBI * rebase.elastic) / rebase.base;
        if (roundUp && (elastic * rebase.base) / rebase.elastic < sharesBI) {
            return new Amount(currency, elastic + 1n);
        }
        return new Amount(currency, elastic);
    }
    toShare(rebase, roundUp = false) {
        if (rebase.elastic === ZERO) {
            return Share.fromRawShare(this.currency, this.quotient);
        }
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
        return new Amount(currency, numerator, denominator);
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
        return Amount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
    }
    subtract(other) {
        invariant(this.currency.equals(other.currency), "CURRENCY");
        const subtracted = super.subtract(other);
        return Amount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator);
    }
    multiply(other) {
        const multiplied = super.multiply(other);
        return Amount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator);
    }
    divide(other) {
        const divided = super.divide(other);
        return Amount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator);
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
    toHex() {
        return `0x${this.quotient.toString(16)}`;
    }
    toExact(groupSeparator = "") {
        Big.DP = this.currency.decimals;
        const exactNumber = new Big(this.quotient.toString()).div(this.scale.toString());
        const parts = exactNumber.toFixed().split(".");
        const integerPart = parts[0];
        const decimalPart = parts[1] || "";
        const formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
        return decimalPart
            ? `${formattedIntegerPart}.${decimalPart}`
            : `${formattedIntegerPart}`;
    }
    get wrapped() {
        if (this.currency.isToken)
            return this;
        return Amount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator);
    }
    serialize() {
        return amountSchema.parse({
            amount: this.quotient.toString(),
            currency: this.currency.serialize(),
        });
    }
    static deserialize(amount) {
        if (amount.currency.isNative)
            return Amount.fromRawAmount(Native.deserialize(amount.currency), BigInt(amount.amount));
        return Amount.fromRawAmount(Token.deserialize(amount.currency), BigInt(amount.amount));
    }
}
//# sourceMappingURL=Amount.js.map