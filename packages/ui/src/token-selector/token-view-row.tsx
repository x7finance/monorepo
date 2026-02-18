/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

import type { CSSProperties, FC, ReactElement } from "react"
import React, { memo, useCallback } from "react"

import { cn } from "@x7/css"
import {
  AlertCircleIcon,
  ArrowUpRightSquareIcon,
  CheckIcon,
  StarIcon,
} from "@x7/icons"
import type {
  CurrencyAmount,
  Currency as CurrencyType,
  Fraction,
} from "@x7/utils"
import { Chain, ZERO } from "@x7/utils"

import { Button } from "../button"
import { CurrencyIcon } from "../currency/currency-icon"
import { LinkExternal } from "../link"
import { SkeletonText } from "../skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"

export interface TokenViewRow {
  id: string
  account?: `0x${string}`
  currency: CurrencyType
  style?: CSSProperties
  className?: string
  onSelect(currency: CurrencyType): void
  balance?: CurrencyAmount<CurrencyType> | undefined
  showWarning: boolean
  price?: Fraction
  pin?: {
    isPinned: boolean
    onPin(): void
  }
  selected: boolean
  isBalanceLoading: boolean
}

export const TokenViewRow: FC<TokenViewRow> = memo(function TokenViewRow({
  price,
  balance,
  currency,
  style,
  className,
  onSelect,
  pin,
  selected,
  isBalanceLoading,
  showWarning,
}) {
  const onClick = useCallback(() => {
    onSelect(currency)
  }, [currency, onSelect])

  const onPin = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation()
      pin?.onPin()
    },
    [pin]
  )

  return (
    <div className="relative h-[64px] py-0.5" style={style}>
      <div
        onClick={onClick}
        onKeyDown={onClick}
        className={cn(
          className,
          selected ? "bg-muted" : "",
          `group hover:bg-background focus:bg-accent flex h-full w-full items-center rounded-lg px-3 token-${currency.symbol}`
        )}
      >
        <div className="flex grow cursor-pointer items-center justify-between gap-2 rounded-sm">
          <div className="flex grow flex-row items-center gap-4">
            {selected ? (
              <Badge
                position="bottom-right"
                badgeContent={
                  <div className="rounded-full bg-white dark:bg-zinc-800">
                    <CheckIcon
                      strokeWidth={4}
                      width={20}
                      height={20}
                      className="rounded-full border-2 border-white bg-blue-500 p-0.5 text-white dark:border-zinc-800"
                    />
                  </div>
                }
              >
                <div className="h-10 w-10">
                  <CurrencyIcon
                    disableLink
                    currency={currency}
                    width={40}
                    height={40}
                  />
                </div>
              </Badge>
            ) : (
              <div className="h-10 w-10">
                <CurrencyIcon
                  disableLink
                  currency={currency}
                  width={40}
                  height={40}
                />
              </div>
            )}
            <div className="flex flex-col items-start">
              <div className="flex gap-1">
                <span className="font-heading font-semibold text-zinc-900 group-hover:text-zinc-900 dark:text-zinc-50 dark:group-hover:text-white">
                  {currency.symbol}
                </span>
                {showWarning ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <AlertCircleIcon
                        width={20}
                        height={20}
                        className="text-zinc-300 dark:text-zinc-700"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Not on our default token list
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>

              <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground text-sm hover:underline">
                    {currency.name ?? currency.symbol}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-1"
                >
                  <LinkExternal
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${Chain.from(currency.chainId)?.getTokenUrl(
                      currency.wrapped.address
                    )}`}
                    className="flex items-center justify-center gap-1 text-sky-500 hover:underline"
                  >
                    Show on explorer{" "}
                    <ArrowUpRightSquareIcon width={16} height={16} />
                  </LinkExternal>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isBalanceLoading ? (
              <div className="flex min-w-[60px] flex-col">
                <SkeletonText className="w-[60px]" align="right" />
                <SkeletonText
                  fontSize="sm"
                  className="w-[20px]"
                  align="right"
                />
              </div>
            ) : (
              balance?.greaterThan(ZERO) && (
                <div className="flex max-w-[140px] flex-col">
                  <span
                    className={cn(
                      selected ? "font-semibold" : "font-medium",
                      "truncate text-right text-zinc-900 dark:text-zinc-50"
                    )}
                  >
                    {balance.toFixed(6)}
                  </span>
                  <span className="zinc text-right text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {price ? `$${balance.multiply(price).toFixed(2)}` : "-"}
                  </span>
                </div>
              )
            )}
            {pin && (
              <Button
                variant="ghost"
                name="pin"
                onClick={onPin}
                className={cn("z-10 hover:bg-zinc-100 dark:hover:bg-zinc-900")}
              >
                <StarIcon
                  className={cn(
                    pin.isPinned
                      ? "fill-sky-300 text-sky-300 dark:fill-sky-500 dark:text-sky-500"
                      : "text-zinc-300 dark:text-zinc-700",
                    "h-5 w-5"
                  )}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

interface Badge {
  badgeContent: ReactElement
  children: ReactElement
  className?: string
  position?: "top-left" | "bottom-right" | "top-right" | "bottom-left"
}

const Badge: FC<Badge> = ({
  badgeContent,
  position = "top-left",
  children,
  className,
}) => {
  return (
    <div className="relative">
      <div
        className={cn(
          className,
          "absolute z-10",
          position === "top-left"
            ? "-top-[15%] -left-1/4"
            : position === "bottom-right"
              ? "-right-1/4 -bottom-[15%]"
              : position === "top-right"
                ? "top-[15%] -right-1/4"
                : position === "bottom-left"
                  ? "-bottom-[15%] -left-1/4"
                  : ""
        )}
      >
        {badgeContent}
      </div>
      {children}
    </div>
  )
}
