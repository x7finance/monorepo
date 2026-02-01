import { create } from "zustand";

import type { LoanTermData, LoanTermDataMap, LoanTermsActions, LoanTermsState } from "./types";

interface LoanTermsStore extends LoanTermsState, LoanTermsActions {}

export const useLoanTermsStore = create<LoanTermsStore>((set) => ({
  loanTerms: {},
  loanDuration: 7,
  selectedLoan: undefined,

  setLoanTerms: (terms: LoanTermDataMap) => set({ loanTerms: terms }),

  setLoanDuration: (duration: number) => set({ loanDuration: duration }),

  setLoan: (loan: LoanTermData | undefined) => set({ selectedLoan: loan }),
}));
