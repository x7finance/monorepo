"use client"

import { Suspense, useEffect, useState } from "react"
import { MonitorIcon, MoonIcon, SunIcon } from "@x7/icons"
import { cn } from "@x7/utils"
import { useTheme } from "next-themes"

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
      <div className="max-w-max mt-4">
        <div
          //
          className={cn(
            "flex items-center relative p-1 border border-zinc-200 dark:border-zinc-800 rounded-full max-w-max"
          )}
          role="radiogroup"
        >
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark"
            className={cn(
              theme === "dark"
                ? "bg-zinc-200 dark:bg-zinc-800 rounded-full"
                : "",
              "w-8 h-8 px-0 m-0 cursor-pointer flex justify-center items-center"
            )}
            role="radio"
            type="button"
          >
            <span>
              <MoonIcon className="w-4 h-4" />
            </span>
          </button>
          <button
            onClick={() => setTheme("light")}
            aria-label="Light"
            className={cn(
              theme === "light"
                ? "bg-zinc-200 dark:bg-zinc-800 rounded-full"
                : "",
              "w-8 h-8 px-0 m-0 cursor-pointer flex justify-center items-center"
            )}
            role="radio"
            type="button"
          >
            <span>
              <SunIcon className="w-4 h-4" />
            </span>
          </button>
          <button
            onClick={() => setTheme("system")}
            aria-label="System"
            className={cn(
              theme === "system"
                ? "bg-zinc-200 dark:bg-zinc-800 rounded-full"
                : "",
              "w-8 h-8 px-0 m-0 cursor-pointer flex justify-center items-center"
            )}
            role="radio"
            type="button"
          >
            <span>
              <MonitorIcon className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </Suspense>
  )
}
