import Fraction from "../Fraction";
import Rounding from "../Rounding";
import { Token } from "../../currency/Token";
import type { Currency } from "../../currency/Type";
import type { SerializedAmount } from "../../currency/zod";
export declare class Share<T extends Currency> extends Fraction {
    readonly currency: T;
    readonly scale: bigint;
    static fromRawShare<T extends Currency>(currency: T, rawShare?: bigint | number): Share<T>;
    protected constructor(currency: T, numerator: bigint | number, denominator?: bigint);
    toAmount(rebase: {
        base: bigint;
        elastic: bigint;
    }, roundUp?: boolean): CurrencyAmount<T>;
    /**
     * Construct a currency share with a denominator that is not equal to 1
     * @param currency the currency
     * @param numerator the numerator of the fractional token share
     * @param denominator the denominator of the fractional token share
     */
    static fromFractionalShare<T extends Currency>(currency: T, numerator: bigint, denominator: bigint): Share<T>;
    add(other: Share<T>): Share<T>;
    subtract(other: Share<T>): Share<T>;
    multiply(other: Fraction | bigint): Share<T>;
    divide(other: Fraction | bigint): Share<T>;
    toSignificant(significantDigits?: number, format?: any, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: {
        groupSeparator?: string;
    }): string;
}
export declare class CurrencyAmount<T extends Currency> extends Fraction {
    readonly currency: T;
    readonly scale: bigint;
    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    static fromRawAmount<T extends Currency>(currency: T, rawAmount: bigint | number): CurrencyAmount<T>;
    static fromShare<T extends Currency>(currency: T, shares: bigint, rebase: {
        base: bigint;
        elastic: bigint;
    }, roundUp?: boolean): CurrencyAmount<T>;
    toShare(rebase: {
        base: bigint;
        elastic: bigint;
    }, roundUp?: boolean): Share<T>;
    /**
     * Construct a currency amount with a denominator that is not equal to 1
     * @param currency the currency
     * @param numerator the numerator of the fractional token amount
     * @param denominator the denominator of the fractional token amount
     */
    static fromFractionalAmount<T extends Currency>(currency: T, numerator: bigint | number, denominator: bigint | number): CurrencyAmount<T>;
    protected constructor(currency: T, numerator: bigint | number, denominator?: bigint | number);
    add(other: CurrencyAmount<T>): CurrencyAmount<T>;
    subtract(other: CurrencyAmount<T>): CurrencyAmount<T>;
    multiply(other: Fraction | bigint): CurrencyAmount<T>;
    divide(other: Fraction | bigint | number): CurrencyAmount<T>;
    toSignificant(significantDigits?: number, format?: any, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toHex(): string;
    toExact(groupSeparator?: string): string;
    get wrapped(): CurrencyAmount<Token>;
    serialize(): SerializedAmount;
    static deserialize<T extends Currency>(amount: SerializedAmount): CurrencyAmount<T>;
}
//# sourceMappingURL=currencyAmount.d.ts.map