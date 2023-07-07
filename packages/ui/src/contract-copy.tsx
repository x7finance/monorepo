"use client"

import { CopyButton } from "./copy-button"

export function ContractCopy(props: { contract: string; name?: string }) {
  const { contract, name = "Contract" } = props

  return (
    <span className="flex items-center">
      <span className="mr-1 opacity-60">{name}:</span>
      <span className="flex items-center opacity-70">
        <span className="hidden sm:block">{contract}</span>
        <span className="relative top-0.5 ml-1 inline-block">
          <CopyButton title="" size={4} content={contract} />
        </span>
      </span>
    </span>
  )
}
