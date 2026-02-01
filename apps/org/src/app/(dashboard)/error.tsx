"use client"

import { useEffect } from "react"

import { AlertTriangleIcon, RefreshCwIcon } from "@x7/icons"
import { ErrorDisplay } from "@x7/ui"
import { Button } from "@x7/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard Error:", error)
  }, [error])

  return (
    <ErrorDisplay>
      <ErrorDisplay.Icon icon={AlertTriangleIcon} variant="error" />
      <ErrorDisplay.Title>Dashboard Error</ErrorDisplay.Title>
      <ErrorDisplay.Message
        error={error}
        fallback="Failed to load dashboard data."
      />
      <ErrorDisplay.Digest digest={error.digest} />
      <ErrorDisplay.Actions>
        <Button onClick={reset} variant="default" icon={RefreshCwIcon}>
          Retry
        </Button>
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          variant="outline"
        >
          Dashboard home
        </Button>
      </ErrorDisplay.Actions>
    </ErrorDisplay>
  )
}
