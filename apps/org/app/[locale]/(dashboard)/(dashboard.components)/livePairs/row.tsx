"use client"

import Link from "next/link"
import { XchangeButton } from "@/site-components/xchange-button"

import type { BlockchainType } from "@x7/common"
import { XCHANGE } from "@x7/common"
import { Glyph, IconWrapper } from "@x7/icons"
// @ts-expect-error todo: fix this
import { buttonVariants } from "@x7/ui/button"
// @ts-expect-error todo: fix this
import { CircleLoading } from "@x7/ui/circle-loading"
// @ts-expect-error todo: fix this
import { ContractCopy } from "@x7/ui/copy-buttons"
import {
  cn,
  generateChainBase,
  generateChainDenomination,
  generateChainIdentifier,
} from "@x7/utils"

import { useXchangeTokenData } from "@/lib/hooks/useXchangeTokenData"

interface PairsProps {
  id: number
  chainId: BlockchainType
  type:
    | "token"
    | "description"
    | "price"
    | "reserves"
    | "chart"
    | "scan"
    | "trade"
}

export function PairRow({ id, chainId, type }: PairsProps) {
  const {
    tokenName,
    tokenSymbol,
    pairedTokenSymbol,
    tokenContract,
    tokenReserve,
    tokenPrice,
  } = useXchangeTokenData(id, chainId)

  switch (type) {
    case "token":
      return (
        <>
          <div className="w-full font-medium text-zinc-900 dark:text-zinc-100">
            <>{tokenSymbol ? tokenSymbol : <CircleLoading />}</>
            <div className="relative top-1 ml-2 inline-block lg:hidden">
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 space-x-1">
                  <Link
                    href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                      chainId
                    )}/pair-explorer/${tokenContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${tokenContract}-${id}-chart`}
                    className="opacity-80 hover:opacity-100"
                  >
                    <IconWrapper glyph={Glyph.dextools} size={5} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="float-right inline-block lg:hidden">
              <Link
                href={`${XCHANGE}/#/swap?outputCurrency=${tokenContract}`}
                target="_blank"
                rel="noopener noreferrer"
                key={`${tokenContract}-${id}-chart`}
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "default",
                  })
                )}
              >
                <XchangeButton forceXchange={true} />
              </Link>
            </div>
          </div>
          <div className="mt-1 flex flex-col text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
            <span className="flex">
              <ContractCopy name={"Contract"} contract={tokenContract} />
            </span>
          </div>
        </>
      )
    case "description":
      return (
        <>
          <span>{`${tokenName} / ${pairedTokenSymbol}`}</span>
          <ContractCopy contract={tokenContract} />
        </>
      )
    case "price":
      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <span className="pl-1">$</span>
            {tokenReserve !== "-1" ? tokenPrice : "..."}
          </div>
        </div>
      )
    case "reserves":
      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            {tokenReserve !== "-1" ? tokenReserve : "..."}
            <span className="pl-1">{generateChainDenomination(chainId)}</span>
          </div>
        </div>
      )
    case "chart":
      return (
        <div className="">
          <div className="flex items-center space-x-2">
            <div className="flex flex-shrink-0 space-x-1">
              <Link
                href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                  chainId
                )}/pair-explorer/${tokenContract}`}
                target="_blank"
                rel="noopener noreferrer"
                key={`${tokenContract}-${id}-chart`}
                className="flex h-full w-full items-center justify-center opacity-80 hover:opacity-100"
              >
                <IconWrapper glyph={Glyph.dextools} size={5} />
              </Link>
            </div>
          </div>
        </div>
      )
    case "scan":
      return (
        <div className="">
          <Link
            href={`${generateChainBase(chainId)}/address/${tokenContract}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${tokenContract}-${id}-chart`}
            className="opacity-80 hover:opacity-100"
          >
            <span>Scanner</span>
          </Link>
        </div>
      )
    case "trade":
      return (
        <div className="float-right pr-4">
          <div className="flex w-full justify-center">
            <Link
              href={`${XCHANGE}/#/swap?outputCurrency=${tokenContract}`}
              target="_blank"
              rel="noopener noreferrer"
              key={`${tokenContract}-${id}-chart`}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "default",
                })
              )}
            >
              <XchangeButton />
            </Link>
          </div>
        </div>
      )
  }
}
