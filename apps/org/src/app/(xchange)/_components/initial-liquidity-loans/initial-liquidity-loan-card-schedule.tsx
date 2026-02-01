/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

import type { ChainId, LoanType } from "@x7/utils";

import { useGetPrincipalDue } from "~/lib/hooks/loans/useXchangeLoanData";
import { IILPaymentCard } from "./initial-liquidity-loan-card-payment";

interface ILLCardRepaymentScheduleProps {
  chainId: ChainId;
  loanType: LoanType;
  tokenByIndex: number;
  premiumPaymentSchedule: number[][];
  principalPaymentSchedule: number[][];
}

export function ILLCardRepaymentSchedule({
  chainId,
  loanType,
  tokenByIndex,
  principalPaymentSchedule,
  premiumPaymentSchedule,
}: ILLCardRepaymentScheduleProps) {
  const { getPrincipalDue } = useGetPrincipalDue(
    tokenByIndex,
    chainId,
    loanType,
    principalPaymentSchedule?.[0]?.at(-1) ?? 0,
  );

  if (!principalPaymentSchedule?.length || !premiumPaymentSchedule?.length) {
    return null; // or some fallback UI
  }

  const fullRepaymentSchedule = getFullRepaymentSchedule(
    principalPaymentSchedule,
    premiumPaymentSchedule,
  );

  const hasBalance = getPrincipalDue;

  return (
    <div className="flex w-full items-center justify-center border-t border-muted py-2">
      {fullRepaymentSchedule ? (
        <ul className="divide-y">
          {fullRepaymentSchedule.map((paymentScheduleDate, i: number) =>
            paymentScheduleDate.paymentDueTimeStamp >
            Math.floor(new Date().getTime() / 1000) ? (
              <li className="flex py-4" key={`premium-${i}`}>
                <IILPaymentCard
                  tokenByIndex={tokenByIndex}
                  paymentDueTimeStamp={paymentScheduleDate.paymentDueTimeStamp}
                  // @ts-expect-error: todo fix
                  paymentAmount={paymentScheduleDate.paymentAmount}
                  canLiquidate={hasBalance > 0}
                  chainId={chainId}
                />
              </li>
            ) : (
              <span key={`empty-${i}`} />
            ),
          )}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
}

function getFullRepaymentSchedule(
  principalPaymentSchedule: number[][],
  premiumPaymentSchedule: number[][],
) {
  if (!premiumPaymentSchedule?.[0] || !principalPaymentSchedule?.[0]) {
    return [];
  }

  let paymentIndex = 0;
  const fullSchedule = premiumPaymentSchedule[0].map((paymentTs, i: number) => {
    const premiumAmount = premiumPaymentSchedule[1]?.[i] ?? 0;
    const principalAmount = principalPaymentSchedule[1]?.[paymentIndex] ?? 0;

    if (principalPaymentSchedule[0]?.[paymentIndex] === paymentTs) {
      paymentIndex++;
      return {
        paymentDueTimeStamp: paymentTs,
        paymentAmount: premiumAmount + principalAmount,
      };
    } else {
      return {
        paymentDueTimeStamp: paymentTs,
        paymentAmount: premiumAmount,
      };
    }
  });

  return fullSchedule;
}
