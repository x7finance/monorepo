import type { Currency } from "../Type"

import { Native } from "../Native"

export const unwrapToken = (currency: Currency) => {
  return currency.wrapped.address ===
    Native.onChain(currency.chainId).wrapped.address
    ? Native.onChain(currency.chainId)
    : currency
}
