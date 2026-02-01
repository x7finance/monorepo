"use client"

import { useMode } from "nextjs-darkmode/hooks"
import { Suspense, useEffect, useState } from "react"

import { cn } from "@x7/css"
import { MoonIcon, SunIcon } from "@x7/icons"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedMode, setMode } = useMode()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Suspense>
      <div className="mt-4 max-w-max">
        <div
          className={cn(
            "relative flex max-w-max items-center rounded-full border border-zinc-200 p-1 dark:border-zinc-800"
          )}
          role="radiogroup"
        >
          <button
            onClick={() => setMode("dark")}
            aria-label="Dark"
            className={cn(
              resolvedMode === "dark"
                ? "rounded-full bg-zinc-200 dark:bg-zinc-800"
                : "",
              "m-0 flex h-8 w-8 cursor-pointer items-center justify-center px-0"
            )}
            role="radio"
            aria-checked={resolvedMode === "dark"}
            type="button"
          >
            <span>
              <MoonIcon className="h-4 w-4" />
            </span>
          </button>
          <button
            // @ts-expect-error: todo fix
            onClick={() => setMode("light")}
            aria-label="Light"
            className={cn(
              // @ts-expect-error: todo fix
              resolvedMode === "light"
                ? "rounded-full bg-zinc-200 dark:bg-zinc-800"
                : "",
              "m-0 flex h-8 w-8 cursor-pointer items-center justify-center px-0"
            )}
            // @ts-expect-error: todo fix
            aria-checked={resolvedMode === "light"}
            role="radio"
            type="button"
          >
            <span>
              <SunIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </Suspense>
  )
}
