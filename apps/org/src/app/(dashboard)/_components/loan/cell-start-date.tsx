"use client"

import type { ChainId, LoanType } from "@x7/utils"

import { formatDateTime } from "@x7/utils"
import { useLoanStartTime } from "~/lib/hooks/loans/useXchangeLoanData"

interface LoansCellProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
}

export function LoanCellStartDate({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const loanStartTime = useLoanStartTime(
    tokenByIndex,
    chainId,
    loanType
  ).loanStartTime
  return (
    <div className="">
      <span>{formatDateTime(loanStartTime)}</span>
    </div>
  )
}
