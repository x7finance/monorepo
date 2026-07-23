"use client"

import type { ChainId, LoanType } from "@x7/utils"
import { useLoanStartTime } from "~/lib/hooks/loans/useXchangeLoanData"

interface LoansCellProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
}

export function ILLCardDescription({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const loanStartTime = useLoanStartTime(
    tokenByIndex,
    chainId,
    loanType
  ).loanStartTime
  return <span>Loan Taken on {loanStartTime}</span>
}
