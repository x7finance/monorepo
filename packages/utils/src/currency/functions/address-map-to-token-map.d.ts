import { Token } from "../Token";
export declare function addressMapToTokenMap({ decimals, symbol, name }: {
    decimals: number | string;
    symbol?: string | undefined;
    name?: string | undefined;
}, map: Record<number, `0x${string}`>): {
    [k: string]: Token;
};
//# sourceMappingURL=address-map-to-token-map.d.ts.map