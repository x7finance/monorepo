"use client";

import Link from "next/link";

import { ContractCopy } from "@x7/ui/contract-copy";
import type { ChainId, LoanType } from "@x7/utils";

import { useLoanToken } from "~/lib/hooks/loans/useXchangeLendingPoolData";
import {
  useFullLoanAddress,
  useSymbol,
  useTokenSymbol,
} from "~/lib/hooks/loans/useXchangeLoanData";

interface LoansCellProps {
  tokenByIndex: number;
  chainId: ChainId;
  loanType: LoanType;
}

export function LoanCellDetails({
  tokenByIndex,
  chainId,
  loanType,
}: LoansCellProps) {
  const symbol = useSymbol(tokenByIndex, chainId, loanType).symbol;
  const loanAddress = useLoanToken(tokenByIndex, chainId).loanToken;
  const tokenSymbol = useTokenSymbol(loanAddress, chainId).tokenSymbol;
  const fullLoanAddress = useFullLoanAddress(chainId, loanType).fullLoanAddress;
  return (
    <>
      <span className="flex flex-col">
        {tokenSymbol}
        <Link
          prefetch={true}
          className="text-2xs text-muted-foreground hover:text-muted-foreground/80 hover:underline"
          href={fullLoanAddress}
          target="_blank"
          rel="noopener noreferrer"
        >
          Loan Type - {symbol}
        </Link>
      </span>

      <ContractCopy contract={loanAddress} />
    </>
  );
}
