"use client"

import type { FC, ReactElement } from "react"
import { useMemo } from "react"

import { SlidersVerticalIcon, XIcon } from "@x7/icons"
import { useSlippageTolerance } from "@x7/ui"
import { Button } from "@x7/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@x7/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip"
import { Implementation } from "@x7/utils"
import { ImplementationIcon } from "~/app/(xchange)/_components/swap/swap-implementation-logos"
import { useSwapState } from "~/lib/stores/swap"

import { EnabledImplementations } from "./enabled-implementation"
import { SlippageTolerance as SlippageTolerancePanel } from "./slippage-tolerance"

export enum SettingsModule {
  SlippageTolerance = "SlippageTolerance",
  ImplementationChoices = "ImplementationChoices",
}

interface SettingsOverlayProps {
  children?: ReactElement
  modules: SettingsModule[]
  options?: {
    slippageTolerance?: {
      storageKey?: string
      defaultValue?: string
      title?: string
    }
    enabledImplementations?: {
      storageKey?: string
      defaultValue?: string
      title?: string
    }
  }
}

const implementationClassOverrides = {
  [Implementation.AERODROME]: "h-3 text-zinc-500",
  [Implementation.UNISWAP]: "h-3.5",
  [Implementation.PANCAKESWAP]: "h-3.5",
  [Implementation.XCHANGE]: "h-3.5",
  [Implementation.SUSHISWAP]: "h-3",
}

export const SettingsOverlay: FC<SettingsOverlayProps> = ({
  modules,
  children,
  options,
}) => {
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(
    options?.slippageTolerance?.storageKey
  )
  const {
    state: { enabledImplementations },
  } = useSwapState()

  const dexCount = enabledImplementations.length
  const singleDex = dexCount === 1 ? enabledImplementations[0] : null

  const highSlippage = Number(slippageTolerance) > 2

  // Memoize iconProps to prevent unnecessary re-renders
  const iconProps = useMemo(
    () => ({
      className: "h-3 w-3 text-muted-foreground",
    }),
    []
  )

  return (
    <Dialog>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <div className="border-border bg-muted/50 text-2xs ml-auto flex items-center rounded-lg border px-2 py-1">
          <div className="text-muted-foreground flex items-center font-bold">
            {singleDex ? (
              <ImplementationIcon
                implementation={singleDex}
                classNameOverrides={implementationClassOverrides}
              />
            ) : (
              <>
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                {dexCount} Dexs
              </>
            )}
          </div>
          {highSlippage &&
            modules.includes(SettingsModule.SlippageTolerance) && (
              <>
                <div aria-hidden="true" className="text-muted-foreground mx-2">
                  |
                </div>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setSlippageTolerance("0.5")}
                      className="bg-opacity-50 h-6 rounded-xs text-black"
                      iconPosition="end"
                      variant="warning"
                      size="xs"
                      icon={XIcon}
                    >
                      {slippageTolerance}%
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset slippage tolerance</TooltipContent>
                </Tooltip>
              </>
            )}
          <div aria-hidden="true" className="text-muted-foreground ml-2">
            |
          </div>
          <DialogTrigger asChild>
            <Button
              aria-label="Open trade settings"
              size="sm"
              variant="ghost"
              className="h-6 pr-0.5 pl-2 hover:bg-transparent"
              iconPosition="end"
              iconProps={iconProps}
              icon={SlidersVerticalIcon}
            />
          </DialogTrigger>
        </div>
      )}
      <DialogContent>
        <DialogHeader className="border-border/50 mb-2 border-b pb-4">
          <DialogTitle>Trade Settings</DialogTitle>
          <DialogDescription>
            Adjust to optimize your trade experience.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {modules.includes(SettingsModule.SlippageTolerance) && (
            <SlippageTolerancePanel options={options?.slippageTolerance} />
          )}
          {modules.includes(SettingsModule.ImplementationChoices) && (
            <EnabledImplementations options={options?.enabledImplementations} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
