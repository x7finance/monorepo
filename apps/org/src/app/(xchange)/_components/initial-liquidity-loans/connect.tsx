import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { ConnectionComponent } from "~/lib/components/utils/web3-connect-button"

export function ILLTableConnect() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="text-zinc-900 dark:text-zinc-100">
          Liquidity Loan Positions
        </CardTitle>
        <CardDescription>
          Connect to a wallet to view your loan history.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 p-4">
        <div className="mt-4 flex w-full flex-col">
          <ConnectionComponent />
        </div>
      </CardContent>
    </Card>
  )
}
