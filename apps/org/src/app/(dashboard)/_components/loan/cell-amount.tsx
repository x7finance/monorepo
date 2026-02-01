"use client"

import type { ChainId, LoanType } from "@x7/utils"

import { Tag } from "@x7/ui/tag"
import { generateChainDenomination } from "@x7/utils"
import { useLoanAmount } from "~/lib/hooks/loans/useXchangeLoanData"

interface LoansCellProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
}

export function LoanCellAmount({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const loanAmount = useLoanAmount(tokenByIndex, chainId, loanType).loanAmount
  return (
    <div className="flex items-center space-x-2">
      <div>
        <Tag variant="large" color="emerald">
          {loanAmount} {generateChainDenomination(chainId)}
        </Tag>
      </div>
    </div>
  )
}
