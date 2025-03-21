import type { FC } from "react";

import { cn } from "@x7/css";
import { InfoIcon } from "@x7/icons";
import { useColorHue } from "@x7/ui";
import { Switch } from "@x7/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";

export const ColorHueToggle: FC<{
  options?: {
    storageKey?: string;
    defaultValue?: string;
    title?: string;
  };
}> = ({ options }) => {
  const [colorHue, setColorHue] = useColorHue(options?.storageKey);

  return (
    <div className="mb-4 flex w-full flex-col gap-4">
      <div className="flex w-full">
        <h4 className="text-sm text-secondary-foreground">
          Show Chain Color Hue{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="relative bottom-1 inline h-3.5 w-3.5 text-sky-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                This will change the background color of the app based on the
                chain you&apos;re connected to
              </p>
            </TooltipContent>
          </Tooltip>
        </h4>
        <div className="ml-auto">
          <Switch
            checked={colorHue === true}
            onCheckedChange={(checked: boolean) =>
              setColorHue(checked ? true : false)
            }
            className={cn(
              colorHue === true ? "bg-emerald-500!" : "bg-zinc-300",
              "focus-visible:ring-emerald-500",
            )}
          />
        </div>
      </div>
    </div>
  );
};
