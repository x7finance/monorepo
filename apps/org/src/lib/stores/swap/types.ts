import type {
  BestSwapRoute,
  RouteWithValidQuote,
  SwapRoute,
} from "@x7/smart-order-router"
import type { Implementation, Percent, Token } from "@x7/utils"
import type { ChainId, CurrencyAmount, Native } from "@x7/utils"
import type { Address } from "viem"
import type { TokenApprovals } from "~/app/(xchange)/_components/loans/types"

export interface SwapTokenState {
  token0: Token | Native | undefined
  token1: Token | Native | undefined
  token0Address: Address
  token1Address: Address
  recipient: Address
  chainId: ChainId
}

export interface SwapTokenActions {
  setToken0: (token0: Token | Native | string) => void
  setToken1: (token1: Token | Native | string) => void
  setTokens: (
    token0: Token | Native | string,
    token1: Token | Native | string
  ) => void
  switchTokens: () => void
  setRecipient: (recipient: Address) => void
  setChainId: (chainId: ChainId) => void
}

export interface SwapAmountState {
  swapAmountString: string
  swapAmount: CurrencyAmount<Token | Native> | undefined
  slippage: Percent
}

export interface SwapAmountActions {
  setSwapAmount: (swapAmount: string) => void
  setSlippage: (slippage: Percent) => void
  setSwapAmountParsed: (
    swapAmount: CurrencyAmount<Token | Native> | undefined
  ) => void
}

export interface SwapQuoteState {
  route: SwapRoute | undefined
  possibleRoutes: RouteWithValidQuote[]
  bestRoute: BestSwapRoute | undefined
  secondaryRoute: BestSwapRoute | undefined
  enabledImplementations: Implementation[]
  isQuoteLoading: boolean
  swapError: { message: string } | undefined
}

export interface SwapQuoteActions {
  setRoute: (route: SwapRoute | undefined) => void
  addPossibleRoutes: (routes: RouteWithValidQuote[]) => void
  setPossibleRoutes: (routes: RouteWithValidQuote[]) => void
  setBestRoute: (route: BestSwapRoute | undefined) => void
  setSecondaryRoute: (route: BestSwapRoute | undefined) => void
  setEnabledImplementations: (implementations: Implementation[]) => void
  clearPossibleRoutes: () => void
  setIsQuoteLoading: (isLoading: boolean) => void
  setSwapError: (error: { message: string } | undefined) => void
}

export interface SwapApprovalState {
  token0Approval: TokenApprovals | undefined
  token0Loading: boolean
  token1Loading: boolean
}

export interface SwapApprovalActions {
  setToken0Approval: (approval: TokenApprovals | undefined) => void
  setToken0Loading: (loading: boolean) => void
  setToken1Loading: (loading: boolean) => void
}

export interface SwapState {
  state: {
    token0: Token | Native | undefined
    token1: Token | Native | undefined
    token0Address: Address
    token1Address: Address
    recipient: Address | undefined
    swapAmountString: string
    swapAmount: CurrencyAmount<Token | Native> | undefined
    route: SwapRoute | undefined
    slippage: Percent
    swapError: { message: string } | undefined
    token0Approval: TokenApprovals
    possibleRoutes: RouteWithValidQuote[]
    bestRoute: BestSwapRoute | undefined
    secondaryRoute: BestSwapRoute | undefined
    enabledImplementations: Implementation[]
    chainId: ChainId
  }
  mutate: {
    setToken0: (token0: Token | Native | string) => void
    setToken1: (token1: Token | Native | string) => void
    setTokens: (
      token0: Token | Native | string,
      token1: Token | Native | string
    ) => void
    setSwapAmount: (swapAmount: string) => void
    switchTokens: () => void
    addPossibleRoutes: (routes: RouteWithValidQuote[]) => void
    setBestRoute: (route: BestSwapRoute | undefined) => void
    setSecondaryRoute: (route: BestSwapRoute | undefined) => void
    clearPossibleRoutes: () => void
    tryAlternativeRoute: (
      route: RouteWithValidQuote
    ) => Promise<SwapRoute | null>
  }
  loaders: {
    token0Loading: boolean
    token1Loading: boolean
    isQuoteLoading: boolean
  }
}
