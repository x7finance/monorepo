"use client"

import type { ChainId, LoanType } from "@x7/utils"

import { useCanLiquidate } from "~/lib/hooks/loans/useXchangeLendingPoolData"
import {
  useLiquidationAmount,
  useLoanState,
} from "~/lib/hooks/loans/useXchangeLoanData"

import { IconAlerts } from "./icon-alerts"

interface LoansCellProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
}

export function LoanCellStatus({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const loanState = useLoanState(tokenByIndex, chainId, loanType).loanState
  const canLiquidate = useCanLiquidate(tokenByIndex, chainId).canLiquidate
  const liquidationAmount = useLiquidationAmount(
    tokenByIndex,
    chainId,
    loanType
  ).liquidationAmount

  return (
    <IconAlerts
      liquidationAmount={liquidationAmount}
      canLiquidate={canLiquidate}
      loanState={loanState}
      loanId={tokenByIndex}
      chainId={chainId}
    />
  )
}
