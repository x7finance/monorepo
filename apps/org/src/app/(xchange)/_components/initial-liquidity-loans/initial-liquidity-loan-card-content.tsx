"use client"

import type { ChainId, LoanType } from "@x7/utils"

import { generateChainDenomination } from "@x7/utils"
import { useLoanAmount } from "~/lib/hooks/loans/useXchangeLoanData"

interface LoansCellProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
}

export function ILLCardContent({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const loanAmount = useLoanAmount(tokenByIndex, chainId, loanType).loanAmount
  return (
    <>
      <div className="text-center">
        {loanAmount}
        <span className="pl-1">{generateChainDenomination(chainId)}</span>
      </div>
      <p className="text-center text-sm text-muted-foreground">Loan Amount</p>
    </>
  )
}
