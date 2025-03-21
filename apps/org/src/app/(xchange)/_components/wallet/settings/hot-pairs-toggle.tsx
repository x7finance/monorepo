"use client";

import { InfoIcon } from "@x7/icons";
import { useTradeChartPanelNewest } from "@x7/ui";
import { Switch } from "@x7/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";

export function HotPairsToggle() {
  const [showTradeChartPanelNewest, setShowTradeChartPanelNewest] =
    useTradeChartPanelNewest();

  return (
    <div className="mb-4 flex w-full flex-col gap-4">
      <div className="flex w-full">
        <h4 className="text-sm text-secondary-foreground">
          Show Trending Pairs{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="relative bottom-1 inline h-3.5 w-3.5 text-sky-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                This will show a ticker of the trending tokens available on
                Xchange
              </p>
            </TooltipContent>
          </Tooltip>
        </h4>
        <div className="ml-auto">
          <Switch
            checked={showTradeChartPanelNewest === true}
            onCheckedChange={(checked: boolean) =>
              setShowTradeChartPanelNewest(checked ? true : false)
            }
          />
        </div>
      </div>
    </div>
  );
}
