import React from "react"

import type { ChainId } from "@x7/utils"
import { formatAddress, generateChainIdentifier } from "@x7/utils"

import { CopyButton } from "./copy-button"

export function ContractCopy(props: { contract: string; chainId?: ChainId }) {
  const { contract, chainId } = props

  const formattedAddress = formatAddress(contract)

  const chainName = chainId ? generateChainIdentifier(chainId) : ""
  const displayName = `${chainName} CA:`

  return (
    <span className="flex items-center">
      <span className="text-2xs mr-1 text-[11px] font-bold text-zinc-600 uppercase dark:text-zinc-400">
        {displayName}
      </span>
      <span className="flex items-center">
        <span className="text-muted-foreground text-xs leading-5">
          <span className="sm:hidden">{formattedAddress}</span>
          <span className="hidden sm:inline">{contract}</span>
        </span>
        <span className="ml-2 flex items-center">
          <CopyButton size={4} content={contract} />
        </span>
      </span>
    </span>
  )
}
