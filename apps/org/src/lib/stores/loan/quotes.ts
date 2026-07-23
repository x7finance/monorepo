import { create } from "zustand"

import type {
  LoanQuotesActions,
  LoanQuotesState,
  QuoteResponse,
  RawQuoteResponse,
} from "./types"

interface LoanQuotesStore extends LoanQuotesState, LoanQuotesActions {}

export const useLoanQuotesStore = create<LoanQuotesStore>((set) => ({
  quotes: [],
  selectedQuote: undefined,
  errors: [],
  loadingQuotes: false,

  setQuotes: (quotes: RawQuoteResponse[]) => set({ quotes }),

  setSelectedQuote: (quote: QuoteResponse | undefined) =>
    set({ selectedQuote: quote }),

  setErrors: (errors: { message: string; success: boolean }[]) =>
    set({ errors }),

  setLoadingQuotes: (loading: boolean) => set({ loadingQuotes: loading }),

  clearErrors: () => set({ errors: [] }),
}))
