"use client"

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area"
import * as React from "react"

import { cn } from "@x7/css"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </BaseScrollArea.Viewport>
      <ScrollBar />
      <ScrollBar orientation="horizontal" />
      <BaseScrollArea.Corner data-slot="scroll-area-corner" />
    </BaseScrollArea.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  return (
    <BaseScrollArea.Scrollbar
      data-slot="scroll-bar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <BaseScrollArea.Thumb
        data-slot="scroll-bar-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </BaseScrollArea.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
