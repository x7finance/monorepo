"use client"

import { useEffect } from "react"

/**
 * Dark mode initializer component.
 * The HTML element already has className="dark" as the default (server-rendered).
 * This component reads the user's preference from localStorage and applies it client-side.
 * No <script> tag is rendered, avoiding React 19's script tag warning and hydration mismatches.
 */
export function DarkModeInit(): null {
  useEffect(() => {
    const STORAGE_KEY = "darkmode"
    const mode = localStorage.getItem(STORAGE_KEY) ?? "system"
    const html = document.documentElement

    function applyMode(m: string): void {
      const isDark =
        m === "dark" ||
        (m === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      if (isDark) {
        html.classList.add("dark")
      } else {
        html.classList.remove("dark")
      }
      html.setAttribute("data-m", m)
      html.setAttribute("data-rm", isDark ? "dark" : "")
    }

    applyMode(mode)

    // Listen for system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (): void => {
      const currentMode = localStorage.getItem(STORAGE_KEY) ?? "system"
      if (currentMode === "system") {
        applyMode("system")
      }
    }
    mq.addEventListener("change", handleChange)

    // Listen for cross-tab changes
    const handleStorage = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY && e.newValue) {
        applyMode(e.newValue)
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      mq.removeEventListener("change", handleChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  return null
}
