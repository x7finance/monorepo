/* oxlint-disable @typescript-eslint/unbound-method */
"use client"

import type { VariantProps } from "class-variance-authority"
import type { FC } from "react"
import * as React from "react"
import { useEffect, useRef, useState, useTransition } from "react"

import { cn } from "@x7/css"

import type { chipVariants } from "./chip"
import { Chip } from "./chip"
import { textFieldVariants } from "./text-field"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import type { ExtractProps, IconComponent } from "./types"

export type ChipInputRootProps = React.InputHTMLAttributes<HTMLDivElement>

const ChipInputRoot = React.forwardRef<HTMLDivElement, ChipInputRootProps>(
  ({ ...props }, ref) => {
    return <div ref={ref} className="flex items-center gap-2" {...props} />
  }
)
ChipInputRoot.displayName = "ChipInputRoot"

interface ChipInputProps
  extends
    Omit<React.HTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof chipVariants>, "variant">,
    VariantProps<typeof textFieldVariants> {
  icon?: IconComponent
  iconProps?: ExtractProps<React.ElementType<IconComponent>> & {
    width?: number
    height?: number
    className?: string
  }
  onValueChange(values: string[]): void
  values: string[]
  mutateValue?(string: string): string
  delimiters?: string[]
  maxValues?: number
}

const DEFAULT_DELIMITERS = [",", ";", ":", " ", "Enter", "Tab"]

const ChipInput: FC<ChipInputProps> = ({
  className,
  icon: Icon,
  iconProps,
  size,
  values,
  variant,
  onValueChange,
  delimiters = DEFAULT_DELIMITERS,
  mutateValue,
  maxValues,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const [state, setState] = useState(`${values.join(",")},`)
  const [_pending, startTransition] = useTransition()
  // const _inputHasText = ref.current && ref.current.value !== "";

  // Empty when reset
  useEffect(() => {
    if (values.length === 0) {
      setState("")
    }
  }, [values])

  const split = (str: string) => {
    const regExp = new RegExp(`(?:${delimiters.map((el) => el).join("|")})+`)
    return str.split(regExp).filter((el) => el !== "")
  }

  const sync = (newValues: string[]) =>
    startTransition(() => onValueChange(newValues))

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ref.current) return

    const value = e.currentTarget.value
    if (delimiters.includes(e.key)) {
      setState((prev) => `${prev}${value}`)
      ref.current.value = ""
    }

    sync([...split(state), value])
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (e.code === "Backspace" && value === "") {
      setState((prev) => {
        const removeLastTag = split(prev).slice(0, -1)
        sync(removeLastTag)

        return `${removeLastTag.join(" ")},`
      })
    }
  }

  const removeTag = (index: number) => {
    setState((prev) => {
      const tags = split(prev)
      const newTags = [...tags.slice(0, index), ...tags.slice(index + 1)]
      sync(newTags)

      return `${newTags.join(" ")},`
    })
  }

  const tags = split(state)

  return (
    <ChipInputRoot
      className={textFieldVariants({
        variant,
        size,
        className: "relative h-[unset]! flex-wrap gap-2",
      })}
    >
      {Icon ? <Icon {...iconProps} /> : null}
      {tags.length > 0
        ? tags.map((value, index) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <Chip onClose={() => removeTag(index)} variant="secondary">
                  {mutateValue ? mutateValue(value) : value}
                </Chip>
              </TooltipTrigger>
              <TooltipContent>
                <p>{value}</p>
              </TooltipContent>
            </Tooltip>
          ))
        : null}
      {(maxValues ? tags.length < maxValues : true) ? (
        <input
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className={cn(
            className,
            "flex grow truncate bg-transparent outline-hidden ring-0"
          )}
          ref={ref}
          {...props}
        />
      ) : null}
    </ChipInputRoot>
  )
}

export { ChipInput }
