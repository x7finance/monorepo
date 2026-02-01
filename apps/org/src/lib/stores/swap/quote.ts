import type { SwapQuoteActions, SwapQuoteState } from "./types"
import type {
  BestSwapRoute,
  RouteWithValidQuote,
  SwapRoute,
} from "@x7/smart-order-router"
import type { Implementation } from "@x7/utils"

import { create } from "zustand"

interface SwapQuoteStore extends SwapQuoteState, SwapQuoteActions {}

export const useSwapQuoteStore = create<SwapQuoteStore>((set) => ({
  route: undefined,
  possibleRoutes: [],
  bestRoute: undefined,
  secondaryRoute: undefined,
  enabledImplementations: [],
  isQuoteLoading: false,
  swapError: undefined,

  setRoute: (route: SwapRoute | undefined) => set({ route }),

  addPossibleRoutes: (routes: RouteWithValidQuote[]) =>
    set((state) => ({
      possibleRoutes: [...state.possibleRoutes, ...routes],
    })),

  setPossibleRoutes: (routes: RouteWithValidQuote[]) =>
    set({ possibleRoutes: routes }),

  setBestRoute: (route: BestSwapRoute | undefined) => set({ bestRoute: route }),

  setSecondaryRoute: (route: BestSwapRoute | undefined) =>
    set({ secondaryRoute: route }),

  setEnabledImplementations: (implementations: Implementation[]) =>
    set({ enabledImplementations: implementations }),

  clearPossibleRoutes: () =>
    set({
      possibleRoutes: [],
      bestRoute: undefined,
      secondaryRoute: undefined,
    }),

  setIsQuoteLoading: (isLoading: boolean) => set({ isQuoteLoading: isLoading }),

  setSwapError: (error: { message: string } | undefined) =>
    set({ swapError: error }),
}))
