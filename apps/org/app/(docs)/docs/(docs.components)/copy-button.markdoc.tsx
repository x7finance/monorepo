"use client"

import { cn } from "utils"
import { ClipboardIcon } from "icons"

import { useEffect, useState } from "react"

export function CopyButton({ code }) {
  let [copyCount, setCopyCount] = useState(0)
  let copied = copyCount > 0

  useEffect(() => {
    if (copyCount > 0) {
      let timeout = setTimeout(() => setCopyCount(0), 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [copyCount])

  return (
    <button
      type="button"
      className={cn(
        "group/button top-2 right-2 absolute overflow-hidden rounded-full py-1 pl-2 pr-3 text-2xs font-medium opacity-80 backdrop-blur transition focus:opacity-100 group-hover:opacity-100",
        copied
          ? "bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/20"
          : "bg-white/5 hover:bg-white/7.5 dark:bg-white/2.5 dark:hover:bg-white/5"
      )}
      onClick={() => {
        window.navigator.clipboard.writeText(code).then(() => {
          setCopyCount((count) => count + 1)
        })
      }}
    >
      <span
        aria-hidden={copied}
        className={cn(
          "pointer-events-none flex items-center gap-0.5 text-zinc-400 transition duration-300",
          copied && "-translate-y-1.5 opacity-0"
        )}
      >
        <ClipboardIcon className="h-5 w-5 fill-zinc-500/20 stroke-zinc-500 transition-colors group-hover/button:stroke-zinc-400" />
        Copy Code
      </span>
      <span
        aria-hidden={!copied}
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center text-emerald-400 transition duration-300",
          !copied && "translate-y-1.5 opacity-0"
        )}
      >
        Copied!
      </span>
    </button>
  )
}
