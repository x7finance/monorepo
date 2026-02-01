"use client"

import type { VariantProps } from "class-variance-authority"

import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<typeof BaseToggle> &
  VariantProps<typeof toggleVariants> & {
    asChild?: boolean
  }) {
  return (
    <BaseToggle
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      render={asChild ? <Slot /> : undefined}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
