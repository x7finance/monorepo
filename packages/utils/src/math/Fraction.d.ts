import Rounding from "./Rounding";
declare class Fraction {
    readonly numerator: bigint;
    readonly denominator: bigint;
    constructor(numerator: bigint | number | string | Fraction, denominator?: bigint | number | string);
    private static parseFraction;
    private static parseValue;
    private static greatestCommonDivisor;
    get quotient(): bigint;
    get remainder(): Fraction;
    invert(): Fraction;
    add(other: Fraction | bigint | number | string): Fraction;
    subtract(other: Fraction | bigint | number | string): Fraction;
    lessThan(other: Fraction | bigint | number | string): boolean;
    equalTo(other: Fraction | bigint | number | string): boolean;
    greaterThan(other: Fraction | bigint | number | string): boolean;
    multiply(other: Fraction | bigint | number | string): Fraction;
    divide(other: Fraction | bigint | number | string): Fraction;
    toSignificant(significantDigits: number, format?: {
        groupSeparator?: string;
    }, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: {
        groupSeparator?: string;
    }, rounding?: Rounding): string;
    toJSON(): {
        n: string;
        d: string;
    };
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction(): Fraction;
}
export default Fraction;
//# sourceMappingURL=Fraction.d.ts.map