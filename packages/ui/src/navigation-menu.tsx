"use client"

import { Menu as BaseMenu } from "@base-ui/react/menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

interface NavigationMenuContextValue {
  viewport: boolean
  activeItem: string | null
  setActiveItem: (item: string | null) => void
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
  viewport: true,
  activeItem: null,
  setActiveItem: () => {},
})

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  viewport?: boolean
}) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null)

  return (
    <NavigationMenuContext.Provider
      value={{ viewport, activeItem, setActiveItem }}
    >
      <nav
        data-slot="navigation-menu"
        data-viewport={viewport}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {viewport && <NavigationMenuViewport />}
      </nav>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  value,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement> & {
  value?: string
}) {
  const itemId = React.useId()
  const itemValue = value ?? itemId

  return (
    <li
      data-slot="navigation-menu-item"
      data-value={itemValue}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </li>
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
)

interface NavigationMenuTriggerProps extends React.ComponentProps<
  typeof BaseMenu.Trigger
> {
  asChild?: boolean
}

function NavigationMenuTrigger({
  className,
  children,
  asChild,
  ...props
}: NavigationMenuTriggerProps) {
  return (
    <BaseMenu.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        navigationMenuTriggerStyle(),
        "group cursor-pointer",
        className
      )}
      render={asChild ? <Slot /> : undefined}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 motion-safe:transition-transform motion-safe:duration-[220ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[popup-open]:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </BaseMenu.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup>) {
  const { viewport } = React.useContext(NavigationMenuContext)

  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner>
        <BaseMenu.Popup
          data-slot="navigation-menu-content"
          className={cn(
            "top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
            "data-[starting-style]:opacity-0 data-[starting-style]:translate-y-1",
            "data-[ending-style]:opacity-0 data-[ending-style]:translate-y-1",
            "motion-safe:transition-[transform,opacity] motion-safe:duration-[220ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            !viewport &&
              "bg-popover text-popover-foreground mt-1.5 overflow-hidden rounded-md border shadow",
            "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
            className
          )}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <div
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground border-border relative mt-1.5 w-full overflow-hidden rounded-md border shadow",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  asChild,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="navigation-menu-link"
      className={cn(
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuArrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-arrow"
      className={cn(
        "pointer-events-none absolute z-20 size-3 rotate-45 rounded-[2px]",
        "border border-border bg-popover",
        "motion-safe:transition-[opacity,left] motion-safe:duration-[220ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        "data-[side=top]:bottom-0 data-[side=top]:translate-y-1/2",
        "data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-1/2",
        "data-[side=left]:right-0 data-[side=left]:translate-x-1/2",
        "data-[side=right]:left-0 data-[side=right]:-translate-x-1/2",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <NavigationMenuArrow className="relative top-[60%]" />
    </div>
  )
}

// Wrapper component that provides Menu.Root context
function NavigationMenuItemWithMenu({
  className,
  value,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement> & {
  value?: string
}) {
  return (
    <BaseMenu.Root>
      <NavigationMenuItem className={className} value={value} {...props}>
        {children}
      </NavigationMenuItem>
    </BaseMenu.Root>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuItemWithMenu,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuArrow,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
