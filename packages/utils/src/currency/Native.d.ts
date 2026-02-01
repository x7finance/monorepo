import type { ChainId } from "../chain";
import { Currency } from "./Currency";
import type { Token } from "./Token";
import type { Currency as CurrencyType } from "./Type";
import type { SerializedNative } from "./zod";
export declare class Native extends Currency {
    readonly id: string;
    readonly isNative: true;
    readonly isToken: false;
    readonly symbol: string;
    readonly name: string;
    protected constructor(native: {
        chainId: ChainId;
        decimals: number;
        symbol: string;
        name: string;
    });
    get wrapped(): Token;
    private static cache;
    static onChain(chainId: ChainId): Native;
    equals(other: CurrencyType): boolean;
    serialize(): SerializedNative;
    static deserialize(native: SerializedNative): Native;
}
//# sourceMappingURL=Native.d.ts.map