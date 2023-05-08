import { cn } from "utils"

interface SiteContentContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
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
