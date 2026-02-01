import Link from "next/link"
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import React from "react"

import { ChevronDownIcon, Glyph, IconWrapper } from "@x7/icons"
import { Button } from "@x7/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@x7/ui/dropdown-menu"
import { ChainId, ChainNameEnum, ChainScannerEnum } from "@x7/utils"
import { BLOCK_EXPLORER_PREFIXES } from "~/lib/utils/getExplorerLink"

interface Chain {
  name: ChainNameEnum
  id: ChainId
  icon: React.ReactElement
  scanner: ChainScannerEnum
  scannerLink: string
}

export const ChainsArray: Chain[] = [
  {
    name: ChainNameEnum.base,
    id: ChainId.BASE,
    icon: <IconWrapper glyph={Glyph.base} size={5} />,
    scanner: ChainScannerEnum.base,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.BASE]!,
  },
  {
    name: ChainNameEnum.base_testnet,
    id: ChainId.BASE_TESTNET,
    icon: <IconWrapper glyph={Glyph.base} size={5} />,
    scanner: ChainScannerEnum.base,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.BASE_TESTNET]!,
  },
  {
    name: ChainNameEnum.eth,
    id: ChainId.ETHEREUM,
    icon: <IconWrapper glyph={Glyph.ethereum} size={5} />,
    scanner: ChainScannerEnum.eth,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.ETHEREUM]!,
  },
  {
    name: ChainNameEnum.eth_testnet,
    id: ChainId.ETHEREUM_TESTNET,
    icon: <IconWrapper glyph={Glyph.ethereum} size={5} />,
    scanner: ChainScannerEnum.eth,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.ETHEREUM_TESTNET]!,
  },
  {
    name: ChainNameEnum.bsc,
    id: ChainId.BSC,
    icon: <IconWrapper glyph={Glyph.bsc} size={5} />,
    scanner: ChainScannerEnum.bsc,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.BSC]!,
  },
  {
    name: ChainNameEnum.polygon,
    id: ChainId.POLYGON,
    icon: <IconWrapper glyph={Glyph.polygon} size={5} />,
    scanner: ChainScannerEnum.polygon,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.POLYGON]!,
  },
  {
    name: ChainNameEnum.arbitrum,
    id: ChainId.ARBITRUM,
    icon: <IconWrapper glyph={Glyph.arbitrum} size={5} />,
    scanner: ChainScannerEnum.arbitrum,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.ARBITRUM]!,
  },
  {
    name: ChainNameEnum.optimism,
    id: ChainId.OPTIMISM,
    icon: <IconWrapper glyph={Glyph.optimism} size={5} />,
    scanner: ChainScannerEnum.optimism,
    scannerLink: BLOCK_EXPLORER_PREFIXES[ChainId.OPTIMISM]!,
  },
]

export function Dropdown({
  name,
  label,
  type,
  contract,
}: {
  name: string
  label: string
  type: string
  contract: string
}) {
  return (
    <DropdownMenu modal={false} key={`${name}-dropdown`}>
      <DropdownMenuTrigger className="focus-within:outline-0">
        <Button
          icon={() => <ChevronDownIcon className="h-4 w-4" />}
          iconPosition="end"
          size={"xs"}
          variant={type === "trade" ? "default" : "outline"}
          aria-label={label}
        >
          {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="text-foreground relative w-40 bg-zinc-100 dark:bg-zinc-900"
      >
        <DropdownMenuGroup className="text-muted-foreground">
          {ChainsArray.map((c, id) => {
            return (
              <DropdownMenuItem asChild key={`${id}-${type}-${c.scanner}`}>
                <Link
                  prefetch={true}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={generateLink(c, type, contract)}
                  className="flex cursor-pointer flex-col items-start! gap-2"
                >
                  <div className="flex items-center gap-1 leading-none font-medium">
                    {c.icon}
                    <span className="ml-2">{c.name}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function generateLink(c: Chain, type: string, contract: string) {
  switch (type) {
    case "xchange":
      return `/swap?token0=NATIVE&token1=${contract}`
    case "address":
      return `${c.scannerLink}/address/${contract}`
    case "token":
      return `${c.scannerLink}/token/${contract}`
    case "mint":
      return `/fund`
    default:
      return ""
  }
}
