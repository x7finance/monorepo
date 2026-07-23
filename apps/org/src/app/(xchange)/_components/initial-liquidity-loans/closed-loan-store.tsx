import { create } from "zustand"

interface ClosedLoanStore {
  closedLoans: number
  initialLoanLoaded: boolean
  loansLoaded: () => void
  increaseLoanCount: () => void
}

export const useClosedLoanStore = create<ClosedLoanStore>((set) => ({
  closedLoans: 0,
  initialLoanLoaded: false,
  loansLoaded: () => set(() => ({ initialLoanLoaded: true })),
  increaseLoanCount: () =>
    set((state) => ({ closedLoans: state.closedLoans + 1 })),
}))
