"use client"

import { Select as BaseSelect } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

function Select<T>({
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof BaseSelect.Root<T>>, "onValueChange"> & {
  onValueChange?: (value: T) => void
}) {
  const handleChange = React.useCallback(
    (value: T | null) => {
      if (value !== null && onValueChange) {
        onValueChange(value)
      }
    },
    [onValueChange]
  )

  return (
    <BaseSelect.Root
      data-slot="select"
      onValueChange={onValueChange ? handleChange : undefined}
      {...props}
    />
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof BaseSelect.Group>) {
  return <BaseSelect.Group data-slot="select-group" {...props} />
}

function SelectValue({
  placeholder: _placeholder,
  ...props
}: React.ComponentProps<typeof BaseSelect.Value> & {
  placeholder?: string
}) {
  return <BaseSelect.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  children,
  asChild,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger> & {
  asChild?: boolean
}) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground aria-invalid:border-destructive ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex h-9 w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-0 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1",
        className
      )}
      render={asChild ? <Slot /> : undefined}
      {...props}
    >
      {children}
      <BaseSelect.Icon>
        <ChevronDownIcon className="size-4 opacity-50" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

function SelectPortal({
  ...props
}: React.ComponentProps<typeof BaseSelect.Portal>) {
  return <BaseSelect.Portal data-slot="select-portal" {...props} />
}

function SelectBackdrop({
  ...props
}: React.ComponentProps<typeof BaseSelect.Backdrop>) {
  return <BaseSelect.Backdrop data-slot="select-backdrop" {...props} />
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  side,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> & {
  position?: "item-aligned" | "popper"
  side?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        data-slot="select-positioner"
        className="z-50"
        sideOffset={position === "popper" ? 4 : 0}
        side={side}
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            "bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md transition-all",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <div
            className={cn(
              "p-1",
              position === "popper" &&
                "h-[var(--available-height)] w-full min-w-[var(--anchor-width)] scroll-my-1"
            )}
          >
            {children}
          </div>
          <SelectScrollDownButton />
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <BaseSelect.ItemIndicator>
          <CheckIcon className="size-4" />
        </BaseSelect.ItemIndicator>
      </span>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ScrollUpArrow>) {
  return (
    <BaseSelect.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </BaseSelect.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ScrollDownArrow>) {
  return (
    <BaseSelect.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </BaseSelect.ScrollDownArrow>
  )
}

export {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
