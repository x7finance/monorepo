import type { Address } from "viem"
import { create } from "zustand"

import type { Currency, Native, Token } from "@x7/utils"
import { ChainId } from "@x7/utils"

import type { SwapTokenActions, SwapTokenState } from "./types"

export const getTokenAsString = (token: Currency | string): string =>
  typeof token === "string"
    ? token
    : token.isNative
      ? "NATIVE"
      : token.wrapped.address

interface SwapTokenStore extends SwapTokenState, SwapTokenActions {
  _urlSyncEnabled: boolean
  _setUrlSyncEnabled: (enabled: boolean) => void
  _onTokenChange: (() => void) | null
  _setOnTokenChange: (callback: (() => void) | null) => void
}

export const useSwapTokenStore = create<SwapTokenStore>((set, get) => ({
  token0: undefined,
  token1: undefined,
  token0Address: "0x" as Address,
  token1Address: "0x" as Address,
  recipient: "0x" as Address,
  chainId: ChainId.BASE,

  _urlSyncEnabled: false,
  _setUrlSyncEnabled: (enabled) => set({ _urlSyncEnabled: enabled }),
  _onTokenChange: null,
  _setOnTokenChange: (callback) => set({ _onTokenChange: callback }),

  setToken0: (token0) => {
    const token0String = getTokenAsString(token0)
    const token1 = get().token1
    const currentToken1String =
      token1 !== undefined ? getTokenAsString(token1) : ""

    if (currentToken1String.toLowerCase() === token0String.toLowerCase()) {
      get().switchTokens()
      return
    }

    set({
      token0:
        typeof token0 === "string" ? undefined : (token0 as Token | Native),
      token0Address: token0String as Address,
    })

    const callback = get()._onTokenChange
    if (callback) callback()
  },

  setToken1: (token1) => {
    const token1String = getTokenAsString(token1)
    const token0 = get().token0
    const currentToken0String =
      token0 !== undefined ? getTokenAsString(token0) : ""

    if (currentToken0String.toLowerCase() === token1String.toLowerCase()) {
      get().switchTokens()
      return
    }

    set({
      token1:
        typeof token1 === "string" ? undefined : (token1 as Token | Native),
      token1Address: token1String as Address,
    })

    const callback = get()._onTokenChange
    if (callback) callback()
  },

  setTokens: (token0, token1) => {
    const token0String = getTokenAsString(token0)
    const token1String = getTokenAsString(token1)

    set({
      token0:
        typeof token0 === "string" ? undefined : (token0 as Token | Native),
      token1:
        typeof token1 === "string" ? undefined : (token1 as Token | Native),
      token0Address: token0String as Address,
      token1Address: token1String as Address,
    })

    const callback = get()._onTokenChange
    if (callback) callback()
  },

  switchTokens: () => {
    const { token0, token1, token0Address, token1Address } = get()
    set({
      token0: token1,
      token1: token0,
      token0Address: token1Address,
      token1Address: token0Address,
    })

    const callback = get()._onTokenChange
    if (callback) callback()
  },

  setRecipient: (recipient) => set({ recipient }),
  setChainId: (chainId) => set({ chainId }),
}))
