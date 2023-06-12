import { cn } from "utils"

import * as React from "react"
import { cva, VariantProps } from "class-variance-authority"

import { Loading } from "./loading"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "bg-primary border border-transparent hover:border-primary hover:text-primary text-primary-foreground hover:bg-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-muted hover:text-accent-foreground hover:border-muted-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        border:
          "bg-primary border border-white hover:border-primary hover:text-primary text-primary-foreground hover:bg-transparent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 rounded-md",
        lg: "h-12 px-6 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "start" | "end"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon,
      iconPosition = "start",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle = buttonVariants({ variant, size })

    const content = (
      <>
        {icon && iconPosition === "start" && (
          <span className="mr-2">{icon}</span>
        )}
        <span className={loading ? "opacity-0" : ""}>{children}</span>
        {icon && iconPosition === "end" && <span className="ml-2">{icon}</span>}
      </>
    )

    return (
      <button
        className={cn(
          baseStyle,
          loading ? "opacity-75 cursor-not-allowed" : "",
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        <span className="relative flex justify-center items-center">
          {content}
          {loading && <Loading size="md" className="absolute" />}
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
