import type { ActiveChainId, Currency } from "@x7/utils"
import type { ApprovalState } from "~/lib/hooks/approvals/useTokenApproval"

import { useMemo } from "react"
import { useChainId } from "wagmi"

import { X7ContractsEnum } from "@x7/sdk"

export interface LoanTermData {
  readonly address: `0x${string}`
  readonly id: string
  readonly name: string
  readonly description: string
  readonly leverage: string
  readonly loanOriginationFee: string
  readonly loanRetentionPremium: string
  readonly principalRepaymentCondition: string
  readonly principalRepaymentDuring: boolean
  readonly color: string
  readonly loanSize: {
    min: number
    max: number
  }
  readonly loanLength: {
    min: number
    max: number
  }
}

export interface TokenApprovals {
  approval: ApprovalState
  amount: bigint
  address: `0x${string}`
  token: Currency | undefined
}

export type LoanTermDataMap = Readonly<Record<string, LoanTermData>>

export const useLoanTerms = () => {
  const chainId = useChainId() as ActiveChainId

  const LOAN_TERMS: LoanTermDataMap = useMemo(
    () => ({
      // [X7ContractsEnum.X7InitialLiquidityLoanTerm001(chainId)]: {
      //   address: X7ContractsEnum.X7InitialLiquidityLoanTerm001(chainId),
      //   name: "Upfront",
      //   description:
      //     "Upfront simple loan, where all fees are paid at launch and one final payment due before the end of the loan term.",
      //   leverage: "4x",
      //   loanOriginationFee: "25% of borrowed capital (4x leverage)",
      //   loanRetentionPremium: "0%",
      //   principalRepaymentCondition:
      //     "100% of borrowed capital due by the end of the loan term",
      //   principalRepaymentDuring: false,
      //   color: "blue",
      // },
      // [X7ContractsEnum.X7InitialLiquidityLoanTerm003(chainId)]: {
      //   address: X7ContractsEnum.X7InitialLiquidityLoanTerm003(chainId),
      //   name: "Interest only",
      //   description:
      //     "Interest only loan, small up front cost requiring premium payment each period.",
      //   leverage: "6.66x",
      //   loanOriginationFee: "15% of borrowed capital (6.66x leverage)",
      //   loanRetentionPremium:
      //     "6.25% in premiums due by the end of each quarter of the loan term",
      //   principalRepaymentCondition:
      //     "100% of borrowed capital due by the end of the loan term",
      //   principalRepaymentDuring: false,
      //   color: "green",
      // },
      // [X7ContractsEnum.X7InitialLiquidityLoanTerm004(chainId)]: {
      //   address: X7ContractsEnum.X7InitialLiquidityLoanTerm004(chainId),
      //   name: "Simple Loan",
      //   description:
      //     "Upfront simple loan, where all fees are paid at launch and one final payment due before the end of the loan term.",
      //   leverage: "50x",
      //   loanOriginationFee: "2% of borrowed capital (50x leverage)",
      //   loanRetentionPremium: "0%",
      //   principalRepaymentCondition:
      //     "100% of borrowed capital due by the end of the loan term",
      //   principalRepaymentDuring: false,
      //   color: "yellow",
      // },
      [X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId)]: {
        address: X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId),
        id: "005",
        name: "Fixed Origination Fee",
        description:
          "Where all fees are paid at launch and one final payment due before the end of the loan term.",
        leverage: "100x",
        loanOriginationFee: "0.01 ether (contract default) (100x leverage)",
        loanRetentionPremium: "0%",
        principalRepaymentCondition:
          "100% of borrowed capital due by the end of the loan term",
        principalRepaymentDuring: false,
        color: "emerald",
        loanSize: {
          min: 0.5,
          max: 5,
        },
        loanLength: {
          min: 1,
          max: 28,
        },
      },
    }),
    [chainId]
  )

  return LOAN_TERMS
}
