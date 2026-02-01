/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable prefer-const */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import invariant from "tiny-invariant";
import Big from "./Big";
import Decimal from "./Decimal";
import Rounding from "./Rounding";
const toSignificantRounding = {
    [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
    [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
    [Rounding.ROUND_UP]: Decimal.ROUND_UP,
};
const toFixedRounding = {
    [Rounding.ROUND_DOWN]: Big.roundDown,
    [Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
    [Rounding.ROUND_UP]: Big.roundUp,
};
class Fraction {
    numerator;
    denominator;
    constructor(numerator, denominator = 1n) {
        const { numerator: num, denominator: denom } = Fraction.parseFraction(numerator, denominator);
        this.numerator = num;
        this.denominator = denom;
    }
    static parseFraction(numerator, denominator) {
        const parsedNumerator = Fraction.parseValue(numerator);
        const parsedDenominator = Fraction.parseValue(denominator);
        // Multiply numerator's numerator by denominator's denominator
        const num = parsedNumerator.numerator * parsedDenominator.denominator;
        // Multiply numerator's denominator by denominator's numerator
        const denom = parsedNumerator.denominator * parsedDenominator.numerator;
        if (denom === 0n) {
            throw new Error("Denominator cannot be zero.");
        }
        // Simplify the fraction
        const gcd = Fraction.greatestCommonDivisor(num, denom);
        return {
            numerator: num / gcd,
            denominator: denom / gcd,
        };
    }
    static parseValue(value) {
        if (value instanceof Fraction) {
            return { numerator: value.numerator, denominator: value.denominator };
        }
        else if (typeof value === "bigint") {
            return { numerator: value, denominator: 1n };
        }
        else if (typeof value === "number" || typeof value === "string") {
            const valueStr = value.toString();
            if (valueStr.includes("e")) {
                const parts = valueStr.split("e");
                const base = parts[0];
                const exponent = parts[1] ? parseInt(parts[1], 10) : 0;
                if (base) {
                    const baseParts = base.split(".");
                    const decimalPartLength = baseParts[1] ? baseParts[1].length : 0;
                    const exponentValue = exponent + decimalPartLength;
                    const baseStr = baseParts.join("");
                    const numerator = BigInt(baseStr);
                    const denominator = BigInt(10 ** exponentValue);
                    return { numerator, denominator };
                }
                else {
                    throw new Error("Invalid base in exponential notation.");
                }
            }
            if (valueStr.includes(".")) {
                const decimalPlaces = valueStr.split(".")[1]?.length;
                const denominator = BigInt(10 ** decimalPlaces);
                const numerator = BigInt(valueStr.replace(".", ""));
                return { numerator, denominator };
            }
            else {
                return { numerator: BigInt(valueStr), denominator: 1n };
            }
        }
        else {
            throw new Error("Invalid value type for fraction.");
        }
    }
    static greatestCommonDivisor(a, b) {
        if (b === 0n)
            return a;
        return Fraction.greatestCommonDivisor(b, a % b);
    }
    // Performs floor division
    get quotient() {
        return this.numerator / this.denominator;
    }
    // Remainder after floor division
    get remainder() {
        return new Fraction(this.numerator % this.denominator, this.denominator);
    }
    invert() {
        if (this.numerator === 0n) {
            throw new Error("Cannot invert a fraction with zero numerator.");
        }
        return new Fraction(this.denominator, this.numerator);
    }
    add(other) {
        const otherFraction = new Fraction(other);
        return new Fraction(this.numerator * otherFraction.denominator +
            otherFraction.numerator * this.denominator, this.denominator * otherFraction.denominator);
    }
    subtract(other) {
        const otherFraction = new Fraction(other);
        return new Fraction(this.numerator * otherFraction.denominator -
            otherFraction.numerator * this.denominator, this.denominator * otherFraction.denominator);
    }
    lessThan(other) {
        const otherFraction = new Fraction(other);
        return (this.numerator * otherFraction.denominator <
            otherFraction.numerator * this.denominator);
    }
    equalTo(other) {
        const otherFraction = new Fraction(other);
        return (this.numerator * otherFraction.denominator ===
            otherFraction.numerator * this.denominator);
    }
    greaterThan(other) {
        const otherFraction = new Fraction(other);
        return (this.numerator * otherFraction.denominator >
            otherFraction.numerator * this.denominator);
    }
    multiply(other) {
        const otherFraction = new Fraction(other);
        return new Fraction(this.numerator * otherFraction.numerator, this.denominator * otherFraction.denominator);
    }
    divide(other) {
        const otherFraction = new Fraction(other);
        if (otherFraction.numerator === 0n) {
            throw new Error("Cannot divide by zero.");
        }
        return new Fraction(this.numerator * otherFraction.denominator, this.denominator * otherFraction.numerator);
    }
    toSignificant(significantDigits, format = {}, rounding = Rounding.ROUND_HALF_UP) {
        invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
        invariant(significantDigits > 0, `${significantDigits} is not positive.`);
        Decimal.set({
            precision: significantDigits + 1,
            rounding: toSignificantRounding[rounding],
        });
        const quotient = new Decimal(this.numerator.toString())
            .div(this.denominator.toString())
            .toSignificantDigits(significantDigits);
        const decimalPlaces = quotient.decimalPlaces();
        let [integerPart, fractionalPart] = quotient
            .toFixed(decimalPlaces)
            .split(".");
        // Apply group separator to integer part
        if (format.groupSeparator) {
            integerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, format.groupSeparator);
        }
        // Combine integer and fractional parts
        return fractionalPart
            ? `${integerPart}.${fractionalPart}`
            : `${integerPart}`;
    }
    toFixed(decimalPlaces, format = {}, rounding = Rounding.ROUND_HALF_UP) {
        invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
        invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
        Big.DP = decimalPlaces;
        Big.RM = toFixedRounding[rounding];
        const result = new Big(this.numerator.toString())
            .div(this.denominator.toString())
            .toFixed(decimalPlaces);
        // If no group separator, return the result as is
        if (!format.groupSeparator) {
            return result;
        }
        // Split the result into integer and decimal parts
        const [integerPart, decimalPart] = result.split(".");
        // Format the integer part with the group separator
        const formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, format.groupSeparator);
        return decimalPart
            ? `${formattedIntegerPart}.${decimalPart}`
            : `${formattedIntegerPart}`;
    }
    toJSON() {
        return {
            n: this.numerator.toString(),
            d: this.denominator.toString(),
        };
    }
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction() {
        return new Fraction(this.numerator, this.denominator);
    }
}
export default Fraction;
//# sourceMappingURL=Fraction.js.map