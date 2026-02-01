"use client"

import { Popover as BasePopover } from "@base-ui/react/popover"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

function Popover({ ...props }: React.ComponentProps<typeof BasePopover.Root>) {
  return <BasePopover.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof BasePopover.Trigger> & {
  asChild?: boolean
}) {
  return (
    <BasePopover.Trigger
      data-slot="popover-trigger"
      className={cn("cursor-pointer", className)}
      render={asChild ? <Slot /> : undefined}
      {...props}
    />
  )
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  side,
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
  side?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner align={align} sideOffset={sideOffset} side={side}>
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden transition-all",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

function PopoverAnchor({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-anchor" className={className} {...props} />
}

function PopoverBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Backdrop>) {
  return (
    <BasePopover.Backdrop
      data-slot="popover-backdrop"
      className={cn("fixed inset-0 z-40", className)}
      {...props}
    />
  )
}

function PopoverArrow({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Arrow>) {
  return (
    <BasePopover.Arrow
      data-slot="popover-arrow"
      className={cn("fill-popover", className)}
      {...props}
    />
  )
}

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Title>) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Description>) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function PopoverClose({
  ...props
}: React.ComponentProps<typeof BasePopover.Close>) {
  return <BasePopover.Close data-slot="popover-close" {...props} />
}

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBackdrop,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
}
