import invariant from "tiny-invariant";
import { natives } from "../chain";
import { Currency } from "./Currency";
import { WNATIVE } from "./wrapped";
import { nativeSchema } from "./zod";
export class Native extends Currency {
    id;
    isNative = true;
    isToken = false;
    symbol;
    name;
    constructor(native) {
        super(native);
        this.id = `${native.chainId}:NATIVE`;
        this.symbol = native.symbol;
        this.name = native.name;
    }
    get wrapped() {
        const wnative = WNATIVE[this.chainId];
        invariant(!!wnative, "WRAPPED");
        return wnative;
    }
    static cache = {};
    static onChain(chainId) {
        const cached = this.cache[chainId];
        if (typeof cached !== "undefined") {
            return cached;
        }
        const nativeCurrency = natives[chainId];
        invariant(!!nativeCurrency, "NATIVE_CURRENCY");
        const { decimals, name, symbol } = nativeCurrency;
        const native = new Native({
            chainId,
            decimals,
            name,
            symbol,
        });
        this.cache[chainId] = new Native({
            chainId,
            decimals,
            name,
            symbol,
        });
        return native;
    }
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    serialize() {
        return nativeSchema.parse({
            isNative: this.isNative,
            name: this.name,
            symbol: this.symbol,
            decimals: this.decimals,
            chainId: this.chainId,
        });
    }
    static deserialize(native) {
        return Native.onChain(native.chainId);
    }
}
//# sourceMappingURL=Native.js.map