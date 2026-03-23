/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable react/jsx-no-constructed-context-values */

/* oxlint-disable react-hooks/exhaustive-deps */

"use client"

import { watchAccount } from "@wagmi/core"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { FC } from "react"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { Address } from "viem"
import { isAddress, parseUnits } from "viem"
import { useAccount, useChainId, useConfig } from "wagmi"

import { X7ContractsEnum } from "@x7/sdk"
import type {
  BestSwapRoute,
  RouteWithValidQuote,
  SwapRoute,
} from "@x7/smart-order-router"
import { SwapType } from "@x7/smart-order-router"
import {
  useRecipientAddress,
  useRecipientAddressState,
  useSlippageTolerance,
} from "@x7/ui"
import type { Currency, Implementation, Token } from "@x7/utils"
import {
  ChainId,
  CurrencyAmount,
  LogCodes,
  Native,
  Percent,
  TradeType,
  tryParseAmount,
} from "@x7/utils"
import { pDebounce } from "@x7/utils"
import { useTokenApproval } from "~/lib/hooks/approvals/useTokenApproval"
import { useTokenWithCache } from "~/lib/hooks/tokens/useTokenWithCache"
import { useWeb3Config } from "~/lib/providers/web3"
import type { SwapState as NewSwapState } from "~/lib/stores/swap/types"

import { generateRoute } from "../../../app/(xchange)/_actions/generate-route"
import type { TokenApprovals } from "../../../app/(xchange)/_components/loans/types"
import { log } from "../../utils/log"
import { useAlphaRouter } from "../router"

