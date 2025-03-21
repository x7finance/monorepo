import type { FC } from "react";

import { cn } from "@x7/css";
import { InfoIcon } from "@x7/icons";
import { useRecipientAddressState } from "@x7/ui";
import { Switch } from "@x7/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";

export const RecipientAddressToggle: FC<{
  options?: {
    storageKey?: string;
    defaultValue?: string;
    title?: string;
  };
}> = ({ options }) => {
  const [recipientAddressState, setRecipientAddressState] =
    useRecipientAddressState(options?.storageKey);

  return (
    <div className="mb-4 flex w-full flex-col gap-4">
      <div className="flex w-full">
        <h4 className="text-sm text-secondary-foreground">
          Show Alternative Recipient Option{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="relative bottom-1 inline h-3.5 w-3.5 text-sky-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                At the bottom of the trade panel, this will allow you to quickly
                trade to an alternative recipient address
              </p>
            </TooltipContent>
          </Tooltip>
        </h4>
        <div className="ml-auto">
          <Switch
            checked={recipientAddressState === true}
            onCheckedChange={(checked: boolean) =>
              setRecipientAddressState(checked ? true : false)
            }
            className={cn(
              recipientAddressState === true
                ? "bg-emerald-500!"
                : "bg-zinc-300",
              "focus-visible:ring-emerald-500",
            )}
          />
        </div>
      </div>
    </div>
  );
};
