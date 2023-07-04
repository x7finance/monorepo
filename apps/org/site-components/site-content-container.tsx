import { HTMLAttributes } from "react"
import { cn } from "@x7/utils"

interface SiteContentContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SiteContentContainer({
  children,
  className,
  ...props
}: SiteContentContainerProps) {
  return (
    <div className={cn("max-w-6xl mx-auto", className)} {...props}>
      {children}
    </div>
  )
}
