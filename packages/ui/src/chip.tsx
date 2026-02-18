import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@x7/css"
import { XIcon } from "@x7/icons"

import type { ExtractProps, IconComponent } from "./types"

const chipVariants = cva(
  "whitespace-nowrap inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 border-transparent text-primary-foreground",
        secondary:
          "bg-secondary hover:bg-muted focus:bg-accent border-transparent text-secondary-foreground",
        destructive:
          "bg-red-500 hover:bg-red-600 focus:bg-red-700 border-transparent text-destructive-foreground",
        ghost: "hover:bg-muted focus:bg-accent",
        outline: "text-foreground",
      },
      hasRemove: {
        yes: "pr-0.5",
        no: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ChipProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof chipVariants>, "hasRemove"> {
  icon?: IconComponent
  iconProps?: ExtractProps<React.ElementType<IconComponent>> & {
    width?: number
    height?: number
    className?: string
  }
  onClose?: () => void
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    { className, variant, icon: Icon, onClose, iconProps, children, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          chipVariants({
            variant,
            className: cn(className, "flex flex-nowrap items-center gap-1"),
            hasRemove: onClose ? "yes" : "no",
          })
        )}
        ref={ref}
        {...props}
      >
        {Icon ? <Icon {...iconProps} width={12} height={12} /> : null}
        <span>{children}</span>
        {onClose ? (
          <div
            role="button"
            onClick={onClose}
            onKeyDown={onClose}
            className="cursor-pointer rounded-full bg-secondary p-0.5 hover:bg-accent"
          >
            <XIcon width={12} height={12} />
          </div>
        ) : null}
      </div>
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }
