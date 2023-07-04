import { cn } from "@x7/utils"

export function Prose({ as: Component = "div", className, ...props }: any) {
  return (
    <Component
      className={cn(
        className,
        "prose dark:prose-invert",
        "xl:prose-p:text-lg prose-p:text-base prose-p:tracking-tight prose-p:leading-7 dark:prose-p:text-zinc-300 prose-p:text-zinc-800",
        "prose-li:text-lg prose-li:tracking-tight prose-li:font-medium prose-li:leading-7 dark:prose-li:text-zinc-300 prose-li:text-zinc-800"
      )}
      {...props}
    />
  )
}
