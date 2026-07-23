"use client"

import type { FC, ReactNode } from "react"
import { useState } from "react"

import { ArrowUpRightSquareIcon } from "@x7/icons"

import { CircleLoading } from "../circle-loading"
import { TimeAgo } from "../time-ago"

interface ToastContent {
  icon?: ReactNode
  summary: ReactNode | ReactNode[]
  code?: boolean
  href?: string
  type?: ToastTypes
  children?: ReactNode
}

export enum ToastTypes {
  INFO = "INFO",
  ERROR = "ERROR",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
}

export const ToastContent: FC<ToastContent> = ({
  href,
  summary,
  code = false,
  type = ToastTypes.INFO,
  children,
}) => {
  const [date] = useState(new Date())

  return (
    <div className="flex w-full flex-col gap-1 overflow-hidden">
      {!code ? (
        <>
          <span className="mb-1 inline-flex text-sm font-semibold text-zinc-900 dark:text-zinc-200">
            {type === ToastTypes.LOADING && (
              <CircleLoading containerClass="inline-flex mr-1" />
            )}
            {summary}
          </span>
          {href && (
            <a
              href={href}
              target="_blank"
              className="text-secondary-foreground flex items-center gap-2 text-sm font-medium"
              rel="noreferrer"
            >
              View on explorer{" "}
              <ArrowUpRightSquareIcon width={16} height={16} strokeWidth={2} />
            </a>
          )}
          <span className="text-muted-foreground text-[10px] font-medium">
            <TimeAgo value={date} />
          </span>
        </>
      ) : (
        <div className="scroll max-h-[80px] overflow-y-auto rounded-lg border border-zinc-200/10 bg-zinc-100 p-2 px-3 text-[10px] break-all text-zinc-900 dark:bg-black/20 dark:text-zinc-200">
          <code>{summary}</code>
        </div>
      )}
      {children}
    </div>
  )
}
