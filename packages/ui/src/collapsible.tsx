"use client"

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

function Collapsible({
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Root>) {
  return <BaseCollapsible.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  className,
  asChild,
  nativeButton = true,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger> & {
  asChild?: boolean
  nativeButton?: boolean
}) {
  return (
    <BaseCollapsible.Trigger
      data-slot="collapsible-trigger"
      className={cn("cursor-pointer", className)}
      render={asChild ? <Slot /> : undefined}
      nativeButton={nativeButton}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden transition-all",
        "data-[ending-style]:h-0 data-[starting-style]:h-0",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
