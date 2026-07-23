"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

const STORAGE_KEY = "darkmode"

type Mode = "system" | "dark" | "light"
type ResolvedMode = "dark" | "light"

interface DarkModeState {
  mode: Mode
  resolvedMode: ResolvedMode
  setMode: (mode: Mode) => void
}

// Simple external store for dark mode state
let currentMode: Mode = "system"
let currentResolved: ResolvedMode = "dark"
const listeners = new Set<() => void>()

function getSystemMode(): ResolvedMode {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function resolve(mode: Mode): ResolvedMode {
  return mode === "system" ? getSystemMode() : mode
}

function applyMode(resolved: ResolvedMode): void {
  const html = document.documentElement
  if (resolved === "dark") {
    html.classList.add("dark")
  } else {
    html.classList.remove("dark")
  }
  html.setAttribute("data-rm", resolved)
}

function notify(): void {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): string {
  return `${currentMode}:${currentResolved}`
}

function getServerSnapshot(): string {
  return "system:dark"
}

let initialized = false

function initStore(): void {
  if (initialized || typeof window === "undefined") return
  initialized = true

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light" || stored === "system") {
    currentMode = stored
  }
  currentResolved = resolve(currentMode)

  // Listen for system theme changes
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  mq.addEventListener("change", () => {
    if (currentMode === "system") {
      currentResolved = getSystemMode()
      applyMode(currentResolved)
      notify()
    }
  })

  // Listen for cross-tab changes
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      const newMode = e.newValue as Mode
      currentMode = newMode
      currentResolved = resolve(newMode)
      applyMode(currentResolved)
      notify()
    }
  })
}

export function useDarkMode(): DarkModeState {
  initStore()

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  // Parse from snapshot
  const [mode, resolvedMode] = snapshot.split(":") as [Mode, ResolvedMode]

  const setMode = useCallback((newMode: Mode) => {
    currentMode = newMode
    currentResolved = resolve(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
    applyMode(currentResolved)
    notify()
  }, [])

  // Apply on mount
  useEffect(() => {
    applyMode(currentResolved)
  }, [])

  return { mode, resolvedMode, setMode }
}
