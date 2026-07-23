"use client"

import { useEffect } from "react"

import { AlertTriangleIcon, RefreshCwIcon } from "@x7/icons"
import { ErrorDisplay } from "@x7/ui"
import { Button } from "@x7/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DocsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Docs Error:", error)
  }, [error])

  return (
    <ErrorDisplay>
      <ErrorDisplay.Icon icon={AlertTriangleIcon} variant="warning" />
      <ErrorDisplay.Title>Documentation Error</ErrorDisplay.Title>
      <ErrorDisplay.Message
        error={error}
        fallback="Failed to load documentation."
      />
      <ErrorDisplay.Digest digest={error.digest} />
      <ErrorDisplay.Actions>
        <Button onClick={reset} variant="default" icon={RefreshCwIcon}>
          Reload page
        </Button>
        <Button
          onClick={() => (window.location.href = "/docs")}
          variant="outline"
        >
          Docs home
        </Button>
      </ErrorDisplay.Actions>
    </ErrorDisplay>
  )
}
