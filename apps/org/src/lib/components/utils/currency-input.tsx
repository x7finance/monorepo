/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { FC } from "react"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useAccount } from "wagmi"

import { cn } from "@x7/css"
import { ChevronDownIcon } from "@x7/icons"
import { Button } from "@x7/ui/button"
import type { CurrencyInputProps } from "@x7/ui/currency/currency-balance-panel"
import { CurrencyBalancePanel } from "@x7/ui/currency/currency-balance-panel"
import { CurrencyIcon } from "@x7/ui/currency/currency-icon"
import { PricePanel } from "@x7/ui/currency/price-panel"
import { SkeletonBox } from "@x7/ui/skeleton"
import { TextField } from "@x7/ui/text-field"
import { LogCodes, Native, tryParseAmount } from "@x7/utils"
import { TokenSelectorDialog } from "~/lib/components/utils/token-selector-dialog"
import { useBalanceWeb3 } from "~/lib/hooks/balances/useBalanceWeb3"
import { usePrice } from "~/lib/hooks/prices/usePrice"
import { log } from "~/lib/utils/log"

export const CurrencyInput: FC<CurrencyInputProps> = ({
  id,
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  chainId,
  className,
  loading,
  usdPctChange,
  disableMaxButton = false,
  type,
  currencyLoading,
  currencies,
  allowNative = true,
  error,
  hidePinnedTokens = false,
  hideSearch = false,
  disableInsufficientBalanceError = false,
  fetching,
  forceDisable,
  refetchCounter,
  actionType,
}) => {
  const [localValue, setLocalValue] = useState<string>("")
  const { address } = useAccount()
  const [pending, startTransition] = useTransition()

  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useBalanceWeb3({
    chainId,
    account: address,
    currency,
  })

  useEffect(() => {
    if (refetchCounter && refetchCounter > 0) {
      void refetchBalance({
        cancelRefetch: true,
      })
    }
  }, [refetchCounter, refetchBalance])

  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId,
    currency,
  })

  const { data: nativePrice, isLoading: isNativePriceLoading } = usePrice({
    chainId,
    currency: Native.onChain(chainId),
  })

  const _value = useMemo(
    () => tryParseAmount(value, currency),
    [value, currency]
  )

  const insufficientBalance = useMemo(
    () =>
      address &&
      type === "INPUT" &&
      balance &&
      _value &&
      balance.lessThan(_value) &&
      !disableInsufficientBalanceError,
    [address, type, balance, _value, disableInsufficientBalanceError]
  )

  // If currency changes, trim input to decimals
  useEffect(() => {
    if (currency && onChange && value.includes(".")) {
      const [, decimals] = value.split(".")

      if (
        decimals &&
        currency.decimals !== undefined &&
        decimals.length > currency.decimals
      ) {
        onChange(Number(value).toFixed(currency.decimals))
      }
    }
  }, [onChange, currency, value])

  const isLoading =
    loading ||
    currencyLoading ||
    isBalanceLoading ||
    isPriceLoading ||
    isNativePriceLoading

  const _error = error ?? (insufficientBalance ? "Exceeds Balance" : undefined)

  const _onChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue)
      startTransition(() => {
        onChange?.(newValue)
      })
    },
    [onChange]
  )

  useEffect(() => {
    if (currency && chainId && currency.chainId !== chainId) {
      log.error(
        LogCodes.CURRENCY_INPUT_CHAIN_MISMATCH,
        `Selected token chainId not equal to passed chainId, impossible state. Currency chainId: ${currency.chainId}, chainId: ${chainId}`
      )
    }
  }, [currency, chainId])

  const selector = useMemo(() => {
    if (!onSelect) {
      return null
    }

    return (
      <TokenSelectorDialog
        id={`${id}-token-selector`}
        currencies={currencies}
        selected={currency}
        chainId={chainId}
        onSelect={onSelect}
        includeNative={allowNative}
        hidePinnedTokens={hidePinnedTokens}
        hideSearch={hideSearch}
      >
        <Button
          data-state={isLoading ? "inactive" : "active"}
          disabled={forceDisable}
          variant={currency ? "secondary" : "primary"}
          id={id}
          type="button"
          style={{ opacity: forceDisable ? 0.9 : 1 }}
          className={cn(
            currency
              ? "bg-zinc-200 p-0 text-xl text-zinc-800 hover:bg-zinc-300 data-[state=inactive]:opacity-30 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              : "",

            "font-heading h-9 rounded-full! border-0 data-[state=active]:flex"
          )}
        >
          {currency ? (
            <>
              <div className="mr-2 ml-1 h-[28px] w-[28px]">
                <CurrencyIcon
                  disableLink
                  currency={currency}
                  width={28}
                  height={28}
                />
              </div>
              {currency.symbol}
            </>
          ) : (
            <span className="text-lg">Select token</span>
          )}
          {!forceDisable && (
            <ChevronDownIcon strokeWidth={2} className="mx-1 h-5 w-5" />
          )}
        </Button>
      </TokenSelectorDialog>
    )
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    id,
    onSelect,
    currencies,
    currency,
    chainId,
    allowNative,
    hidePinnedTokens,
    hideSearch,
  ])

  const memoizedBalance = useMemo(() => balance, [balance])

  return (
    <div
      className={cn(
        "relative w-full space-y-1 overflow-hidden border border-zinc-300 pb-2 dark:border-zinc-700",
        className,
        _error ? "bg-red-500/40 dark:bg-red-900/60" : ""
      )}
    >
      <div
        data-state={fetching || isLoading ? "active" : "inactive"}
        className="absolute inset-0 overflow-hidden transition-all before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_.5s_infinite] before:bg-linear-to-r before:from-transparent before:via-zinc-900/[0.07] before:to-transparent data-[state=active]:block data-[state=inactive]:hidden dark:before:via-zinc-50/10"
      />
      {actionType && (
        <div className="mt-0! text-xs text-zinc-400">{actionType}</div>
      )}
      <div className="relative flex w-full items-center gap-4">
        <div
          data-state={isLoading || fetching ? "active" : "inactive"}
          className={cn(
            "data-[state=active]:block data-[state=inactive]:hidden",
            "absolute inset-0 -left-4 flex items-center justify-between gap-4 px-4"
          )}
        >
          <SkeletonBox className="h-[32px] w-24 rounded-lg" />
        </div>
        <div
          data-state={fetching || isLoading ? "inactive" : "active"}
          className="flex min-w-0 flex-1 items-center"
        >
          <TextField
            testdata-id={`${id}-input`}
            type="number"
            inputMode="decimal"
            variant="naked"
            disabled={disabled}
            onValueChange={_onChange}
            value={pending ? localValue : value}
            readOnly={disabled}
            maxDecimals={currency?.decimals}
            data-state={fetching || isLoading ? "inactive" : "active"}
            className={cn(
              "w-full p-0 py-1 text-3xl font-medium data-[state=inactive]:opacity-0 sm:text-3xl!"
            )}
          />
        </div>

        {selector}
        {!onSelect ? (
          <div
            id={`${id}-button`}
            className={cn(
              "flex items-center gap-1 rounded-full py-2 pr-2 pl-2 text-xl font-medium whitespace-nowrap"
            )}
          >
            {currency ? (
              <>
                <div className="mr-2 ml-1 h-[28px] w-[28px]">
                  <CurrencyIcon
                    disableLink
                    currency={currency}
                    width={28}
                    height={28}
                  />
                </div>
                {currency.symbol}
              </>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-500">
                No token selected
              </span>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex h-[36px] flex-row items-center justify-between">
        <PricePanel
          value={value}
          currency={currency}
          usdPctChange={usdPctChange}
          error={_error}
          loading={isPriceLoading}
          price={price}
          nativePrice={nativePrice}
        />
        <CurrencyBalancePanel
          id={id}
          loading={isBalanceLoading}
          chainId={chainId}
          account={address}
          onChange={onChange}
          currency={currency}
          disableMaxButton={disableMaxButton}
          balance={memoizedBalance}
          type={type}
        />
      </div>
    </div>
  )
}
