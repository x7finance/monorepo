import { create } from "zustand"

import type { Currency } from "@x7/utils"

import type { LoanTokenActions, LoanTokenState } from "./types"

interface LoanTokenStore extends LoanTokenState, LoanTokenActions {
  _onTokenChange: (() => void) | null
  _setOnTokenChange: (callback: (() => void) | null) => void
}

export const useLoanTokenStore = create<LoanTokenStore>((set, get) => ({
  loanToken: undefined,
  collateralToken: undefined,
  loanAmount: "0.5",
  collateralAmount: "0.0",

  _onTokenChange: null,
  _setOnTokenChange: (callback) => set({ _onTokenChange: callback }),

  setLoanToken: (token: Currency) => {
    set({ loanToken: token })
    const callback = get()._onTokenChange
    if (callback) callback()
  },

  setCollateralToken: (token: Currency) => {
    set({ collateralToken: token, collateralAmount: "0" })
    const callback = get()._onTokenChange
    if (callback) callback()
  },

  setLoanAmount: (amount: string) => {
    set({ loanAmount: amount })
    const callback = get()._onTokenChange
    if (callback) callback()
  },

  setCollateralAmount: (amount: string) => {
    set({ collateralAmount: amount })
    const callback = get()._onTokenChange
    if (callback) callback()
  },
}))
