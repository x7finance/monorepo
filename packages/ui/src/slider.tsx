"use client"

import { Slider as BaseSlider } from "@base-ui/react/slider"
import * as React from "react"

import { cn } from "@x7/css"

function Slider({
  className,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof BaseSlider.Root>, "onValueChange"> & {
  onValueChange?: (values: number[]) => void
}) {
  const handleChange = React.useCallback(
    (value: number | readonly number[]) => {
      if (onValueChange) {
        const values = Array.isArray(value) ? [...value] : [value]
        onValueChange(values)
      }
    },
    [onValueChange]
  )

  return (
    <BaseSlider.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className
      )}
      onValueChange={onValueChange ? handleChange : undefined}
      {...props}
    >
      <BaseSlider.Control data-slot="slider-control" className="flex w-full">
        <BaseSlider.Track
          data-slot="slider-track"
          className="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full"
        >
          <BaseSlider.Indicator
            data-slot="slider-indicator"
            className="bg-primary absolute h-full"
          />
        </BaseSlider.Track>
        <BaseSlider.Thumb
          data-slot="slider-thumb"
          className="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-5 w-5 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export { Slider }
