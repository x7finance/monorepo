import { Native } from "../Native";
export const unwrapToken = (currency) => {
    return currency.wrapped.address ===
        Native.onChain(currency.chainId).wrapped.address
        ? Native.onChain(currency.chainId)
        : currency;
};
//# sourceMappingURL=unwrap.js.map