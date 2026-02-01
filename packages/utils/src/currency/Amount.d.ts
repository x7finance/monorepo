import Fraction from "../math/Fraction";
import Rounding from "../math/Rounding";
import { Share } from "./Share";
import { Token } from "./Token";
import type { Currency } from "./Type";
import type { SerializedAmount } from "./zod";
export declare class Amount<T extends Currency> extends Fraction {
    readonly currency: T;
    readonly scale: bigint;
    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    static fromRawAmount<T extends Currency>(currency: T, rawAmount: bigint | number): Amount<T>;
    static fromShare<T extends Currency>(currency: T, shares: bigint | number, rebase: {
        base: bigint;
        elastic: bigint;
    }, roundUp?: boolean): Amount<T>;
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
    static fromFractionalAmount<T extends Currency>(currency: T, numerator: bigint, denominator: bigint): Amount<T>;
    protected constructor(currency: T, numerator: bigint | number, denominator?: bigint);
    add(other: Amount<T>): Amount<T>;
    subtract(other: Amount<T>): Amount<T>;
    multiply(other: Fraction | bigint): Amount<T>;
    divide(other: Fraction | bigint): Amount<T>;
    toSignificant(significantDigits?: number, format?: any, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toHex(): string;
    toExact(groupSeparator?: string): string;
    get wrapped(): Amount<Token>;
    serialize(): SerializedAmount;
    static deserialize<T extends Currency>(amount: SerializedAmount): Amount<T>;
}
//# sourceMappingURL=Amount.d.ts.map