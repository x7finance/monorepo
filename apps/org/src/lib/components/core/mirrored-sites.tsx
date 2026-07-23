"use client"

import Link from "next/link"

import { BoxesIcon, ExternalLinkIcon } from "@x7/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@x7/ui/dropdown-menu"

export function MirroredSites() {
  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label="View mirrored sites">
            <BoxesIcon
              aria-hidden="true"
              className="text-secondary-foreground h-4 w-4"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg bg-white p-4 text-zinc-800 shadow-lg dark:bg-zinc-800 dark:text-zinc-200">
          <div className="text-muted-foreground mb-2 max-w-[200px] text-[12px]">
            Available centralized (web2) and decentralized (web3) website
            mirrors.
          </div>

          <div className="mb-2">
            <div className="mb-1 text-[12px] text-zinc-500 dark:text-zinc-400">
              Centralized:
            </div>
            <DropdownMenuItem className="flex items-center py-1">
              <Link
                prefetch={true}
                href="https://www.x7finance.org"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
              >
                x7finance.org
              </Link>
              <ExternalLinkIcon className="ml-2 h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center py-1">
              <Link
                prefetch={true}
                href="https://alt.x7finance.org"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
              >
                x7finance.xyz
              </Link>
              <ExternalLinkIcon className="ml-2 h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </DropdownMenuItem>
          </div>

          <div>
            <div className="mb-1 text-[12px] text-zinc-500 dark:text-zinc-400">
              Decentralized (IPFS):
            </div>
            <DropdownMenuItem className="flex items-center py-1">
              <Link
                prefetch={true}
                href="https://x7.finance.eth.limo"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
              >
                x7.finance.eth.limo -{" "}
                <span className="text-[12px]">coming soon</span>
              </Link>
              <ExternalLinkIcon className="ml-2 h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center py-1">
              <Link
                prefetch={true}
                href="https://x7.finance.eth.link"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
              >
                x7.finance.eth.link -{" "}
                <span className="text-[12px]">coming soon</span>
              </Link>
              <ExternalLinkIcon className="ml-2 h-3 w-3 text-zinc-500 dark:text-zinc-400" />
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
