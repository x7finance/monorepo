"use client";

import { useEffect } from "react";

import { AlertTriangleIcon, RefreshCwIcon } from "@x7/icons";
import { Button } from "@x7/ui/button";
import { ErrorDisplay } from "@x7/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MarketingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Marketing Error:", error);
  }, [error]);

  return (
    <ErrorDisplay>
      <ErrorDisplay.Icon icon={AlertTriangleIcon} variant="error" />
      <ErrorDisplay.Title>Page Error</ErrorDisplay.Title>
      <ErrorDisplay.Message error={error} fallback="We encountered an error loading this page." />
      <ErrorDisplay.Digest digest={error.digest} />
      <ErrorDisplay.Actions>
        <Button onClick={reset} variant="default" icon={RefreshCwIcon}>
          Try again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
        >
          Go home
        </Button>
      </ErrorDisplay.Actions>
    </ErrorDisplay>
  );
}
