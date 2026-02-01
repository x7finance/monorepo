/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useState } from "react";

import { cn } from "@x7/css";
import type { MixedRoute, Pool } from "@x7/sdk";
import type { RouteWithValidQuote } from "@x7/smart-order-router";
import { SkeletonBox } from "@x7/ui/skeleton";
import type { Currency } from "@x7/utils";
import { Implementation, Protocol } from "@x7/utils";

import { useSwapState } from "~/lib/stores/swap";
import { implementationComponents } from "./swap-dexs";
import { MixedImplementationDisplay } from "./swap-mixed-implementation";

export const ImplementationGroupTabbed = ({
  routes,
}: {
  routes: RouteWithValidQuote[];
}) => {
  const {
    state: { bestRoute, secondaryRoute },
    mutate: { tryAlternativeRoute },
  } = useSwapState();
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  const bestRouteImplementaton =
    bestRoute?.routes[0]?.protocol === Protocol.V3
      ? (bestRoute.routes[0].route.pools[0]?.poolType ?? Implementation.UNISWAP)
      : bestRoute?.routes[0]?.protocol === Protocol.V2
        ? (bestRoute.routes[0]?.route?.pairs?.[0]?.pairType ??
          Implementation.UNISWAP)
        : Implementation.MIXED;

  const secondaryRouteImplementation =
    secondaryRoute?.routes[0]?.protocol === Protocol.V3
      ? (secondaryRoute.routes[0].route.pools[0]?.poolType ??
        Implementation.UNISWAP)
      : secondaryRoute?.routes[0]?.protocol === Protocol.V2
        ? (secondaryRoute.routes[0]?.route?.pairs?.[0]?.pairType ??
          Implementation.UNISWAP)
        : Implementation.MIXED;

  const displayedRouteImplementation =
    routes[0]?.protocol === Protocol.V3
      ? (routes[0]?.route.pools[0]?.poolType ?? Implementation.UNISWAP)
      : routes[0]?.protocol === Protocol.V2
        ? (routes[0]?.route.pairs[0]?.pairType ?? Implementation.UNISWAP)
        : Implementation.MIXED;

  const routesWithoutBest = routes.filter((route) => {
    const currentRouteimplementation =
      route.protocol === Protocol.V3
        ? (route.route.pools[0]?.poolType ?? Implementation.UNISWAP)
        : route.protocol === Protocol.V2
          ? (route.route.pairs[0]?.pairType ?? Implementation.UNISWAP)
          : Implementation.MIXED;

    return (
      bestRoute?.routes[0]?.poolAddresses
        ?.join("-")
        .concat(bestRouteImplementaton) !==
      route.poolAddresses.join("-").concat(currentRouteimplementation)
    );
  });
  const routesToShow = showAllRoutes
    ? routesWithoutBest
    : routesWithoutBest.slice(0, 3);

  return (
    routes.length > 0 && (
      <div className="mb-2 flex w-full flex-col">
        {(displayedRouteImplementation === bestRouteImplementaton
          ? (bestRoute?.routes.concat(routesToShow) ?? routesToShow)
          : routesToShow
        ).map((route, i: number) => {
          const currentRouteimplementation =
            route.protocol === Protocol.V3
              ? (route.route.pools[0]?.poolType ?? Implementation.UNISWAP)
              : route.protocol === Protocol.V2
                ? (route.route.pairs[0]?.pairType ?? Implementation.UNISWAP)
                : Implementation.MIXED;

          const highlighted =
            (!secondaryRoute &&
              bestRoute?.routes[0]?.poolAddresses
                ?.join("-")
                .concat(bestRouteImplementaton) ===
                route.poolAddresses
                  .join("-")
                  .concat(currentRouteimplementation)) ||
            secondaryRoute?.routes[0]?.poolAddresses
              ?.join("-")
              .concat(secondaryRouteImplementation) ===
              route.poolAddresses.join("-").concat(currentRouteimplementation);

          return (
            <span
              key={`${route.poolAddresses.join("-")}-${i}`}
              className={cn(
                "relative flex w-full cursor-pointer flex-col border border-b-0 border-zinc-300 bg-white px-2 py-2 first:rounded-t-none last:rounded-b-lg last:border-b dark:border-zinc-700 dark:bg-black/40 dark:hover:bg-emerald-500/10",
                highlighted ? "dark:bg-emerald-900/20" : "",
              )}
              onClick={() => {
                void tryAlternativeRoute(route);
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-secondary-foreground">
                  Est. received
                </span>
                <span className="text-right text-xs font-semibold text-secondary-foreground">
                  {!route.quote ? (
                    <SkeletonBox className="h-4 w-[120px] py-0.5" />
                  ) : (
                    `${route.quote.toFixed(6) ?? "0.00"} ${
                      route.quote.currency.symbol ?? ""
                    }`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary-foreground">
                  Pool{" "}
                  {bestRoute?.routes[0]?.poolAddresses
                    ?.join("-")
                    .concat(bestRouteImplementaton) ===
                    route.poolAddresses
                      .join("-")
                      .concat(currentRouteimplementation) && (
                    <span className="rounded-full border border-emerald-700 bg-emerald-500 px-2 py-0 text-[10px] font-bold uppercase italic tracking-wide text-white dark:bg-emerald-500/80 dark:text-black">
                      <span className="relative -left-0.5">Best Route</span>
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-right text-xs font-semibold text-secondary-foreground">
                    {!currentRouteimplementation ? (
                      <SkeletonBox className="h-4 w-[120px] py-0.5" />
                    ) : currentRouteimplementation === Implementation.MIXED ? (
                      <MixedImplementationDisplay
                        pools={
                          (route.route as MixedRoute<Currency, Currency>)
                            .pools as Pool[]
                        }
                      />
                    ) : (
                      implementationComponents[currentRouteimplementation] ||
                      null
                    )}
                  </span>
                </div>
              </div>
            </span>
          );
        })}
        {routes.length > 3 && (
          <span
            className="cursor-pointer rounded-b border border-emerald-900/60 bg-white p-2 text-center text-xs text-zinc-700 dark:bg-black/40 dark:text-zinc-400 dark:hover:bg-emerald-500/10"
            onClick={() => setShowAllRoutes(!showAllRoutes)}
          >
            {showAllRoutes ? "Hide all routes" : "Show all routes"}
          </span>
        )}
      </div>
    )
  );
};
