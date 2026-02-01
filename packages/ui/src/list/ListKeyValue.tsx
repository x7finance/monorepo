import type { FC, ReactNode } from "react"

import { cn } from "@x7/css"

import { SkeletonText } from "../skeleton"

export type ListKeyValueProps =
  | {
      title: ReactNode
      subtitle?: string
      children: ReactNode
      skeleton?: never
      flex?: boolean
      className?: string
    }
  | {
      title?: never
      subtitle?: boolean
      children?: never
      skeleton?: boolean
      flex?: boolean
      className?: string
    }

export const ListKeyValue: FC<ListKeyValueProps> = ({
  title,
  subtitle,
  children,
  skeleton,
  flex = false,
  className = "",
}) => {
  if (skeleton) {
    return (
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <SkeletonText fontSize="sm" />
          {subtitle && <SkeletonText fontSize="xs" />}
        </div>
        <div className="flex justify-end">
          <SkeletonText fontSize="sm" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        className,
        flex ? "flex items-center justify-between" : "grid grid-cols-2",
        "gap-2 px-4 py-3"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
      <div className="flex justify-end">
        <span className="flex w-full justify-end truncate text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {children}
        </span>
      </div>
    </div>
  )
}
