/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import type { Address } from "viem";

import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card";
import type { ChainId } from "@x7/utils";

import {
  useLoanLookupByBorrower,
  useLoanTermLookUp,
} from "~/lib/hooks/loans/useXchangeLendingPoolData";
import {
  useGetPremiumPaymentSchedule,
  useGetPrincipalPaymentSchedule,
} from "~/lib/hooks/loans/useXchangeLoanData";
import { generateX7InitialLiquidityLoanTermNumber } from "~/lib/utils/lending";
import { ILLCardActiveStatus } from "./initial-liquidity-loan-card-active";
import { ILLCardLiquidationStatus } from "./initial-liquidity-loan-card-liquidation";
import { ILLCardOutstandingAmount } from "./initial-liquidity-loan-card-outstanding";
import { ILLCardRepaymentSchedule } from "./initial-liquidity-loan-card-schedule";
import { ILLCardTitle } from "./initial-liquidity-loan-card-title";

interface ILLCardProps {
  address: Address;
  userloanCountIndex: number;
  chainId: ChainId;
}

export function ILLOpenListItem({
  address,
  userloanCountIndex,
  chainId,
}: ILLCardProps) {
  const tokenByIndex: any = useLoanLookupByBorrower(
    address,
    userloanCountIndex as unknown as bigint,
    chainId,
  ).loanLookupByBorrower;

  const loanTermLookUp = useLoanTermLookUp(
    tokenByIndex,
    chainId,
  ).loanTermLookUp;
  const loanType = generateX7InitialLiquidityLoanTermNumber(
    loanTermLookUp,
    chainId,
  );
  const premiumPaymentSchedule = useGetPremiumPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType,
  ).getPremiumPaymentSchedule;
  const principalPaymentSchedule = useGetPrincipalPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType,
  ).getPrincipalPaymentSchedule;

  return (
    <li key={`loan-${userloanCountIndex}`}>
      <Card className="">
        <CardHeader>
          <CardTitle>
            <ILLCardTitle
              tokenByIndex={tokenByIndex}
              chainId={chainId}
              loanType={loanType}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ILLCardActiveStatus
            principalPaymentSchedule={principalPaymentSchedule}
          />
          <ILLCardLiquidationStatus
            tokenByIndex={tokenByIndex}
            chainId={chainId}
          />
          <ILLCardOutstandingAmount
            tokenByIndex={tokenByIndex}
            chainId={chainId}
            loanType={loanType}
            premiumPaymentSchedule={premiumPaymentSchedule}
            principalPaymentSchedule={principalPaymentSchedule}
          />

          <ILLCardRepaymentSchedule
            chainId={chainId}
            loanType={loanType}
            tokenByIndex={tokenByIndex}
            premiumPaymentSchedule={premiumPaymentSchedule}
            principalPaymentSchedule={principalPaymentSchedule}
          />

          <div className="w-full text-center font-mono text-sm tracking-tight text-muted-foreground/40">
            Loan Number {tokenByIndex}
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
