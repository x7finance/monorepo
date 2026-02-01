/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

/* oxlint-disable react-hooks/exhaustive-deps */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FC } from "react";
import { getPublicClient } from "@wagmi/core";
import { useAccount } from "wagmi";

import { AlphaRouter } from "@x7/smart-order-router";
import type {
  BestSwapRoute,
  RouteWithValidQuote,
} from "@x7/smart-order-router";
import { useEnabledImplentations } from "@x7/ui";
import type { ChainId, Implementation } from "@x7/utils";

import { useDebounce } from "@x7/ui";

import { useWeb3Config } from "~/lib/providers/web3";

export interface AlphaRouterState {
  state: {
    router: AlphaRouter | null;
    possibleRoutes: RouteWithValidQuote[];
    bestRoute: BestSwapRoute | undefined;
    secondaryRoute: BestSwapRoute | undefined;
    enabledImplementations: Implementation[];
    isChainIdSettled: boolean;
    debouncedChainId: number | undefined;
  };
  mutate: {
    addPossibleRoutes(routes?: RouteWithValidQuote[]): void;
    setBestRoute(route?: BestSwapRoute): void;
    setSecondaryRoute(route?: BestSwapRoute): void;
    setPossibleRoutes(routes?: RouteWithValidQuote[]): void;
    clearPossibleRoutes(): void;
  };
}

const AlphaRouterContext = createContext<AlphaRouterState>(
  {} as AlphaRouterState,
);

interface AlphaRouterProviderProps {
  children: React.ReactNode;
}

export const AlphaRouterProvider: FC<AlphaRouterProviderProps> = ({
  children,
}) => {
  const { wagmiConfig } = useWeb3Config();
  const publicClient = getPublicClient(wagmiConfig);
  const { chainId: realChain } = useAccount();
  const debouncedChainId = useDebounce(realChain, 500);
  const [isChainIdSettled, setIsChainIdSettled] = useState(false);
  const [possibleRoutes, setPossibleRoutes] = useState<RouteWithValidQuote[]>(
    [],
  );
  const [bestRoute, setBestRoute] = useState<BestSwapRoute>();
  const [secondaryRoute, setSecondaryRoute] = useState<BestSwapRoute>();

  const [_enabledImplementations] = useEnabledImplentations(
    "enabledImplementations",
  );
  const enabledImplementations = (
    _enabledImplementations ?? "UNISWAP,XCHANGE"
  ).split(",") as Implementation[];

  const addPossibleRoutes = (routes: RouteWithValidQuote[]) => {
    setPossibleRoutes(routes);
  };

  const clearPossibleRoutes = () => {
    setPossibleRoutes([]);
  };

  useEffect(() => {
    if (debouncedChainId) {
      setIsChainIdSettled(true);
    }
  }, [debouncedChainId]);

  const router: AlphaRouter | null = useMemo(() => {
    if (realChain) {
      const _router = new AlphaRouter({
        chainId: realChain as ChainId,
        // @ts-expect-error I know man
        provider: publicClient,
        addPossibleRoutes,
        setBestRoute,
        setSecondaryRoute,
        enabledImplementations,
      });
      return _router;
    }
    return null;
  }, [realChain, _enabledImplementations]);

  const builtState: AlphaRouterState = {
    state: {
      router,
      bestRoute,
      secondaryRoute,
      possibleRoutes,
      enabledImplementations,
      isChainIdSettled,
      debouncedChainId,
    },
    mutate: {
      addPossibleRoutes,
      setBestRoute,
      setSecondaryRoute: (route) => setSecondaryRoute(route),
      clearPossibleRoutes,
      setPossibleRoutes: (routes) => setPossibleRoutes(routes ?? []),
    },
  };

  return (
    <AlphaRouterContext.Provider value={builtState}>
      {children}
    </AlphaRouterContext.Provider>
  );
};

export const useAlphaRouter = () => {
  const context = useContext(AlphaRouterContext);
  if (!context) {
    throw new Error("Hook can only be used inside AlphaRouter Context");
  }

  return context;
};
