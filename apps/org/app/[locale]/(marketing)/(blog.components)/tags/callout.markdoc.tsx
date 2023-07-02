import { cn } from "utils"

const styles: any = {
  note: {
    container:
      "bg-violet-50 dark:bg-zinc-800/30 dark:ring-1 dark:ring-zinc-300/10",
    title: "text-violet-900 dark:text-violet-100",
    body: "dark:text-violet-800 text-zinc-800 [--tw-prose-background:theme(colors.violet.50)] prose-a:text-violet-500 prose-code:text-violet-900 dark:text-zinc-300 dark:prose-code:text-zinc-300",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-zinc-800/60 dark:ring-1 dark:ring-zinc-300/10",
    title: "text-amber-900 dark:text-amber-500",
    body: "text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-zinc-300 dark:[--tw-prose-underline:theme(colors.violet.700)] dark:prose-code:text-zinc-300",
  },
}

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: string
  title: string
  children: any
}) {
  return (
    <div className={cn("my-8 flex rounded-3xl p-6", styles[type].container)}>
      <div className="ml-4 flex-auto">
        <p
          className={cn(
            "font-display m-0 text-xl font-medium",
            styles[type].title
          )}
        >
          {title}
        </p>
        <div className={cn("prose mt-2.5", styles[type].body)}>{children}</div>
      </div>
    </div>
  )
}
