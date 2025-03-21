import { Native } from "../Native";
import type { Currency } from "../Type";

export const unwrapToken = (currency: Currency) => {
  return currency.wrapped.address ===
    Native.onChain(currency.chainId).wrapped.address
    ? Native.onChain(currency.chainId)
    : currency;
};
