import { cn } from "@x7/utils"

export function Prose({ as: Component = "div", className, ...props }: any) {
  return (
    <Component
      className={cn(
        className,
        "prose dark:prose-invert",
        "prose-p:text-base prose-p:leading-7 prose-p:tracking-tight prose-p:text-zinc-800 dark:prose-p:text-zinc-300 xl:prose-p:text-lg",
        "prose-li:text-lg prose-li:font-medium prose-li:leading-7 prose-li:tracking-tight prose-li:text-zinc-800 dark:prose-li:text-zinc-300"
      )}
      {...props}
    />
  )
}
