"use client"

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

function TooltipProvider({
  delayDuration = 0,
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Provider> & {
  delayDuration?: number
}) {
  return (
    <BaseTooltip.Provider
      data-slot="tooltip-provider"
      delay={delayDuration}
      {...props}
    >
      {children}
    </BaseTooltip.Provider>
  )
}

function Tooltip({
  delayDuration,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Root> & {
  delayDuration?: number
}) {
  return (
    <TooltipProvider delayDuration={delayDuration ?? 0}>
      <BaseTooltip.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Trigger> & {
  asChild?: boolean
}) {
  return (
    <BaseTooltip.Trigger
      data-slot="tooltip-trigger"
      className={cn("cursor-pointer", className)}
      render={asChild ? <Slot /> : undefined}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  side,
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & {
  sideOffset?: number
  side?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={sideOffset} side={side}>
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            "bg-primary text-primary-foreground z-50 max-w-sm rounded-md px-3 py-1.5 text-xs transition-all",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[instant]:duration-0",
            className
          )}
          {...props}
        >
          {children}
          <BaseTooltip.Arrow className="fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
