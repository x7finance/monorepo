"use client"

import * as React from "react"

import { cn } from "@x7/css"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="aspect-ratio"
        className={cn("relative w-full", className)}
        style={{
          aspectRatio: ratio,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
