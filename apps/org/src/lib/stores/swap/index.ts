/**
 * Swap State Store (Zustand)
 *
 * This replaces the old Context-based SwapStateProvider.
 * The `useSwapState()` hook provides backward compatibility.
 *
 * ROLLBACK: If you need to revert to the old Context provider,
 * see: ~/lib/providers/deprecated/README.md
 */
"use client"

import { watchAccount } from "@wagmi/core"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef } from "react"
import type { Address } from "viem"
import { isAddress, parseUnits } from "viem"
import { useAccount, useChainId, useConfig } from "wagmi"

import { X7ContractsEnum } from "@x7/sdk"
import type { RouteWithValidQuote, SwapRoute } from "@x7/smart-order-router"
import { SwapType } from "@x7/smart-order-router"
import {
  useRecipientAddress,
  useRecipientAddressState,
  useSlippageTolerance,
} from "@x7/ui"
import type { Token } from "@x7/utils"
import {
  ChainId,
  CurrencyAmount,
  LogCodes,
  Native,
  pDebounce,
  Percent,
  TradeType,
  tryParseAmount,
} from "@x7/utils"
import { generateRoute } from "~/app/(xchange)/_actions/generate-route"
import type { TokenApprovals } from "~/app/(xchange)/_components/loans/types"
import { useTokenApproval } from "~/lib/hooks/approvals/useTokenApproval"
import { useTokenWithCache } from "~/lib/hooks/tokens/useTokenWithCache"
import { useAlphaRouter } from "~/lib/providers/router"
import { useWeb3Config } from "~/lib/providers/web3"
import { log } from "~/lib/utils/log"

import { useSwapAmountStore } from "./amount"
import { useSwapQuoteStore } from "./quote"
import { getTokenAsString, useSwapTokenStore } from "./tokens"
import type { SwapState } from "./types"

export { useSwapAmountStore } from "./amount"
export { useSwapQuoteStore } from "./quote"
export { getTokenAsString, useSwapTokenStore } from "./tokens"
export type * from "./types"

const getQuoteCurrency = (chainId: ChainId) => X7ContractsEnum.X7R(chainId)

