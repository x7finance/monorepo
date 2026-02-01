/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
"use client"

import type { ChainId, LoanType } from "@x7/utils"

import { Tag } from "@x7/ui/tag"
import { generateChainDenomination } from "@x7/utils"
import {
  useGetPremiumPaymentSchedule,
  useGetPrincipalPaymentSchedule,
  useGetTotalDue,
} from "~/lib/hooks/loans/useXchangeLoanData"

interface LoansCellProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
}

export function LoanCellDue({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const premiumPaymentSchedule = useGetPremiumPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType
  ).getPremiumPaymentSchedule

  const principalPaymentSchedule = useGetPrincipalPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType
  ).getPrincipalPaymentSchedule

  const totalDue = useGetTotalDue(
    tokenByIndex,
    chainId,
    loanType,
    premiumPaymentSchedule?.[premiumPaymentSchedule?.[0]?.length - 1],
    principalPaymentSchedule?.[principalPaymentSchedule?.[0]?.length - 1]
  ).getTotalDue
  return (
    <div className="flex items-center space-x-2">
      <div>
        <Tag variant="large" color="emerald">
          {totalDue.toFixed(6)} {generateChainDenomination(chainId)}
        </Tag>
      </div>
    </div>
  )
}
