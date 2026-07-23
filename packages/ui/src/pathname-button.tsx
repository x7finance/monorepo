"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { forwardRef } from "react"

import type { ButtonProps } from "./button"
import { Button } from "./button"

interface PathnameButton extends Omit<ButtonProps, "variant"> {
  pathname: string
  pathSelector: string
  activeTab: string | null
  defaultTab?: string
}

const PathnameButton = forwardRef<HTMLButtonElement, PathnameButton>(
  ({ pathname, pathSelector, activeTab, defaultTab, ...props }, ref) => {
    const _pathname = usePathname()
    const params = useSearchParams()

    const tab = params.get(pathSelector) ?? defaultTab

    const isActive = _pathname === pathname && tab === activeTab

    return (
      <Button
        ref={ref}
        {...props}
        className="border-0"
        variant={isActive ? "default" : "ghost"}
      />
    )
  }
)

PathnameButton.displayName = "PathnameButton"

export { PathnameButton }
