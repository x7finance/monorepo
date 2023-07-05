"use client"

import { Suspense, useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { MonitorIcon, MoonIcon, SunIcon } from "@x7/icons"
import { cn } from "@x7/utils"

export function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
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
          //
          className={cn(
            "relative flex max-w-max items-center rounded-full border border-zinc-200 p-1 dark:border-zinc-800"
          )}
          role="radiogroup"
        >
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark"
            className={cn(
              theme === "dark"
                ? "rounded-full bg-zinc-200 dark:bg-zinc-800"
                : "",
              "m-0 flex h-8 w-8 cursor-pointer items-center justify-center px-0"
            )}
            role="radio"
            type="button"
          >
            <span>
              <MoonIcon className="h-4 w-4" />
            </span>
          </button>
          <button
            onClick={() => setTheme("light")}
            aria-label="Light"
            className={cn(
              theme === "light"
                ? "rounded-full bg-zinc-200 dark:bg-zinc-800"
                : "",
              "m-0 flex h-8 w-8 cursor-pointer items-center justify-center px-0"
            )}
            role="radio"
            type="button"
          >
            <span>
              <SunIcon className="h-4 w-4" />
            </span>
          </button>
          <button
            onClick={() => setTheme("system")}
            aria-label="System"
            className={cn(
              theme === "system"
                ? "rounded-full bg-zinc-200 dark:bg-zinc-800"
                : "",
              "m-0 flex h-8 w-8 cursor-pointer items-center justify-center px-0"
            )}
            role="radio"
            type="button"
          >
            <span>
              <MonitorIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </Suspense>
  )
}
