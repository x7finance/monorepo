import { cn } from "@x7/utils"

export function Prose({ as: Component = "div", className, ...props }: any) {
  return (
    <Component
      className={cn(className, "prose dark:prose-invert")}
      {...props}
    />
  )
}
