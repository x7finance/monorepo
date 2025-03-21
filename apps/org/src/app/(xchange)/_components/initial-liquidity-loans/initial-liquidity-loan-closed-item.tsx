/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAccount } from "wagmi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@x7/ui/card";
import type { ChainId } from "@x7/utils";

import {
  useLoanBorrower,
  useLoanTermLookUp,
} from "~/lib/hooks/loans/useXchangeLendingPoolData";
import { useGetRemainingLiability } from "~/lib/hooks/loans/useXchangeLoanData";
import { generateX7InitialLiquidityLoanTermNumber } from "~/lib/utils/lending";
import { useClosedLoanStore } from "./closed-loan-store";
import { ILLCardContent } from "./initial-liquidity-loan-card-content";
import { ILLCardDescription } from "./initial-liquidity-loan-card-description";
import { ILLCardTitle } from "./initial-liquidity-loan-card-title";

interface LoansProps {
  id: number;
  chainId: ChainId;
}

export function ILLClosedListItem({ id, chainId }: LoansProps) {
  const { address } = useAccount();
  const { loanBorrower } = useLoanBorrower(id, chainId);
  const data = useLoanTermLookUp(id, chainId);
  const loanType = generateX7InitialLiquidityLoanTermNumber(
    data.loanTermLookUp,
    chainId,
  );
  const remainingLiability = useGetRemainingLiability(
    id,
    chainId,
    generateX7InitialLiquidityLoanTermNumber(data.loanTermLookUp, chainId),
  ).getRemainingLiability;

  const validLoanOwnershipOfClosedLoan =
    address &&
    loanBorrower &&
    loanBorrower.toLowerCase() === address.toLowerCase() &&
    remainingLiability === 0 &&
    loanType;

  const { increaseLoanCount, closedLoans, initialLoanLoaded, loansLoaded } =
    useClosedLoanStore((state) => state);

  useEffect(() => {
    if (!initialLoanLoaded) {
      loansLoaded();
    }

    if (validLoanOwnershipOfClosedLoan && !closedLoans) {
      increaseLoanCount();
    }
  }, [increaseLoanCount, closedLoans, initialLoanLoaded]);

  if (!validLoanOwnershipOfClosedLoan) {
    return null;
  }

  return (
    <li className="mx-auto">
      <Card className="">
        <CardHeader>
          <CardTitle>
            <ILLCardTitle
              tokenByIndex={id}
              chainId={chainId}
              loanType={loanType}
            />
          </CardTitle>
          <CardDescription>
            <ILLCardDescription
              tokenByIndex={id}
              chainId={chainId}
              loanType={loanType}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ILLCardContent
            tokenByIndex={id}
            chainId={chainId}
            loanType={loanType}
          />
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </li>
  );
}
