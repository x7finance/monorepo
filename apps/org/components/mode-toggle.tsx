"use client"

import { cn } from "utils"

import * as React from "react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <React.Suspense>
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
              <svg
                fill="none"
                height={16}
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width={16}
                style={{ color: "currentcolor" }}
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
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
              <svg
                fill="none"
                height={16}
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width={16}
                style={{ color: "currentcolor" }}
              >
                <circle cx={12} cy={12} r={5} />
                <path d="M12 1v2" />
                <path d="M12 21v2" />
                <path d="M4.22 4.22l1.42 1.42" />
                <path d="M18.36 18.36l1.42 1.42" />
                <path d="M1 12h2" />
                <path d="M21 12h2" />
                <path d="M4.22 19.78l1.42-1.42" />
                <path d="M18.36 5.64l1.42-1.42" />
              </svg>
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
              <svg
                fill="none"
                height={16}
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width={16}
                style={{ color: "currentcolor" }}
              >
                <rect x={2} y={3} width={20} height={14} rx={2} ry={2} />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </React.Suspense>
  )
}
