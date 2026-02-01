/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { ChainId } from "@x7/utils"
import type { FC } from "react"

import { useAccount } from "wagmi"

import { cn } from "@x7/css"
import { buttonVariants } from "@x7/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { LinkInternal } from "@x7/ui/link"
import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency"

export const Hero: FC = () => {
  const { chain } = useAccount()

  const chainId = chain?.id as ChainId

  const { symbol } = useNativeCurrency({ chainId })

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 p-3 sm:p-6">
        <CardTitle tag={"h1"} className="text-zinc-900 dark:text-zinc-100">
          Fund Lending
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Wrap {symbol.toString() ?? "ETH"} and receive X7Deposit ({symbol}).
          Fully backed & redeemable 1:1 for {symbol.toString() ?? "ETH"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 px-3 sm:px-6">
        <div className="flex w-full flex-col gap-4 sm:w-[unset] sm:flex-row">
          <div className="flex w-full max-w-sm items-center">
            <LinkInternal
              prefetch={true}
              href="/docs/guides/lending"
              target="_blank"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full flex-1 cursor-pointer sm:w-[unset] sm:flex-0"
              )}
            >
              Learn more about X7 lending
            </LinkInternal>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
