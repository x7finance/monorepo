"use client"

import type { FC } from "react"

import { Button } from "@x7/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@x7/ui/card"
import { LinkExternal, LinkInternal } from "@x7/ui/link"
import { SocialsEnum } from "@x7/utils"

export const Hero: FC = () => {
  return (
    <>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-1 p-3 sm:p-6">
          <CardTitle tag={"h1"} className="text-zinc-900 dark:text-zinc-100">
            Vote
          </CardTitle>
          <CardDescription>
            Own X7DAO to have your say on the future of the Ecosystem, Owners of
            500k X7DAO can create new proposals
          </CardDescription>
        </CardHeader>
        <div className="flex grow flex-col items-center gap-0 sm:gap-6 lg:items-start">
          <div className="flex w-full flex-col gap-4 sm:w-[unset] sm:flex-row">
            <div className="flex w-full items-center"></div>
          </div>
        </div>
      </Card>
      <div className="flex flex-col items-center gap-4 lg:items-end">
        <div className="flex flex-col items-center gap-1 lg:items-end">
          <span className="font-semibold lg:text-sm">What is X7 DAO?</span>
          <Button
            className="w-full flex-1 sm:w-[unset] sm:flex-0"
            variant="link"
            size="sm"
            asChild
          >
            <LinkInternal prefetch={true} href="/docs/whitepaper/governance">
              Whitepaper
            </LinkInternal>
          </Button>
          <div className="flex flex-col items-center gap-1 lg:items-end"></div>
        </div>
        <div className="flex flex-col items-center gap-1 lg:items-end">
          <span className="font-semibold lg:text-sm">Need Help?</span>
          <Button variant="link" size="sm" asChild>
            <LinkExternal href={SocialsEnum.telegram}>
              Main X7 Telegram
            </LinkExternal>
          </Button>
          <Button variant="link" size="sm" asChild>
            <LinkExternal href={SocialsEnum.daochat}>
              X7DAO Gated Telegram
            </LinkExternal>
          </Button>
        </div>
      </div>
    </>
  )
}
