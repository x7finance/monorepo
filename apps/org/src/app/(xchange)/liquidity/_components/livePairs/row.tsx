"use client"

import { useChainId } from "wagmi"

import { cn } from "@x7/css"
import { ArrowUpRightIcon, Glyph, IconWrapper } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { CircleLoading } from "@x7/ui/circle-loading"
import { ContractCopy } from "@x7/ui/contract-copy"
import { LinkExternal, LinkInternal } from "@x7/ui/link"
import { Tag } from "@x7/ui/tag"
import type { ChainId } from "@x7/utils"
import { generateChainDenomination, generateChainIdentifier } from "@x7/utils"
import { useXchangeTokenData } from "~/lib/hooks/tokens/useXchangeTokenData"
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink"

interface PairsProps {
  id: number
  type:
    | "token"
    | "description"
    | "price"
    | "reserves"
    | "chart"
    | "scan"
    | "trade"
}

export function PairRow({ id, type }: PairsProps) {
  const chainId = useChainId() as ChainId
  const {
    tokenName,
    tokenSymbol,
    pairedTokenSymbol,
    tokenContract,
    tokenReserve,
    tokenPrice,
    contractAddress,
  } = useXchangeTokenData(id)

  switch (type) {
    case "token":
      return (
        <>
          <div className="flex w-full items-center font-medium text-zinc-900 dark:text-zinc-100">
            {String(tokenSymbol) || <CircleLoading />}
            <div className="ml-2 inline-block lg:hidden">
              <div className="flex items-center space-x-2">
                <div className="flex shrink-0 justify-center space-x-1">
                  <span className="text-muted-foreground text-xs">|</span>
                  <LinkExternal
                    href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                      chainId
                    )}/pair-explorer/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${contractAddress}-${id}-chart`}
                    className="flex items-center opacity-80 hover:opacity-100"
                  >
                    <IconWrapper glyph={Glyph.dextools} size={5} />{" "}
                    <span className="text-2xs text-muted-foreground/50 ml-1 font-bold uppercase">
                      DexTools
                    </span>
                  </LinkExternal>
                </div>
              </div>
            </div>
            <div className="ml-auto lg:hidden">
              <LinkInternal
                prefetch={true}
                href={`/swap?token0=NATIVE&token1=${tokenContract}`}
                target="_blank"
                rel="noopener noreferrer"
                key={`${tokenContract}-${id}-chart`}
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })
                )}
              >
                <span className="whitespace-nowrap">
                  Trade
                  <ArrowUpRightIcon className="inline-flex h-4 w-4" />
                </span>
              </LinkInternal>
            </div>
          </div>
          <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
            <span className="flex">
              <ContractCopy contract={tokenContract} />
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
          <div>
            <Tag variant="large" color="emerald">
              $
              {tokenReserve !== "-1" && !isNaN(parseFloat(`${tokenPrice}`))
                ? parseFloat(`${tokenPrice}`).toFixed(6)
                : "..."}
            </Tag>
          </div>
        </div>
      )
    case "reserves":
      return (
        <div className="flex items-center space-x-2">
          <div>
            <Tag variant="large" color="zinc">
              {tokenReserve !== "-1" ? tokenReserve : "..."}
              <span className="pl-1">{generateChainDenomination(chainId)}</span>
            </Tag>
          </div>
        </div>
      )
    case "chart":
      return (
        <div className="">
          <div className="flex items-center space-x-2">
            <div className="flex shrink-0 space-x-1">
              <LinkExternal
                href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                  chainId
                )}/pair-explorer/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                key={`${contractAddress}-${id}-chart`}
                className="flex h-full w-full items-center justify-center opacity-80 hover:opacity-100"
              >
                <IconWrapper glyph={Glyph.dextools} size={5} />
              </LinkExternal>
            </div>
          </div>
        </div>
      )
    case "scan":
      return (
        <div className="">
          <LinkExternal
            href={`${getExplorerLink(chainId, tokenContract, ExplorerDataType.ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${tokenContract}-${id}-chart`}
            className="text-xs opacity-80 hover:opacity-100"
          >
            <span>Scanner</span>
          </LinkExternal>
        </div>
      )
    case "trade":
      return (
        <div className="float-right pr-4">
          <div className="flex w-full justify-center">
            <LinkInternal
              prefetch={true}
              href={`/swap?token0=NATIVE&token1=${tokenContract}`}
              target="_blank"
              rel="noopener noreferrer"
              key={`${tokenContract}-${id}-chart`}
              className={cn(
                buttonVariants({
                  size: "xs",
                  variant: "secondary",
                })
              )}
            >
              <span className="whitespace-nowrap">
                Trade on Xchange{" "}
                <ArrowUpRightIcon className="inline-flex h-3 w-3" />
              </span>
            </LinkInternal>
          </div>
        </div>
      )
  }
}
