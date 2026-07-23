/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import { cn } from "@x7/css"

interface Style {
  container: string
  title: string
  body: string
}

type Styles = Record<string, Style>

const styles: Styles = {
  note: {
    container:
      "bg-violet-50 dark:bg-zinc-800/30 dark:ring-1 dark:ring-zinc-300/10",
    title: "text-violet-900 dark:text-violet-100",
    body: "dark:text-violet-800 text-zinc-800 [--tw-prose-background:var(--color-violet-50)] prose-a:text-violet-500 prose-code:text-violet-900 dark:text-zinc-300 dark:prose-code:text-zinc-300",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-zinc-800/60 dark:ring-1 dark:ring-zinc-300/10",
    title: "text-amber-900 dark:text-amber-500",
    body: "text-amber-800 [--tw-prose-underline:var(--color-amber-400)] [--tw-prose-background:var(--color-amber-50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-zinc-300 dark:[--tw-prose-underline:var(--color-violet-700)] dark:prose-code:text-zinc-300",
  },
}

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: string
  title: string
  children: React.JSX.Element
}) {
  return (
    <div className={cn("my-8 flex rounded-3xl p-6", styles[type]!.container)}>
      <div className="ml-4 flex-auto">
        <p
          className={cn(
            "font-display m-0 text-xl font-medium",
            styles[type]!.title
          )}
        >
          {title}
        </p>
        <div className={cn("prose mt-2.5", styles[type]!.body)}>{children}</div>
      </div>
    </div>
  )
}
