"use client"

import { Switch as BaseSwitch } from "@base-ui/react/switch"
import * as React from "react"

import { cn } from "@x7/css"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-zinc-500 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-zinc-300 dark:data-[unchecked]:bg-input",
        className
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0"
        )}
      />
    </BaseSwitch.Root>
  )
}

export { Switch }
