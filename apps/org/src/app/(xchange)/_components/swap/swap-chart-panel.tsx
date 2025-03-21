"use client";

import { useTradeChartPanelLiquidity } from "@x7/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card";

import { SwapChartLiquidity } from "./swap-chart-liquidity";

export function SwapChartPanel() {
  const [showTradeChartPanelLiquidity] = useTradeChartPanelLiquidity();

  if (!showTradeChartPanelLiquidity) {
    return null;
  }

  return (
    <div className="hidden flex-col items-center justify-between space-x-4 md:block">
      <div className="text-card-foreground h-full w-full rounded-lg border-0 px-px shadow-none">
        <Card className="flex-col border-0 bg-transparent shadow-none">
          <CardHeader className="w-full justify-between space-y-1 p-6 px-0">
            <div className="flex items-center justify-between space-x-4">
              <CardTitle
                tag={"h1"}
                className="h-[48px] text-left text-zinc-900 dark:text-zinc-600"
              ></CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 pr-2 pl-0">
            <SwapChartLiquidity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
