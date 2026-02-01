"use client"

import { useEffect, useState } from "react"
import { useClipboard } from "use-clipboard-copy"

import { cn } from "@x7/css"
import { CheckIcon, ClipboardIcon } from "@x7/icons"

interface CopyButtonProps {
  content: string
  title?: string
  size?: number
  showText?: boolean
}

export function CopyButton({
  content,
  title = "Copy",
  size = 5,
  showText = false,
}: CopyButtonProps) {
  const [copyCount, setCopyCount] = useState(0)
  const copied = copyCount > 0

  const clipboard = useClipboard({
    onSuccess() {
      setCopyCount((count) => count + 1)
    },
  })

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopyCount(0), 1000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const buttonClasses = cn(
    "group inline-flex items-center justify-center",
    showText &&
      "rounded-full pl-2 pr-3 text-[11px] font-medium opacity-80 backdrop-blur-sm transition focus:opacity-100 group-hover:opacity-100",
    showText && copied
      ? "bg-emerald-400/10 font-bold ring-1 ring-inset ring-emerald-400/20 dark:font-medium"
      : showText &&
          "bg-white/5 ring-1 ring-black/40 hover:bg-white/7.5 dark:bg-white/5 dark:ring-white/20 dark:hover:bg-white/5"
  )

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={() => clipboard.copy(content)}
      title={showText ? undefined : title}
    >
      <span className="relative">
        <ClipboardIcon
          className={cn(
            `h-${size} w-${size} fill-zinc-500/20 stroke-zinc-500 transition-opacity duration-300 group-hover:stroke-zinc-400`,
            copied && "opacity-0"
          )}
        />
        {!showText && (
          <CheckIcon
            className={cn(
              `absolute inset-0 h-${size} w-${size} stroke-emerald-500 transition-opacity duration-300`,
              copied ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </span>
      {showText ? (
        <>
          <span
            aria-hidden={copied}
            className={cn(
              "ml-1 whitespace-nowrap text-zinc-600 transition duration-300 dark:text-zinc-400",
              copied && "-translate-y-1.5 opacity-0"
            )}
          >
            Copy {title}
          </span>
          <span
            aria-hidden={!copied}
            className={cn(
              "absolute inset-0 flex items-center justify-center text-emerald-600 transition duration-300 dark:text-emerald-400",
              !copied && "translate-y-1.5 opacity-0"
            )}
          >
            Copied!
          </span>
        </>
      ) : (
        <span className="sr-only text-[11px]">
          {copied ? "Copied!" : `Copy ${title}`}
        </span>
      )}
    </button>
  )
}
