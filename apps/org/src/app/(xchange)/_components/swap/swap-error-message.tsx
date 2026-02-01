import { AlertCircleIcon } from "@x7/icons"
import { Alert, AlertDescription, AlertTitle } from "@x7/ui/alert"

export function SwapErrorMessage({
  error,
}: {
  error: { message: string } | null | undefined
}) {
  if (!error) {
    return null
  }

  return (
    <Alert
      className="my-1 max-h-48 max-w-lg overflow-hidden"
      variant="destructive"
    >
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || "Unknown error occurred in swap, try again"}
      </AlertDescription>
    </Alert>
  )
}
