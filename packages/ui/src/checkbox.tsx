"use client"

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[checked]:border-primary ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-4 shrink-0 cursor-pointer rounded-[4px] border shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-0",
        className
      )}
      {...props}
    >
      <BaseCheckbox.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

export { Checkbox }
