"use client"

import * as React from "react"

export function getStrictContext<T>(
  name: string,
  defaultValue?: T
): [React.Provider<T | null>, () => T] {
  const Context = React.createContext<T | null>(defaultValue ?? null)
  Context.displayName = name

  function useSafeContext(): T {
    const context = React.useContext(Context)
    if (context === null) {
      throw new Error(`use${name} must be used within a ${name}Provider`)
    }
    return context
  }

  return [Context.Provider as React.Provider<T | null>, useSafeContext]
}
