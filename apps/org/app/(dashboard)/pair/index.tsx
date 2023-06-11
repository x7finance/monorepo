"use client"

import { BlockchainType } from "common"
import {
  cn,
  generateChainBase,
  generateChainDenomination,
  generateChainIdentifier,
} from "utils"
import { ClipboardIcon, IconWrapper } from "icons"

import Link from "next/link"
import { useClipboard } from "use-clipboard-copy"

import { useXchangeTokenData } from "@/lib/hooks/useXchangeTokenData"
import { toast } from "@/components/ui-client/toast/use-toast"

interface PairsProps {
  id: number
  chainId: BlockchainType
}

export function Pair({ id, chainId }: PairsProps) {
  const {
    tokenName,
    tokenSymbol,
    pairedTokenSymbol,
    tokenContract,
    tokenReserve,
    tokenPrice,
  } = useXchangeTokenData(id, chainId)

  const clipboard = useClipboard({
    onSuccess() {
      return toast({
        title: "Success",
        description: "Contract Copied",
        variant: "success",
      })
    },
  })

  return (
    <tr key={id}>
      <td
        className={cn(
          id === 0 ? "" : "border-t border-transparent",
          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
        )}
      >
        <div className="font-medium text-zinc-900 dark:text-zinc-100">
          <>
            {tokenSymbol ? tokenSymbol : "Awaiting Liquidity..."}
            <div className="relative top-1 ml-2 inline-block lg:hidden">
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 space-x-1">
                  <Link
                    href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                      chainId as BlockchainType
                    )}/pair-explorer/${tokenContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${tokenContract}-${id}-chart`}
                    className="opacity-80 hover:opacity-100"
                  >
                    <IconWrapper glyph={IconWrapper.glyph.dextools} size={5} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        </div>
        <div className="mt-1 flex flex-col text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
          <span
            onClick={() => {
              clipboard.copy(tokenContract)
            }}
            className="flex cursor-pointer items-center opacity-70 hover:underline dark:opacity-50"
          >
            Contract
            <span className="ml-0.5">
              <ClipboardIcon
                className="inline-block h-4 w-4 "
                aria-hidden="true"
              />
              <span className="sr-only">Copy Contract</span>
            </span>
          </span>
        </div>
        {id !== 0 ? (
          <div className="bg-zinc-900/7.5 absolute -top-px left-6 right-0 h-px dark:bg-white/10" />
        ) : null}
      </td>

      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <span>{`${tokenName} / ${pairedTokenSymbol}`}</span>
        <span
          onClick={() => {
            clipboard.copy(tokenContract)
          }}
          className="flex cursor-pointer items-center opacity-70 hover:underline dark:opacity-50"
        >
          <>
            {tokenContract}
            <span className="ml-0.5">
              <ClipboardIcon
                className="inline-block h-4 w-4 "
                aria-hidden="true"
              />
              <span className="sr-only">Copy Contract</span>
            </span>
          </>
        </span>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "relative py-4 pl-1 pr-3 text-sm sm:pl-1"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <span className="pl-1">$</span>
            {tokenReserve !== -1 ? tokenPrice : ". . ."}
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            {tokenReserve !== -1 ? tokenReserve : ". . ."}
            <span className="pl-1">
              {generateChainDenomination(chainId as BlockchainType)}
            </span>
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <Link
              href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                chainId as BlockchainType
              )}/pair-explorer/${tokenContract}`}
              target="_blank"
              rel="noopener noreferrer"
              key={`${tokenContract}-${id}-chart`}
              className="flex h-full w-full items-center justify-center opacity-80 hover:opacity-100"
            >
              <IconWrapper glyph={IconWrapper.glyph.dextools} size={5} />
            </Link>
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <Link
          href={`${generateChainBase(chainId)}/address/${tokenContract}`}
          target="_blank"
          rel="noopener noreferrer"
          key={`${tokenContract}-${id}-chart`}
          className="opacity-80 hover:opacity-100"
        >
          <span>Scanner</span>
        </Link>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-t border-transparent",
          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
        )}
      >
        <div className="flex w-full justify-center">
          <Link
            href={`https://beta.x7.finance/#/swap?outputCurrency=${tokenContract}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${tokenContract}-${id}-chart`}
            className="inline-flex justify-center gap-0.5 overflow-hidden rounded-full bg-violet-400/20 px-3 py-1 text-sm font-medium text-violet-600 ring-1 ring-inset ring-violet-400/80 transition hover:bg-violet-400/70 hover:text-white hover:ring-violet-700 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20 dark:hover:bg-violet-400/10 dark:hover:text-violet-300 dark:hover:ring-violet-300"
          >
            <span className="whitespace-nowrap">
              <span>Trade</span>
              <span className="hidden xl:ml-1 xl:inline-block">on Xchange</span>
            </span>
          </Link>
        </div>
        {id !== 0 ? (
          <div className="bg-zinc-900/7.5 absolute -top-px left-0 right-6 h-px dark:bg-white/10" />
        ) : null}
      </td>
    </tr>
  )
}