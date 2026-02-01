import type { FC } from "react"

import { Button } from "@x7/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { LinkInternal } from "@x7/ui/link"
import { XchangeLinks } from "~/types/links"

export const Hero: FC = () => {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 p-3 sm:p-6">
        <CardTitle tag={"h1"} className="text-zinc-900 dark:text-zinc-100">
          Liquidity that works for you
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          When you add liquidity to a pool, you can receive a share of its
          trading volume and potentially snag extra rewards when there are
          incentives involved!
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 px-3 sm:px-6">
        <div className="flex w-full flex-col gap-4 sm:w-[unset] sm:flex-row">
          <div className="flex w-full max-w-sm items-center">
            <Button asChild className="w-full flex-1 sm:w-[unset] sm:flex-0">
              <LinkInternal href={`${XchangeLinks.Liquidity}?tab=add`}>
                I want to create a position
              </LinkInternal>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
