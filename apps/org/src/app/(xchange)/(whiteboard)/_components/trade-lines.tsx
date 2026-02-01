"use client"

import { cn } from "@x7/css"
import { buttonVariants } from "@x7/ui/button"
import { LinkInternal } from "@x7/ui/link"

const TRADEABLE_TOKENS = [
  {
    name: "X7R",
    description: "Deflationary rewards token",
    address: "0x70008F18Fc58928dcE982b0A69C2c21ff80Dca54",
  },
  {
    name: "X7DAO",
    description: "Governance token",
    address: "0x7105E64bF67ECA3Ae9b123F0e5Ca2b83b2eF2dA0",
  },
  {
    name: "X7101",
    description: "Constellation token",
    address: "0x7101a9392EAc53B01e7c07ca3baCa945A56EE105",
  },
  {
    name: "X7102",
    description: "Constellation token",
    address: "0x7102DC82EF61bfB0410B1b1bF8EA74575bf0A105",
  },
  {
    name: "X7103",
    description: "Constellation token",
    address: "0x7103eBdbF1f89be2d53EFF9B3CF996C9E775c105",
  },
  {
    name: "X7104",
    description: "Constellation token",
    address: "0x7104D1f179Cc9cc7fb5c79Be6Da846E3FBC4C105",
  },
  {
    name: "X7105",
    description: "Constellation token",
    address: "0x7105FAA4a26eD1c67B8B2b41BEc98F06Ee21D105",
  },
  {
    name: "X7D",
    description: "Deposit token",
    address: "0x7D000a1B9439740692F8942A296E1810955F5000",
  },
]

export function TradeLines() {
  return (
    <div className="mt-8 w-full divide-y divide-zinc-800">
      {TRADEABLE_TOKENS.map((token) => (
        <div
          key={token.name}
          className="flex items-center justify-between px-4 py-4 transition-colors hover:bg-zinc-900/50"
        >
          <div className="flex flex-col">
            <span className="font-heading text-lg font-semibold text-white">
              Trade {token.name}
            </span>
            <span className="text-sm text-zinc-400">{token.description}</span>
          </div>
          <LinkInternal
            prefetch={true}
            href={`/swap?token0=NATIVE&token1=${token.address}`}
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Trade
          </LinkInternal>
        </div>
      ))}
    </div>
  )
}