export interface SwapState {
  state: {
    token0: Token | Native | undefined
    token1: Token | Native | undefined
    token0Address: Address
    token1Address: Address
    recipient: Address
    swapAmountString: string
    swapAmount: CurrencyAmount<Token | Native>
    route: SwapRoute | undefined
    slippage: Percent
    swapError: {
      message: string
    }
    token0Approval: TokenApprovals
    possibleRoutes: RouteWithValidQuote[]
    bestRoute: BestSwapRoute | undefined
    secondaryRoute: BestSwapRoute | undefined
    enabledImplementations: Implementation[]
    chainId: ChainId
  }
  mutate: {
    setToken0(token0: Token | Native | string): void
    setToken1(token1: Token | Native | string): void
    setTokens(
      token0: Token | Native | string,
      token1: Token | Native | string
    ): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    addPossibleRoutes(routes: RouteWithValidQuote[]): void
    setBestRoute(route: BestSwapRoute): void
    setSecondaryRoute(route: BestSwapRoute): void
    clearPossibleRoutes(): void
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
const getQuoteCurrency = (chainId: ChainId) => X7ContractsEnum.X7R(chainId)

export const getTokenAsString = (token: Currency | string) =>
  typeof token === "string"
    ? token
    : token.isNative
      ? "NATIVE"
      : token.wrapped.address

const X7SwapStateContext = createContext<SwapState>({} as SwapState)

interface X7SwapProviderProps {
  children: React.ReactNode
}

export const X7SwapStateProvider: FC<X7SwapProviderProps> = ({ children }) => {
  const initialChainId = useChainId() as ChainId
  const { address } = useAccount()
  const { wagmiConfig } = useWeb3Config()
  const {
    state: {
      router,
      bestRoute,
      secondaryRoute,
      possibleRoutes,
      enabledImplementations,
    },
    mutate: {
      addPossibleRoutes,
      clearPossibleRoutes,
      setBestRoute,
      setPossibleRoutes,
      setSecondaryRoute,
    },
  } = useAlphaRouter()
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false)
  const [swapError, setSwapError] = useState<Error>()
  const [route, setRoute] = useState<SwapRoute>()

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { push } = useRouter()

  const [slippageTolerance] = useSlippageTolerance("swapSlippage")

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    if (!params.has("chainId")) {
      params.set("chainId", (initialChainId || ChainId.BASE).toString())
    }

    if (!params.has("token0")) {
      params.set("token0", "NATIVE")
    }

    if (!params.has("token1")) {
      params.set(
        "token1",
        getQuoteCurrency(Number(params.get("chainId")) as ChainId)
      )
    }
    return params
  }, [initialChainId, searchParams])

  const chainId = Number(defaultedParams.get("chainId")) as ChainId

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams)
      values.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [defaultedParams]
  )

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    push(
      `${pathname}?${createQueryString([
        { name: "chainId", value: defaultedParams.get("chainId") },
        { name: "swapAmount", value: route?.quote?.toFixed(6) ?? null },
        { name: "token0", value: defaultedParams.get("token1") },
        { name: "token1", value: defaultedParams.get("token0") },
      ])}`,
      { scroll: false }
    )
  }, [createQueryString, route, defaultedParams, pathname, push])

  const setToken0 = useCallback<(_token0: string | Currency) => void>(
    (_token0) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(_token0)
      setPossibleRoutes([])
      setBestRoute(undefined)
      setSecondaryRoute(undefined)
      setRoute(undefined)

      // Switch tokens if the new token0 is the same as the current token1
      if (
        defaultedParams.get("token1")?.toLowerCase() === token0.toLowerCase()
      ) {
        switchTokens()
      }

      // Push new route
      else {
        push(
          `${pathname}?${createQueryString([
            { name: "token0", value: token0 },
          ])}`,
          { scroll: false }
        )
      }
    },
    [createQueryString, defaultedParams, pathname, push, switchTokens]
  )

  // Update the URL with a new token1
  const setToken1 = useCallback<(_token1: string | Currency) => void>(
    (_token1) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(_token1)
      setPossibleRoutes([])
      setBestRoute(undefined)
      setSecondaryRoute(undefined)
      setRoute(undefined)

      // Switch tokens if the new token0 is the same as the current token1
      if (
        defaultedParams.get("token0")?.toLowerCase() === token1.toLowerCase()
      ) {
        switchTokens()
      }

      // Push new route
      else {
        push(
          `${pathname}?${createQueryString([
            { name: "token1", value: token1 },
          ])}`,
          { scroll: false }
        )
      }
    },
    [createQueryString, defaultedParams, pathname, push, switchTokens]
  )

  // Update the URL with both tokens
  const setTokens = useCallback<
    (_token0: string | Currency, _token1: string | Currency) => void
  >(
    (_token0, _token1) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(_token0)
      const token1 = getTokenAsString(_token1)
      setPossibleRoutes([])
      setBestRoute(undefined)
      setSecondaryRoute(undefined)
      setRoute(undefined)

      push(
        `${pathname}?${createQueryString([
          { name: "chainId", value: defaultedParams.get("chainId") },
          { name: "token0", value: token0 },
          { name: "token1", value: token1 },
        ])}`,
        { scroll: false }
      )
    },
    [createQueryString, pathname, push]
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback<(value: string) => void>(
    (value) => {
      push(
        `${pathname}?${createQueryString([
          { name: "swapAmount", value: value },
        ])}`,
        { scroll: false }
      )
    },
    [createQueryString, pathname, push]
  )

  const config = useConfig()

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange: ({ chain }) => {
        if (!chain || chain.id === chainId) return
        push(pathname, { scroll: false })
      },
    })
    return () => unwatch()
  }, [config, chainId, pathname, push])

  const { data: token0, isLoading: token0Loading } = useTokenWithCache({
    chainId: chainId,
    address: defaultedParams.get("token0"),
    enabled: isAddress(defaultedParams.get("token0")!),
    keepPreviousData: true,
  })

  const { data: token1, isLoading: token1Loading } = useTokenWithCache({
    chainId: chainId,
    address: defaultedParams.get("token1"),
    enabled: isAddress(defaultedParams.get("token1")!),
    keepPreviousData: true,
  })

  const intendedRouterAddress: `0x${string}` =
    route?.methodParameters?.to ?? `0x`

  const swapAmountString = defaultedParams.get("swapAmount") ?? ""

  const [token0ApprovalStatus] = useTokenApproval({
    amount: swapAmountString
      ? CurrencyAmount.fromRawAmount(
          token0 ?? Native.onChain(chainId),
          parseUnits(swapAmountString, token0?.decimals ?? 18)
        )
      : undefined,
    spender: intendedRouterAddress,
    enabled:
      !!token0 &&
      !!swapAmountString &&
      parseFloat(swapAmountString) > 0 &&
      intendedRouterAddress !== "0x",
  })

  const token0Approval: TokenApprovals = {
    approval: token0ApprovalStatus,
    token: token0 ?? Native.onChain(chainId),
    address: intendedRouterAddress,
    amount: swapAmountString
      ? parseUnits(swapAmountString, token0?.decimals ?? 18)
      : 0n,
  }

  const tryAlternativeRoute = async (routeToUse: RouteWithValidQuote) => {
    if (!router) {
      throw new Error("No AlphaRouter instance setup")
    }
    const newRoute = await router.routeFromValidQuote(
      tryParseAmount(swapAmountString, _token0)!,
      routeToUse,
      TradeType.EXACT_INPUT,
      {
        recipient: recipient ?? address!,
        slippageTolerance:
          parseFloat(slippageTolerance) > 0
            ? new Percent(parseFloat(slippageTolerance) * 100, 10_000)
            : new Percent(50, 10_000),
        deadline: Math.floor(+new Date() / 1000 + 60 * 20),
        type: SwapType.SWAP_ROUTER_02,
        simulate: {
          fromAddress: recipient ?? address!,
        },
      }
    )
    if (newRoute) {
      setRoute(newRoute)
    }

    return newRoute
  }

  // TODO: Monitor if this is ideal
  const throttleRouteGen = pDebounce(async (param: NewSwapState) => {
    if (!param.state.token0 || !param.state.token1 || !router) {
      return
    }

    router.abortCurrentRoute()
    await generateRoute(param, wagmiConfig, router)
      .then((_route) => {
        setIsQuoteLoading(false)

        if (_route) {
          setSwapError(undefined)
          setRoute(_route)
        } else {
          // @ts-expect-error: todo fix
          setSwapError({
            message: `No quotes found, Routers used: ${enabledImplementations.join(",").toLowerCase()}`,
          })
        }
      })
      .catch((error: Error) => {
        log.error(LogCodes.FAIL, "Promise executed with error", `${error}`)
        setPossibleRoutes([])
        setRoute(undefined)
        setBestRoute(undefined)
        setSecondaryRoute(undefined)
        setIsQuoteLoading(false)
        setSwapError(error)
      })
  }, 250)

  const [recipientAddressState] = useRecipientAddressState()
  const [recipientAddress] = useRecipientAddress()

  const recipient =
    recipientAddressState && isAddress(recipientAddress)
      ? recipientAddress
      : address

  const _token0 =
    defaultedParams.get("token0") === "NATIVE"
      ? Native.onChain(chainId)
      : token0
  const _token1 =
    defaultedParams.get("token1") === "NATIVE"
      ? Native.onChain(chainId)
      : token1

  const builtState: SwapState = {
    state: {
      token0: _token0,
      token1: _token1,
      swapAmountString,
      // @ts-expect-error: todo fix
      swapAmount: tryParseAmount(swapAmountString, _token0),
      route,
      recipient: recipient!,
      slippage:
        parseFloat(slippageTolerance) > 0
          ? new Percent(parseFloat(slippageTolerance) * 100, 10_000)
          : new Percent(50, 10_000),
      swapError: swapError!,
      token0Approval,
      possibleRoutes,
      bestRoute,
      secondaryRoute,
      enabledImplementations,
      chainId,
    },
    mutate: {
      switchTokens,
      setToken0,
      setToken1,
      setTokens,
      setSwapAmount,
      addPossibleRoutes,
      setBestRoute,
      setSecondaryRoute,
      clearPossibleRoutes,
      tryAlternativeRoute,
    },
    loaders: {
      token0Loading,
      token1Loading,
      isQuoteLoading,
    },
  }

  useEffect(() => {
    setPossibleRoutes([])
    setBestRoute(undefined)
    setSecondaryRoute(undefined)
    setRoute(undefined)
    setSwapError(undefined)

    if (_token0 && _token1 && parseFloat(`${swapAmountString}`) > 0) {
      setIsQuoteLoading(true)
      void throttleRouteGen(builtState as unknown as NewSwapState)
    }
  }, [chainId, router, address, _token0, _token1, swapAmountString])

  return (
    <X7SwapStateContext.Provider value={builtState}>
      {children}
    </X7SwapStateContext.Provider>
  )
}

export const useSwapState = () => {
  const context = useContext(X7SwapStateContext)
  if (!context) {
    throw new Error("Hook can only be used inside Swap State Context")
  }

  return context
}
