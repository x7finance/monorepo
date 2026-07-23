/* oxlint-disable @typescript-eslint/unbound-method */
"use client"

import type { FC, ReactNode } from "react"
import { useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@x7/ui/dialog"
import type { ChainId, Currency, Token } from "@x7/utils"
import { TokenListContent } from "~/lib/components/utils/token-list-content"

interface TokenSelectorProps {
  id: string
  selected: Currency | undefined
  chainId: ChainId
  onSelect(currency: Currency): void
  children: ReactNode
  currencies?: Record<string, Token>
  includeNative?: boolean
  hidePinnedTokens?: boolean
  hideSearch?: boolean
}

export const TokenSelectorDialog: FC<TokenSelectorProps> = ({
  includeNative = true,
  id,
  selected,
  onSelect,
  chainId,
  currencies,
  hidePinnedTokens,
  hideSearch,
  children,
}) => {
  const [open, setOpen] = useState(false)

  // Memoize the props to ensure they are stable
  const tokenListProps = useMemo(
    () => ({
      open,
      setOpen,
      includeNative,
      id,
      selected,
      onSelect,
      chainId,
      currencies,
      hidePinnedTokens,
      hideSearch,
    }),
    [
      open,
      includeNative,
      id,
      selected,
      onSelect,
      chainId,
      currencies,
      hidePinnedTokens,
      hideSearch,
    ]
  )

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex! max-h-[85vh] min-h-[420px] flex-col justify-start overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>
            from the default list or search for a token by symbol or address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <TokenListContent {...tokenListProps} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
