import type { FC } from "react";

import { cn } from "@x7/css";
import { InfoIcon } from "@x7/icons";
import { useTradePercentage } from "@x7/ui";
import { Switch } from "@x7/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";

export const TradePercentageToggle: FC<{
  options?: {
    storageKey?: string;
    defaultValue?: string;
    title?: string;
  };
}> = ({ options }) => {
  const [tradePercentage, setTradePercentage] = useTradePercentage(
    options?.storageKey,
  );

  return (
    <div className="mb-4 flex w-full flex-col gap-4">
      <div className="flex w-full">
        <h4 className="text-sm text-secondary-foreground">
          Show Trade Percentage{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="relative bottom-1 inline h-3.5 w-3.5 text-sky-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                In your trading panel this will allow you to quickly trade, 25%,
                50%, 100% of your wallet balance on a token
              </p>
            </TooltipContent>
          </Tooltip>
        </h4>
        <div className="ml-auto">
          <Switch
            checked={tradePercentage === true}
            onCheckedChange={(checked: boolean) =>
              setTradePercentage(checked ? true : false)
            }
            className={cn(
              tradePercentage === true ? "bg-emerald-500!" : "bg-zinc-300",
              "focus-visible:ring-emerald-500",
            )}
          />
        </div>
      </div>
    </div>
  );
};
