import { cn } from "@x7/css"

export function Prose({
  as: Component = "div",
  className,
  ...props
}: {
  as?: React.ElementType
  className?: string
  [key: string]: unknown
}) {
  return (
    <Component
      className={cn(className, "prose text-wrap break-words dark:prose-invert")}
      {...props}
    />
  )
}
