import type { FC, ReactNode } from "react"

import { cn } from "@x7/css"

export interface ListLabelProps {
  children: ReactNode
  className?: string
}

export const ListLabel: FC<ListLabelProps> = ({ children, className }) => {
  return (
    <span
      className={cn(
        className,
        "flex justify-start px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400"
      )}
    >
      {children}
    </span>
  )
}
