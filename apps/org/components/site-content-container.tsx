import { cn } from "utils"

import { HTMLAttributes } from "react"

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
