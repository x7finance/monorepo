import Fraction from "./Fraction";
import type Rounding from "./Rounding";
declare class Percent extends Fraction {
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    readonly isPercent: true;
    add(other: Fraction | bigint | number): Percent;
    subtract(other: Fraction | bigint): Percent;
    multiply(other: Fraction | bigint | number): Percent;
    divide(other: Fraction | bigint): Percent;
    toSignificant(significantDigits?: number, format?: any, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}
export default Percent;
//# sourceMappingURL=Percent.d.ts.map