import type { FC } from "react";

import { cn } from "@x7/css";
import { InfoIcon } from "@x7/icons";
import { useEnabledImplentations } from "@x7/ui";
import { CardDescription, CardHeader, CardTitle } from "@x7/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@x7/ui/hover-card";
import { Label } from "@x7/ui/label";
import { LinkInternal } from "@x7/ui/link";
import { Switch } from "@x7/ui/switch";
import { Implementation } from "@x7/utils";

import { ImplementationIcon } from "~/app/(xchange)/_components/swap/swap-implementation-logos";

const implementationClassOverrides = {
  [Implementation.XCHANGE]: "h-5",
  [Implementation.AERODROME]: "h-4 text-muted-foreground",
  [Implementation.UNISWAP]: "h-5",
  [Implementation.PANCAKESWAP]: "h-5",
  [Implementation.SUSHISWAP]: "h-4 text-muted-foreground",
};

export const EnabledImplementations: FC<{
  options?: {
    storageKey?: string;
    defaultValue?: string;
  };
}> = ({ options }) => {
  const [enabledImplementations, setEnabledImplementations] =
    useEnabledImplentations(options?.storageKey);

  const onChange = (value: string) => {
    const enabledCurrently = enabledImplementations.split(",");

    if (enabledCurrently.includes(value)) {
      const newWithout = enabledCurrently.filter((v) => v !== value).join(",");
      if (newWithout.length === 0) {
        setEnabledImplementations("XCHANGE,UNISWAP");
      } else {
        setEnabledImplementations(
          enabledCurrently.filter((v) => v !== value).join(","),
        );
      }
    } else {
      setEnabledImplementations([...enabledCurrently, value].join(","));
    }
  };

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <div className={"py-4"}>
        <div className="flex flex-col gap-2">
          <Label className="mb-4 flex items-center gap-1">
            <h3 className="font-heading text-lg opacity-80">DEX's Enabled</h3>
            <HoverCardTrigger>
              <InfoIcon width={16} height={16} />
            </HoverCardTrigger>
          </Label>

          <HoverCardContent align="start" className="z-1080 max-w-[320px] p-0!">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-100">
                Dex Quoting
              </CardTitle>
              <CardDescription className="prose">
                <p>
                  Select which DEX's you'd like to be able to quote prices from.
                  The fewer the DEX's selected, the faster the quoting will be.
                </p>
                <LinkInternal
                  prefetch={true}
                  className="font-medium text-emerald-500 hover:underline"
                  target="_blank"
                  href={"/docs"}
                >
                  Learn more &rarr;
                </LinkInternal>
              </CardDescription>
            </CardHeader>
          </HoverCardContent>

          <div className="flex w-full flex-col gap-4 px-2">
            {Object.values(Implementation)
              .filter((imp) => imp !== Implementation.MIXED)
              .map((imp) => {
                const isEnabled = enabledImplementations
                  .split(",")
                  .includes(imp);
                return (
                  <div key={imp} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImplementationIcon
                        classNameOverrides={implementationClassOverrides}
                        implementation={imp}
                      />
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => onChange(imp)}
                      className={cn(
                        isEnabled ? "bg-emerald-500!" : "bg-zinc-300",
                        "focus-visible:ring-emerald-500",
                      )}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </HoverCard>
  );
};
