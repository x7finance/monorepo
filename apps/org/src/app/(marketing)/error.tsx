"use client";

import { useEffect } from "react";

import { AlertTriangleIcon, RefreshCwIcon } from "@x7/icons";
import { Button } from "@x7/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MarketingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Marketing Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangleIcon className="h-8 w-8 text-red-500" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Page Error
        </h2>

        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          {error.message || "We encountered an error loading this page."}
        </p>

        {error.digest && (
          <p className="mb-4 font-mono text-xs text-zinc-500">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default" icon={RefreshCwIcon}>
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
