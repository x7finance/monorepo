"use client"

import { useEffect } from "react"

import { AlertTriangleIcon, RefreshCwIcon } from "@x7/icons"
import { ErrorDisplay } from "@x7/ui"
import { Button } from "@x7/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function XchangeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Xchange Error:", error)
  }, [error])

  return (
    <ErrorDisplay>
      <ErrorDisplay.Icon icon={AlertTriangleIcon} variant="error" />
      <ErrorDisplay.Title>Something went wrong</ErrorDisplay.Title>
      <ErrorDisplay.Message
        error={error}
        fallback="An unexpected error occurred in the application."
      />
      <ErrorDisplay.Digest digest={error.digest} />
      <ErrorDisplay.Actions>
        <Button onClick={reset} variant="default" icon={RefreshCwIcon}>
          Try again
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Go home
        </Button>
      </ErrorDisplay.Actions>
    </ErrorDisplay>
  )
}
