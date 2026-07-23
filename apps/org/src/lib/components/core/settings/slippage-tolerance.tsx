import type { FC } from "react"
import { useCallback, useState } from "react"

import { cn } from "@x7/css"
import { AlertCircleIcon, InfoIcon, PencilIcon } from "@x7/icons"
import { useSlippageTolerance } from "@x7/ui"
import { Alert, AlertDescription, AlertTitle } from "@x7/ui/alert"
import { CardDescription, CardHeader, CardTitle } from "@x7/ui/card"
import { Collapsible } from "@x7/ui/collapsible"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@x7/ui/hover-card"
import { Input } from "@x7/ui/input"
import { Label } from "@x7/ui/label"
import { LinkInternal } from "@x7/ui/link"
import { Slider } from "@x7/ui/slider"
import { Switch } from "@x7/ui/switch"

const formatSlippage = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(1)
}

export const SlippageTolerance: FC<{
  options?: {
    storageKey?: string
    defaultValue?: string
    title?: string
  }
  showAutoSelector?: boolean
}> = ({ options, showAutoSelector = true }) => {
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(
    options?.storageKey
  )

  const [showCustomInput, setShowCustomInput] = useState(false)

  const onChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        const formattedValue = formatSlippage(numValue)
        setSlippageTolerance(formattedValue)
      }
    },
    [setSlippageTolerance]
  )

  const isDangerous =
    (!Number.isNaN(+slippageTolerance) && +slippageTolerance >= 5) ||
    (!Number.isNaN(+slippageTolerance) &&
      +slippageTolerance < 0.1 &&
      +slippageTolerance > 0)

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <div className={""}>
        {showAutoSelector ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="flex w-full flex-col gap-2">
                <Label className="mb-4 flex w-full items-center gap-1 font-normal">
                  <h3 className="font-heading text-lg opacity-80">
                    Slippage Tolerance
                  </h3>
                  <HoverCardTrigger>
                    <InfoIcon width={16} height={16} />
                  </HoverCardTrigger>
                  <div className="mt-2 ml-auto flex items-center gap-2">
                    <span className="text-2xs text-muted-foreground font-bold uppercase transition-colors duration-200">
                      {slippageTolerance === "AUTO" ? "Auto" : "Manual"}
                    </span>
                    <Switch
                      checked={slippageTolerance === "AUTO"}
                      onCheckedChange={(checked) =>
                        setSlippageTolerance(checked ? "AUTO" : "0.5")
                      }
                      className={cn(
                        slippageTolerance === "AUTO"
                          ? "bg-emerald-500!"
                          : "bg-zinc-300",
                        "focus-visible:ring-emerald-500"
                      )}
                    />
                  </div>
                </Label>
                <HoverCardContent className="z-1080 max-w-[320px] p-0!">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-100">
                      Slippage
                    </CardTitle>
                    <CardDescription className="prose">
                      <p>
                        Slippage is the difference between the expected value of
                        output from a trade and the actual value due to asset
                        volatility and liquidity depth. If the actual slippage
                        falls outside of the user-designated range, the
                        transaction will revert.
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
              </div>
            </div>
          </>
        ) : null}
        <div className="flex">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1 font-normal">
              {options?.title ?? <>&nbsp;</>}
            </Label>
          </div>
          <span
            className={cn(
              isDangerous ? "text-red-500" : "text-muted-foreground",
              "text-sm font-semibold"
            )}
          >
            {slippageTolerance === "AUTO" ? "0.5%" : `${slippageTolerance}%`}
          </span>
        </div>
        <Collapsible open={slippageTolerance !== "AUTO"}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Slider
                value={[parseFloat(slippageTolerance)]}
                onValueChange={(newValues: number[]) =>
                  onChange(formatSlippage(newValues[0] ?? 0.1))
                }
                min={0.1}
                max={99}
                step={0.01}
                className="grow"
              />
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="rounded-full p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
            {isDangerous && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  {+slippageTolerance < 0.1 && +slippageTolerance > 0
                    ? "Your transaction may be reverted due to low slippage tolerance"
                    : "Your transaction may be frontrun due to high slippage tolerance"}
                </AlertDescription>
              </Alert>
            )}

            {showCustomInput && (
              <Input
                type="number"
                inputMode="decimal"
                value={slippageTolerance}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Custom slippage"
                className="w-full"
              />
            )}
          </div>
        </Collapsible>
      </div>
    </HoverCard>
  )
}
