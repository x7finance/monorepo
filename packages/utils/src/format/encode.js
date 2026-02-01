import { toHex } from "viem";
export function encodeFeeBips(fee) {
    return toHex(fee.multiply(10_000).quotient);
}
//# sourceMappingURL=encode.js.map