import type { Token } from "@x7/utils"
/* oxlint-disable @typescript-eslint/unbound-method */
import type { FC } from "react"

import React, { useCallback, useState } from "react"

import { Button } from "../button"
import { CurrencyIcon } from "../currency/currency-icon"

interface TokenSelectorImportRow {
  currencies: (Token | undefined)[]
  onImport(): void
}

export const TokenSelectorImportRow: FC<TokenSelectorImportRow> = ({
  currencies,
  onImport,
}) => {
  const [_open, setOpen] = useState(false)

  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])

  return (
    <div className="relative h-[64px] py-0.5">
      <div className="flex h-full w-full items-center rounded-lg px-3 hover:bg-background focus:bg-accent">
        {currencies[0] ? (
          <div className="flex grow flex-row items-center gap-4">
            <div className="h-10 w-10">
              <CurrencyIcon
                disableLink
                currency={currencies[0]}
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-zinc-900 group-hover:text-zinc-900 dark:text-zinc-50 dark:group-hover:text-white">
                {currencies[0].symbol}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 dark:group-hover:text-blue-100">
                {currencies[0].name}
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col">
          <Button onClick={onClick} variant="primary" size="xs">
            Import
          </Button>
        </div>
      </div>
    </div>
  )
}
