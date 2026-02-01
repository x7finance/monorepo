"use client"

import { Menu as BaseMenu } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

function ContextMenu({ ...props }: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return (
    <BaseMenu.Trigger
      data-slot="context-menu-trigger"
      className={className}
      {...props}
    />
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof BaseMenu.Group>) {
  return <BaseMenu.Group data-slot="context-menu-group" {...props} />
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof BaseMenu.Portal>) {
  return <BaseMenu.Portal data-slot="context-menu-portal" {...props} />
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioGroup>) {
  return <BaseMenu.RadioGroup data-slot="context-menu-radio-group" {...props} />
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.SubmenuTrigger> & {
  inset?: boolean
}) {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </BaseMenu.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={2} className="z-50">
        <BaseMenu.Popup
          data-slot="context-menu-sub-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg transition-all",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner className="z-50">
        <BaseMenu.Popup
          data-slot="context-menu-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md transition-all",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof BaseMenu.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <BaseMenu.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <BaseMenu.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <BaseMenu.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </BaseMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseMenu.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof BaseMenu.GroupLabel> & {
  inset?: boolean
}) {
  return (
    <BaseMenu.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-semibold data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
