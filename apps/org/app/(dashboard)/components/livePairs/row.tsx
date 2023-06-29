"use client"

import { BlockchainType, XCHANGE } from "common"
import {
  cn,
  generateChainBase,
  generateChainDenomination,
  generateChainIdentifier,
} from "utils"
import { buttonVariants } from "ui-server"
import { IconWrapper } from "icons"

import Link from "next/link"

import { useXchangeTokenData } from "@/lib/hooks/useXchangeTokenData"
import { Loading } from "@/components/loading"
import { ContractCopy } from "@/components/ui-client/contractCopy"
import { XchangeButton } from "@/components/xchange-button"

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
          <div className="font-medium text-zinc-900 dark:text-zinc-100 w-full">
            <>{tokenSymbol ? tokenSymbol : <Loading />}</>
            <div className="relative inline-block ml-2 top-1 lg:hidden">
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
            <div className="inline-block float-right lg:hidden">
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
          <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
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
            <span className="pl-1">
              {generateChainDenomination(chainId as BlockchainType)}
            </span>
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
