import type { ChainId } from "@x7/utils"

import Link from "next/link"

import { InfoIcon } from "@x7/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@x7/ui/hover-card"
import { Table, TableBody, TableCell, TableRow } from "@x7/ui/table"
import { generateChainDenomination } from "@x7/utils"

interface StatusCardProps {
  title: string
  items: {
    label: React.ReactNode
    value: string | number
    useChainDenomination?: boolean
    hovercard?: {
      title: string
      description: string
      linkText: string
      href: string
    }
  }[]
  chainId: ChainId
  layout?: "vertical" | "horizontal"
}

export function StatusCard({
  title,
  items,
  chainId,
  layout = "vertical",
}: StatusCardProps) {
  if (layout === "horizontal") {
    return (
      <div className="my-4">
        <div className="border-muted bg-secondary grid grid-cols-3 gap-px overflow-hidden rounded-lg border">
          {items.map((item) => (
            <div key={item.label} className="bg-zinc-900 px-4 py-3">
              <div className="text-2xs flex items-center gap-1 leading-6 text-zinc-400 sm:text-xs">
                <span className="font-heading">{item.label}</span>
                {item.hovercard && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon width={16} height={16} />
                    </HoverCardTrigger>
                    <HoverCardContent className="z-1080 max-w-[320px] p-0!">
                      <CardHeader>
                        <CardTitle className="text-zinc-900 dark:text-zinc-100">
                          {item.hovercard.title}
                        </CardTitle>
                        <CardDescription className="prose">
                          <p>{item.hovercard.description}</p>
                          <Link
                            prefetch={true}
                            className="font-medium text-emerald-500 hover:underline"
                            target="_blank"
                            href={item.hovercard.href}
                          >
                            {item.hovercard.linkText} &rarr;
                          </Link>
                        </CardDescription>
                      </CardHeader>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
              <div className="flex items-baseline gap-x-2">
                <span className="text-lg font-semibold tracking-tight text-white sm:text-2xl">
                  {item.value}
                </span>
                <span className="sm:text-sm">
                  {item.useChainDenomination !== false
                    ? generateChainDenomination(chainId)
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-secondary overflow-hidden">
      <CardHeader className="bg-background">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.label}>
                <TableCell className="text-muted-foreground text-sm">
                  {item.label}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-foreground text-base font-bold">
                    {item.value}{" "}
                    <span className="text-sm font-normal">
                      {item.useChainDenomination !== false
                        ? generateChainDenomination(chainId)
                        : ""}
                    </span>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
