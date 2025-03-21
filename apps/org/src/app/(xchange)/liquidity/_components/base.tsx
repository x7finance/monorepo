"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AddLiquidity } from "./add-liquidity";
import { LivePairs } from "./livePairs";
import {
  MyClosedLiquidityPositions,
  MyOpenLiquidityPositions,
} from "./my-positions";

// Memoize LivePairs to prevent unnecessary re-renders
const MemoizedLivePairs = React.memo(LivePairs);

function getView(tab: string | null) {
  switch (tab) {
    case "my-open-positions":
      return <MyOpenLiquidityPositions />;
    case "my-closed-positions":
      return <MyClosedLiquidityPositions />;
    case "add":
      return <AddLiquidity />;
    case "all-pools":
      return <MemoizedLivePairs />;
    default:
      return <MemoizedLivePairs />;
  }
}

export function LiquidityBase() {
  const router = useSearchParams();

  const tab = router.get("tab") ?? "all-pools";

  // Use useMemo to memoize the view based on the tab
  const view = useMemo(() => getView(tab), [tab]);

  return <>{view}</>;
}