export function useSwapState(): SwapState {
  const initialChainId = useChainId() as ChainId
  const { address } = useAccount()
  const { wagmiConfig } = useWeb3Config()
  const config = useConfig()

  const {
    state: { router, enabledImplementations: routerEnabledImplementations },
    mutate: {
      addPossibleRoutes: routerAddPossibleRoutes,
      clearPossibleRoutes: routerClearPossibleRoutes,
      setBestRoute: routerSetBestRoute,
      setPossibleRoutes: routerSetPossibleRoutes,
      setSecondaryRoute: routerSetSecondaryRoute,
    },
  } = useAlphaRouter()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { push } = useRouter()

  const [slippageTolerance] = useSlippageTolerance("swapSlippage")
  const [recipientAddressState] = useRecipientAddressState()
  const [recipientAddress] = useRecipientAddress()

  const recipient =
    recipientAddressState && isAddress(recipientAddress)
      ? recipientAddress
      : address

  // Get state from stores - use selectors for stable references to avoid infinite loops
  const setRoute = useSwapQuoteStore((s) => s.setRoute)
  const setIsQuoteLoading = useSwapQuoteStore((s) => s.setIsQuoteLoading)
  const setSwapError = useSwapQuoteStore((s) => s.setSwapError)
  const setEnabledImplementations = useSwapQuoteStore(
    (s) => s.setEnabledImplementations
  )
  const route = useSwapQuoteStore((s) => s.route)
  const possibleRoutes = useSwapQuoteStore((s) => s.possibleRoutes)
  const bestRoute = useSwapQuoteStore((s) => s.bestRoute)
  const secondaryRoute = useSwapQuoteStore((s) => s.secondaryRoute)
  const enabledImplementations = useSwapQuoteStore(
    (s) => s.enabledImplementations
  )
  const isQuoteLoading = useSwapQuoteStore((s) => s.isQuoteLoading)
  const swapError = useSwapQuoteStore((s) => s.swapError)

  // Sync enabledImplementations from router provider
  useEffect(() => {
    setEnabledImplementations(routerEnabledImplementations)
  }, [routerEnabledImplementations, setEnabledImplementations])

  // Get the searchParams and complete with defaults
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

  // Create query string helper
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

  // Watch for chain changes
  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange: ({ chain }) => {
        if (!chain || chain.id === chainId) return
        push(pathname, { scroll: false })
      },
    })
    return () => unwatch()
  }, [config, chainId, pathname, push])

  // Load tokens from URL params
  const token0Param = defaultedParams.get("token0")
  const token1Param = defaultedParams.get("token1")

  const { data: token0FromCache, isLoading: token0Loading } = useTokenWithCache(
    {
      chainId: chainId,
      address: token0Param,
      enabled: token0Param ? isAddress(token0Param) : false,
      keepPreviousData: true,
    }
  )

  const { data: token1FromCache, isLoading: token1Loading } = useTokenWithCache(
    {
      chainId: chainId,
      address: token1Param,
      enabled: token1Param ? isAddress(token1Param) : false,
      keepPreviousData: true,
    }
  )

  const swapAmountString = defaultedParams.get("swapAmount") ?? ""

  const _token0 =
    defaultedParams.get("token0") === "NATIVE"
      ? Native.onChain(chainId)
      : token0FromCache
  const _token1 =
    defaultedParams.get("token1") === "NATIVE"
      ? Native.onChain(chainId)
      : token1FromCache

  const intendedRouterAddress: `0x${string}` =
    route?.methodParameters?.to ?? `0x`

  const [token0ApprovalStatus] = useTokenApproval({
    amount: swapAmountString
      ? CurrencyAmount.fromRawAmount(
          _token0 ?? Native.onChain(chainId),
          parseUnits(swapAmountString, _token0?.decimals ?? 18)
        )
      : undefined,
    spender: intendedRouterAddress,
    enabled:
      !!_token0 &&
      !!swapAmountString &&
      parseFloat(swapAmountString) > 0 &&
      intendedRouterAddress !== "0x",
  })

  const token0Approval: TokenApprovals = {
    approval: token0ApprovalStatus,
    token: _token0 ?? Native.onChain(chainId),
    address: intendedRouterAddress,
    amount: swapAmountString
      ? parseUnits(swapAmountString, _token0?.decimals ?? 18)
      : 0n,
  }

  const slippage =
    parseFloat(slippageTolerance) > 0
      ? new Percent(parseFloat(slippageTolerance) * 100, 10_000)
      : new Percent(50, 10_000)

  // URL sync actions
  const switchTokens = useCallback(() => {
    routerSetPossibleRoutes([])
    routerSetBestRoute(undefined)
    routerSetSecondaryRoute(undefined)
    setRoute(undefined)

    push(
      `${pathname}?${createQueryString([
        { name: "chainId", value: defaultedParams.get("chainId") },
        { name: "swapAmount", value: route?.quote?.toFixed(6) ?? null },
        { name: "token0", value: defaultedParams.get("token1") },
        { name: "token1", value: defaultedParams.get("token0") },
      ])}`,
      { scroll: false }
    )
  }, [
    createQueryString,
    route,
    defaultedParams,
    pathname,
    push,
    routerSetPossibleRoutes,
    routerSetBestRoute,
    routerSetSecondaryRoute,
    setRoute,
  ])

  const setToken0 = useCallback(
    (_token0: string | Token | Native) => {
      const token0 = getTokenAsString(_token0)
      routerSetPossibleRoutes([])
      routerSetBestRoute(undefined)
      routerSetSecondaryRoute(undefined)
      setRoute(undefined)

      if (
        defaultedParams.get("token1")?.toLowerCase() === token0.toLowerCase()
      ) {
        switchTokens()
      } else {
        push(
          `${pathname}?${createQueryString([{ name: "token0", value: token0 }])}`,
          { scroll: false }
        )
      }
    },
    [
      createQueryString,
      defaultedParams,
      pathname,
      push,
      switchTokens,
      routerSetPossibleRoutes,
      routerSetBestRoute,
      routerSetSecondaryRoute,
      setRoute,
    ]
  )

  const setToken1 = useCallback(
    (_token1: string | Token | Native) => {
      const token1 = getTokenAsString(_token1)
      routerSetPossibleRoutes([])
      routerSetBestRoute(undefined)
      routerSetSecondaryRoute(undefined)
      setRoute(undefined)

      if (
        defaultedParams.get("token0")?.toLowerCase() === token1.toLowerCase()
      ) {
        switchTokens()
      } else {
        push(
          `${pathname}?${createQueryString([{ name: "token1", value: token1 }])}`,
          { scroll: false }
        )
      }
    },
    [
      createQueryString,
      defaultedParams,
      pathname,
      push,
      switchTokens,
      routerSetPossibleRoutes,
      routerSetBestRoute,
      routerSetSecondaryRoute,
      setRoute,
    ]
  )

  const setTokens = useCallback(
    (_token0: string | Token | Native, _token1: string | Token | Native) => {
      const token0 = getTokenAsString(_token0)
      const token1 = getTokenAsString(_token1)
      routerSetPossibleRoutes([])
      routerSetBestRoute(undefined)
      routerSetSecondaryRoute(undefined)
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
    [
      createQueryString,
      pathname,
      push,
      defaultedParams,
      routerSetPossibleRoutes,
      routerSetBestRoute,
      routerSetSecondaryRoute,
      setRoute,
    ]
  )

  const setSwapAmount = useCallback(
    (value: string) => {
      push(
        `${pathname}?${createQueryString([{ name: "swapAmount", value: value }])}`,
        { scroll: false }
      )
    },
    [createQueryString, pathname, push]
  )

  const tryAlternativeRoute = useCallback(
    async (routeToUse: RouteWithValidQuote): Promise<SwapRoute | null> => {
      if (!router) {
        throw new Error("No AlphaRouter instance setup")
      }
      const parsedAmount = tryParseAmount(swapAmountString, _token0)
      if (!parsedAmount) {
        throw new Error("Could not parse swap amount")
      }
      const effectiveRecipient = recipient ?? address
      if (!effectiveRecipient) {
        throw new Error("No recipient address available")
      }
      const newRoute = await router.routeFromValidQuote(
        parsedAmount,
        routeToUse,
        TradeType.EXACT_INPUT,
        {
          recipient: effectiveRecipient,
          slippageTolerance: slippage,
          deadline: Math.floor(+new Date() / 1000 + 60 * 20),
          type: SwapType.SWAP_ROUTER_02,
          simulate: {
            fromAddress: effectiveRecipient,
          },
        }
      )
      if (newRoute) {
        setRoute(newRoute)
      }

      return newRoute
    },
    [router, swapAmountString, _token0, recipient, address, slippage, setRoute]
  )

  // Debounced route generation
  const throttleRouteGenRef = useRef(
    pDebounce(async (param: SwapState) => {
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
            setSwapError({
              message: `No quotes found, Routers used: ${enabledImplementations.join(",").toLowerCase()}`,
            })
          }
        })
        .catch((error: Error) => {
          log.error(LogCodes.FAIL, "Promise executed with error", `${error}`)
          routerSetPossibleRoutes([])
          setRoute(undefined)
          routerSetBestRoute(undefined)
          routerSetSecondaryRoute(undefined)
          setIsQuoteLoading(false)
          setSwapError({ message: error.message })
        })
    }, 250)
  )

  const builtState: SwapState = useMemo(
    () => ({
      state: {
        token0: _token0,
        token1: _token1,
        swapAmountString,
        swapAmount: tryParseAmount(swapAmountString, _token0),
        route,
        recipient,
        slippage,
        swapError,
        token0Approval,
        possibleRoutes,
        bestRoute,
        secondaryRoute,
        enabledImplementations,
        chainId,
        token0Address: (defaultedParams.get("token0") ?? "0x") as Address,
        token1Address: (defaultedParams.get("token1") ?? "0x") as Address,
      },
      mutate: {
        switchTokens,
        setToken0,
        setToken1,
        setTokens,
        setSwapAmount,
        addPossibleRoutes: routerAddPossibleRoutes,
        setBestRoute: routerSetBestRoute,
        setSecondaryRoute: routerSetSecondaryRoute,
        clearPossibleRoutes: routerClearPossibleRoutes,
        tryAlternativeRoute,
      },
      loaders: {
        token0Loading,
        token1Loading,
        isQuoteLoading,
      },
    }),
    [
      _token0,
      _token1,
      swapAmountString,
      route,
      recipient,
      slippage,
      swapError,
      token0Approval,
      possibleRoutes,
      bestRoute,
      secondaryRoute,
      enabledImplementations,
      chainId,
      defaultedParams,
      switchTokens,
      setToken0,
      setToken1,
      setTokens,
      setSwapAmount,
      routerAddPossibleRoutes,
      routerSetBestRoute,
      routerSetSecondaryRoute,
      routerClearPossibleRoutes,
      tryAlternativeRoute,
      token0Loading,
      token1Loading,
      isQuoteLoading,
    ]
  )

  // Route generation effect
  useEffect(() => {
    routerSetPossibleRoutes([])
    routerSetBestRoute(undefined)
    routerSetSecondaryRoute(undefined)
    setRoute(undefined)
    setSwapError(undefined)

    if (_token0 && _token1 && parseFloat(`${swapAmountString}`) > 0) {
      setIsQuoteLoading(true)
      void throttleRouteGenRef.current(builtState)
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, router, address, _token0, _token1, swapAmountString])

  return builtState
}
