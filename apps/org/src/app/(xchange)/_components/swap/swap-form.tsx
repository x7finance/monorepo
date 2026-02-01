/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { Token } from "@x7/utils"

import React, { Suspense, useCallback, useEffect } from "react"
import { useAccount } from "wagmi"

import { Button } from "@x7/ui/button"
import { CurrencyInput } from "~/lib/components/utils/currency-input"
import { ApprovalState } from "~/lib/hooks/approvals/useTokenApproval"
import { useSwapState } from "~/lib/stores/swap"
import { Checker } from "~/lib/systems/Checker"
import { ApproveERC20 } from "~/lib/systems/Checker/ApproveERC20"

// import { SwapRecipientAddressDrawer } from "./(drawers)/swap-recipient-address-drawer";
import { useSwapFormLogic } from "./(hooks)/use-swap-form-logic"
import { SwapErrorMessage } from "./swap-error-message"
import { FlipSwapTokensButton } from "./swap-flip-button"
import { SimpleSwapTradeStats } from "./swap-stats"

const LazySwapChartPanelLiquiditySheet = React.lazy(() =>
  import("./(sheet)/swap-chart-liquidity-sheet").then((module) => ({
    default: module.SwapChartPanelLiquiditySheet,
  }))
)

interface X7SwapFormProps {
  token0?: Token
  token1?: Token
  actionText?: string
  defaultAmount?: number | null
  hideAction?: boolean
  onQuickBuySelect?: (amount: number) => void
}

const QUICK_BUY_AMOUNTS = [0.005, 0.01, 0.05, 0.1, 0.25]

export function X7SwapForm(props: X7SwapFormProps) {
  const {
    token0: _token0,
    token1: _token1,
    hideAction = false,
    defaultAmount,
    onQuickBuySelect,
  } = props

  const { address } = useAccount()
  const {
    state: {
      swapError,
      token0,
      token1,
      swapAmountString,
      swapAmount,
      route,
      token0Approval,
      chainId,
    },
    mutate: { setToken0, setToken1, setSwapAmount, switchTokens },
    loaders: { token0Loading, token1Loading, isQuoteLoading },
  } = useSwapState()

  const {
    refetchCount,
    isPending,
    swapActionAllowed,
    isWrap,
    isUnwrap,
    onExecute,
  } = useSwapFormLogic(
    _token0,
    _token1,
    token0 as Token | undefined,
    token1 as Token | undefined,
    route,
    swapAmountString
  )

  const handleSwitchTokens = useCallback(() => {
    switchTokens()
  }, [switchTokens])

  const renderApprovalButton = useCallback(() => {
    if (
      token0Approval.approval === ApprovalState.NOT_APPROVED &&
      parseFloat(`${swapAmountString}`) > 0 &&
      !token0?.isNative
    ) {
      return (
        <ApproveERC20
          id={"approve-swap-token-0"}
          amount={swapAmount}
          contract={token0Approval.address}
        />
      )
    }
    return null
  }, [token0Approval, swapAmountString, token0, swapAmount])

  useEffect(() => {
    if (_token0 && !token0?.equals(_token0)) {
      setToken0(_token0)
    }
    if (_token1 && !token1?.equals(_token1)) {
      setToken1(_token1)
    }
  }, [token0, _token0, token1, _token1])

  const renderSwapButton = useCallback(() => {
    if (hideAction) {
      return null
    }

    return (
      <Checker.Amounts chainId={chainId} amounts={[swapAmount]}>
        <Button
          type="button"
          size={"lg"}
          variant={"primary"}
          disabled={!swapActionAllowed || isPending}
          onClick={onExecute}
        >
          {!address
            ? "Connect to Swap"
            : isPending
              ? "Confirm in Wallet..."
              : isWrap
                ? "Wrap"
                : isUnwrap
                  ? "Unwrap"
                  : "Swap"}
        </Button>
      </Checker.Amounts>
    )
  }, [
    hideAction,
    chainId,
    swapAmount,
    swapActionAllowed,
    isPending,
    onExecute,
    address,
    isWrap,
    isUnwrap,
  ])

  return (
    <div className="mb-8 grid w-full gap-1">
      <CurrencyInput
        id="swap-from"
        type="INPUT"
        className="w-full rounded-lg bg-white px-2 py-1 dark:bg-zinc-800"
        chainId={chainId}
        onSelect={setToken0}
        value={swapAmountString}
        onChange={setSwapAmount}
        currency={token0}
        loading={token0Loading}
        disabled={false}
        currencyLoading={token0Loading}
        disableInsufficientBalanceError={false}
        forceDisable={false}
        refetchCounter={refetchCount}
        actionType="Sell"
      />
      <FlipSwapTokensButton onClick={handleSwitchTokens} />
      <CurrencyInput
        id="swap-to"
        type="OUTPUT"
        disabled={false}
        className="w-full rounded-lg bg-white px-2 py-1 dark:bg-zinc-800"
        value={route?.quote.toExact() ?? ""}
        chainId={chainId}
        onSelect={setToken1}
        currency={token1}
        loading={token1Loading}
        fetching={isQuoteLoading}
        disableMaxButton
        currencyLoading={token1Loading}
        disableInsufficientBalanceError={true}
        forceDisable={false}
        refetchCounter={refetchCount}
        actionType="Buy"
      />
      <div className="mb-2">
        <div className="my-2 text-xs text-zinc-500">Quick Buy</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_BUY_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="xs"
              onClick={() => {
                setSwapAmount(amount.toString())
                onQuickBuySelect?.(amount)
              }}
              className={`flex-1 ${
                defaultAmount === amount
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {amount} ETH
            </Button>
          ))}
        </div>
      </div>
      {renderApprovalButton()}
      <SimpleSwapTradeStats />
      <SwapErrorMessage error={swapError ?? null} />
      {renderSwapButton()}
      <Suspense fallback={<div></div>}>
        <LazySwapChartPanelLiquiditySheet
          route={route}
          token0={token0}
          token1={token1}
        />
      </Suspense>
    </div>
  )
}
