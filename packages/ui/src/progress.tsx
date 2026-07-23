/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client"

import { Progress as BaseProgress } from "@base-ui/react/progress"
import * as React from "react"

import { cn } from "@x7/css"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof BaseProgress.Root> & {
  value?: number
}) {
  return (
    <BaseProgress.Root
      data-slot="progress"
      value={value}
      className={cn(
        "bg-secondary relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <BaseProgress.Track data-slot="progress-track" className="h-full w-full">
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className="h-full bg-indigo-700 transition-all"
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export { Progress }
