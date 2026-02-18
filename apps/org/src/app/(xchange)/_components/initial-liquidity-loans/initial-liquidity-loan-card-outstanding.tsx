import { Tag } from "@x7/ui/tag"
import type { ChainId, LoanType } from "@x7/utils"
import { PaymentButton } from "~/app/(dashboard)/_components/loan/payment-button"
import { useGetTotalDue } from "~/lib/hooks/loans/useXchangeLoanData"

interface ILLCardOutstandingAmountProps {
  tokenByIndex: number
  chainId: ChainId
  loanType: LoanType
  premiumPaymentSchedule: number[][]
  principalPaymentSchedule: number[][]
}

export function ILLCardOutstandingAmount({
  tokenByIndex,
  chainId,
  loanType,
  premiumPaymentSchedule,
  principalPaymentSchedule,
}: ILLCardOutstandingAmountProps) {
  const lastPremiumPayment =
    // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
    premiumPaymentSchedule && premiumPaymentSchedule.length > 0
      ? premiumPaymentSchedule[0] && premiumPaymentSchedule[0].length > 0
        ? premiumPaymentSchedule[0][premiumPaymentSchedule[0].length - 1]
        : 0
      : 0

  const lastPrincipalPayment =
    // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
    principalPaymentSchedule && principalPaymentSchedule.length > 0
      ? principalPaymentSchedule[0] && principalPaymentSchedule[0].length > 0
        ? principalPaymentSchedule[0][principalPaymentSchedule[0].length - 1]
        : 0
      : 0

  const { getTotalDue } = useGetTotalDue(
    tokenByIndex,
    chainId,
    loanType,
    lastPremiumPayment ?? 0,
    lastPrincipalPayment ?? 0
  )

  return (
    <div className="flex w-full border-t border-muted py-2">
      <h4 className="text-sm text-muted-foreground">Outstanding Amount Due</h4>
      <span className="ml-auto">
        {getTotalDue > 0 ? (
          <div className="flex flex-col space-y-1">
            <Tag variant="large" color="emerald">
              {getTotalDue.toFixed(6)}
            </Tag>
            <PaymentButton
              size="xs"
              amount={getTotalDue.toString()}
              buttonText="Pay"
              loanId={tokenByIndex}
              chainId={chainId}
            />
          </div>
        ) : (
          <Tag variant="large" color="zinc">
            NA
          </Tag>
        )}
      </span>
    </div>
  )
}
