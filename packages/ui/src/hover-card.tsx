"use client"

import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

function HoverCard({
  openDelay: _openDelay,
  closeDelay: _closeDelay,
  ...props
}: React.ComponentProps<typeof BasePreviewCard.Root> & {
  openDelay?: number
  closeDelay?: number
}) {
  return <BasePreviewCard.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof BasePreviewCard.Trigger> & {
  asChild?: boolean
}) {
  return (
    <BasePreviewCard.Trigger
      data-slot="hover-card-trigger"
      className={cn("cursor-pointer", className)}
      render={asChild ? <Slot /> : undefined}
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof BasePreviewCard.Popup> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner align={align} sideOffset={sideOffset}>
        <BasePreviewCard.Popup
          data-slot="hover-card-content"
          className={cn(
            "z-50 w-64 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-hidden transition-all",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  )
}

function HoverCardArrow({
  className,
  ...props
}: React.ComponentProps<typeof BasePreviewCard.Arrow>) {
  return (
    <BasePreviewCard.Arrow
      data-slot="hover-card-arrow"
      className={cn("fill-popover", className)}
      {...props}
    />
  )
}

export { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger }
