import type { FC } from "react"

import { Card, CardDescription, CardHeader, CardTitle } from "@x7/ui/card"

export const Hero: FC = () => {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 p-3 sm:p-6">
        <CardTitle tag={"h1"} className="text-zinc-900 dark:text-zinc-100">
          Governance
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          The ethos of the protocol, is to trust no one, trust code, therefore
          the X7 DAO structure is built with code, not politics or fanfare.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
