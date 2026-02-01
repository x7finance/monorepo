import type { FC } from "react"

import { cn } from "@x7/css"
import { buttonVariants } from "@x7/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { LinkExternal } from "@x7/ui/link"

export const Hero: FC = () => {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-1 p-3 sm:p-6">
        <CardTitle tag={"h1"} className="text-zinc-900 dark:text-zinc-100">
          Xchange Create
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Launch your token on Xchange quickly, easily, and permissionlessly.
          Empower your project with immediate access to liquidity borrowing,
          allowing you to focus on growth while we handle the financial
          complexity.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 px-3 sm:px-6">
        <div className="flex w-full flex-col gap-4 sm:w-[unset] sm:flex-row">
          <div className="flex w-full max-w-sm items-center">
            <LinkExternal
              href="https://t.me/xchange_launcher_bot"
              target="_blank"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full flex-1 cursor-pointer sm:w-[unset] sm:flex-0"
              )}
            >
              Launch via Telegram
            </LinkExternal>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
