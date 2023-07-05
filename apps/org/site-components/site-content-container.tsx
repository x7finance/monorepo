import type { HTMLAttributes } from "react"

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
    <div className={cn("mx-auto max-w-6xl", className)} {...props}>
      {children}
    </div>
  )
}
