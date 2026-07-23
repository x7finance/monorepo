/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { memo, Suspense, useMemo } from "react"

import { Toaster } from "@x7/ui/sonner"
import { SplashController } from "@x7/ui/splash"
import { TooltipProvider } from "@x7/ui/tooltip"
import { TransactionStoreProvider } from "~/lib/providers/tx"
import {
  createMutationCacheConfig,
  createQueryCacheConfig,
  DEFAULT_QUERY_OPTIONS,
} from "~/lib/query"

import { AlphaRouterProvider } from "./router"

const Web3Provider = dynamic(
  () => import("~/lib/providers/web3").then((mod) => mod.Web3Provider),
  { ssr: false }
)

interface ProvidersProps {
  children: React.ReactNode
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any
}

const MemoizedTooltipProvider = memo(TooltipProvider)
const MemoizedSplashController = memo(SplashController)

export function AppProviders(props: ProvidersProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache(createQueryCacheConfig()),
        mutationCache: new MutationCache(createMutationCacheConfig()),
        defaultOptions: DEFAULT_QUERY_OPTIONS,
      }),
    []
  )

  const toastOptions = useMemo(
    () => ({
      style: {
        bottom: 30,
      },
    }),
    []
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <Web3Provider initialState={props.initialState}>
          <div className="xl:max-w-none">
            <div className="relative z-0">
              <TransactionStoreProvider>
                <AlphaRouterProvider>
                  <MemoizedTooltipProvider>
                    <MemoizedSplashController>
                      {props.children}
                      <div id="dialog-root" />
                    </MemoizedSplashController>
                  </MemoizedTooltipProvider>
                </AlphaRouterProvider>
              </TransactionStoreProvider>
            </div>
          </div>

          <Toaster richColors closeButton toastOptions={toastOptions} />
        </Web3Provider>
      </Suspense>
    </QueryClientProvider>
  )
}
