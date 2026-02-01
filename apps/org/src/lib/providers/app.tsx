/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { memo, Suspense, useEffect, useMemo, useState } from "react";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  QueryClientProvider as _QueryClientProvider,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "@x7/ui/sonner";
import { SplashController } from "@x7/ui/splash";
import { TooltipProvider } from "@x7/ui/tooltip";

import { TransactionStoreProvider } from "~/lib/providers/tx";
import { Web3Provider } from "~/lib/providers/web3";
import {
  createMutationCacheConfig,
  createQueryCacheConfig,
  DEFAULT_QUERY_OPTIONS,
} from "~/lib/query";
import { AlphaRouterProvider } from "./router";

interface ProvidersProps {
  children: React.ReactNode;
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
}

const appInfo = {
  appName: "Xchange",
};

const MemoizedTooltipProvider = memo(TooltipProvider);
const MemoizedSplashController = memo(SplashController);

export function AppProviders(props: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache(createQueryCacheConfig()),
        mutationCache: new MutationCache(createMutationCacheConfig()),
        defaultOptions: DEFAULT_QUERY_OPTIONS,
      }),
    [],
  );

  // Memoize the initial state to prevent unnecessary re-renders
  const initialStateMemo = useMemo(
    () => props.initialState,
    [props.initialState],
  );

  const theme = useMemo(
    () =>
      darkTheme({
        ...darkTheme.accentColors.purple,
        accentColor: "#17803d",
        borderRadius: "medium",
        fontStack: "system",
      }),
    [],
  );

  const toastOptions = useMemo(
    () => ({
      style: {
        bottom: 30,
      },
    }),
    [],
  );

  return (
    <Suspense>
      <Web3Provider initialState={initialStateMemo}>
        <div className="xl:max-w-none">
          <div className="relative z-0">
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={theme}
                modalSize="compact"
                appInfo={appInfo}
              >
                <TransactionStoreProvider>
                  <AlphaRouterProvider>
                    <MemoizedTooltipProvider>
                      <MemoizedSplashController>
                        {mounted && props.children}
                        <div id="dialog-root" />
                      </MemoizedSplashController>
                    </MemoizedTooltipProvider>
                  </AlphaRouterProvider>
                </TransactionStoreProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </div>
        </div>

        <Toaster richColors closeButton toastOptions={toastOptions} />
      </Web3Provider>
    </Suspense>
  );
}
