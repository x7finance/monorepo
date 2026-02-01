/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useEffect, useState } from "react";

import { cn } from "@x7/css";
import type { RouteWithValidQuote } from "@x7/smart-order-router";
import { Implementation, LogCodes, Protocol } from "@x7/utils";

import { useSwapState } from "~/lib/stores/swap";
import { log } from "~/lib/utils/log";
import { implementationComponents } from "./swap-dexs";
import { ImplementationGroupTabbed } from "./swap-implementations-tabbed";

export function SwapRoutes() {
  const {
    state: { possibleRoutes, enabledImplementations, bestRoute },
  } = useSwapState();

  const bestRouteImplementaton =
    bestRoute?.routes?.[0]?.protocol === Protocol.V3
      ? (bestRoute?.routes?.[0].route.pools?.[0]?.poolType ??
        Implementation.UNISWAP)
      : bestRoute?.routes?.[0]?.protocol === Protocol.V2
        ? (bestRoute?.routes?.[0]?.route?.pairs?.[0]?.pairType ??
          Implementation.UNISWAP)
        : Implementation.MIXED;

  const [otherImplementations, setOtherImplementations] =
    useState<Record<Implementation, RouteWithValidQuote[]>>();
  const [selectedImplementation, setSelectedImplementation] =
    useState<Implementation>();

  // useEffect / memo to group and filter the possibleRoutes into groups based on imp.
  useEffect(() => {
    const starterGroup: Record<Implementation, RouteWithValidQuote[]> = {
      [Implementation.UNISWAP]: [],
      [Implementation.PANCAKESWAP]: [],
      [Implementation.XCHANGE]: [],
      [Implementation.SUSHISWAP]: [],
      [Implementation.AERODROME]: [],
      [Implementation.MIXED]: [],
    };

    for (const route of possibleRoutes) {
      const currentRouteimplementation =
        route?.protocol === Protocol.V3
          ? (route?.route?.pools?.[0]?.poolType ?? Implementation.UNISWAP)
          : route?.protocol === Protocol.V2
            ? (route?.route?.pairs?.[0]?.pairType ?? Implementation.UNISWAP)
            : Implementation.MIXED;

      if (starterGroup[currentRouteimplementation]) {
        starterGroup[currentRouteimplementation].push(route);
      } else {
        starterGroup[currentRouteimplementation] = [route];
      }
    }

    setOtherImplementations(starterGroup);
  }, [possibleRoutes]);

  if (otherImplementations) {
    log.info(LogCodes.SUCCESS, "otherImplementations", otherImplementations);
  }

  return (
    <div className="my-1 flex w-full flex-col">
      <div className="relative">
        <div
          className="grid w-full divide-x divide-zinc-300 rounded-t-lg border border-b-0 border-zinc-300 dark:divide-zinc-700 dark:border-zinc-700"
          style={{
            gridTemplateColumns: `repeat(${enabledImplementations.length}, minmax(0, 1fr))`,
          }}
        >
          {enabledImplementations.map((enabled) => (
            <span
              key={`impopt-${enabled}`}
              onClick={() => setSelectedImplementation(enabled)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-center p-1 py-2 first:rounded-tl-lg last:rounded-tr-lg dark:hover:bg-emerald-500/10",
                enabled === selectedImplementation
                  ? "bg-emerald-500/15 dark:bg-emerald-500/15"
                  : "bg-white dark:bg-black/40",
                enabledImplementations.includes(enabled)
                  ? "opacity-100"
                  : "opacity-50",
              )}
            >
              {implementationComponents[enabled]}
            </span>
          ))}
        </div>
      </div>
      {otherImplementations?.[
        selectedImplementation ?? bestRouteImplementaton
      ] &&
      otherImplementations[selectedImplementation ?? bestRouteImplementaton]
        .length > 0 ? (
        <ImplementationGroupTabbed
          routes={
            otherImplementations[
              selectedImplementation ?? bestRouteImplementaton
            ]
          }
        />
      ) : (
        <div className="relative flex w-full flex-col rounded-b-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-black/40">
          <span className="text-center text-sm font-bold text-secondary-foreground">
            No routes found on this DEX
          </span>
        </div>
      )}
    </div>
  );
}
