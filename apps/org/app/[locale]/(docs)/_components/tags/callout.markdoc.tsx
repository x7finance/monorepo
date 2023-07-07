import type { ReactNode } from "react"
import React from "react"

import { cn } from "@x7/utils"

import { DocsIcon } from "../icons"

type CalloutType = "note" | "warning"

interface CalloutProps {
  type?: CalloutType
  title: string
  children: ReactNode
}

interface Styles {
  [key: string]: {
    container: string
    title: string
    body: string
  }
}

const styles: Styles = {
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

interface Icons {
  [key: string]: React.FunctionComponent<{ [key: string]: any }> | null
}

const icons: Icons = {
  note: (props) => <DocsIcon icon="lightbulb" {...props} />,
  warning: (props) => <DocsIcon icon="warning" color="amber" {...props} />,
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const IconComponent = icons[type] || null

  return (
    <div className={cn("my-8 flex rounded-3xl p-6", styles[type]?.container)}>
      {IconComponent && <IconComponent className="h-8 w-8 flex-none" />}
      <div className="ml-4 flex-auto">
        <p
          className={cn(
            "font-display m-0 text-xl font-medium",
            styles[type]?.title
          )}
        >
          {title}
        </p>
        <div className={cn("prose mt-2.5", styles[type]?.body)}>{children}</div>
      </div>
    </div>
  )
}
