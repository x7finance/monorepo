import Fraction from "../math/Fraction";
const ONE = new Fraction(1, 1);
export function slippageAmount(value, slippage) {
    if (slippage.lessThan(0) || slippage.greaterThan(ONE))
        throw new Error("Unexpected slippage");
    return [
        value.multiply(ONE.subtract(slippage)).quotient,
        value.multiply(ONE.add(slippage)).quotient,
    ];
}
//# sourceMappingURL=slippageAmount.js.map