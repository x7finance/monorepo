"use client"

import { Radio as BaseRadio } from "@base-ui/react/radio"
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group"
import { CircleIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseRadioGroup>) {
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseRadio.Root>) {
  return (
    <BaseRadio.Root
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aspect-square size-4 shrink-0 cursor-pointer rounded-full border shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-0",
        className
      )}
      {...props}
    >
      <BaseRadio.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </BaseRadio.Indicator>
    </BaseRadio.Root>
  )
}

export { RadioGroup, RadioGroupItem }
