import { Token } from "../Token";
export function addressMapToTokenMap({ decimals, symbol, name, }, map) {
    return Object.fromEntries(Object.entries(map).map(([chainId, address]) => [
        chainId,
        new Token({
            chainId: Number(chainId),
            address,
            decimals: Number(decimals),
            symbol,
            name,
        }),
    ]));
}
//# sourceMappingURL=address-map-to-token-map.js.map