import { create } from "zustand"

import type { CurrencyAmount, Native, Token } from "@x7/utils"
import { Percent } from "@x7/utils"

import type { SwapAmountActions, SwapAmountState } from "./types"

interface SwapAmountStore extends SwapAmountState, SwapAmountActions {
  _onAmountChange: (() => void) | null
  _setOnAmountChange: (callback: (() => void) | null) => void
}

const DEFAULT_SLIPPAGE = new Percent(50, 10_000)

export const useSwapAmountStore = create<SwapAmountStore>((set, get) => ({
  swapAmountString: "",
  swapAmount: undefined,
  slippage: DEFAULT_SLIPPAGE,

  _onAmountChange: null,
  _setOnAmountChange: (callback) => set({ _onAmountChange: callback }),

  setSwapAmount: (swapAmountString) => {
    set({ swapAmountString })

    const callback = get()._onAmountChange
    if (callback) callback()
  },

  setSlippage: (slippage) => set({ slippage }),

  setSwapAmountParsed: (
    swapAmount: CurrencyAmount<Token | Native> | undefined
  ) => set({ swapAmount }),
}))
