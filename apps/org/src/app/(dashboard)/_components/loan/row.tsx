"use client";

import type { ChainId, LoanType } from "@x7/utils";

import { useTokenByIndex } from "~/lib/hooks/loans/useXchangeLoanData";
import { LoanCellAmount } from "./cell-amount";
import { LoanCellDetails } from "./cell-details";
import { LoanCellDue } from "./cell-due";
import { LoanCellId } from "./cell-id";
import { LoanCellIndex } from "./cell-index";
import { LoanCellMore } from "./cell-more";
import { LoanCellStartDate } from "./cell-start-date";
import { LoanCellStatus } from "./cell-status";

interface LoansProps {
  id: number;
  chainId: ChainId;
  loanType: LoanType;
  type:
    | "index"
    | "id"
    | "details"
    | "status"
    | "amount"
    | "due"
    | "startDate"
    | "more";
}

export function LoanRow({ id, chainId, type, loanType }: LoansProps) {
  const tokenByIndex = useTokenByIndex(id, chainId, loanType).tokenByIndex;

  switch (type) {
    case "index":
      return <LoanCellIndex id={id} chainId={chainId} loanType={loanType} />;
    case "id":
      return <LoanCellId id={id} />;
    case "details":
      return (
        <LoanCellDetails
          tokenByIndex={tokenByIndex}
          chainId={chainId}
          loanType={loanType}
        />
      );
    case "status":
      return (
        <LoanCellStatus
          tokenByIndex={tokenByIndex}
          chainId={chainId}
          loanType={loanType}
        />
      );
    case "amount":
      return (
        <LoanCellAmount
          tokenByIndex={tokenByIndex}
          chainId={chainId}
          loanType={loanType}
        />
      );
    case "due":
      return (
        <LoanCellDue
          tokenByIndex={tokenByIndex}
          chainId={chainId}
          loanType={loanType}
        />
      );
    case "startDate":
      return (
        <LoanCellStartDate
          tokenByIndex={tokenByIndex}
          chainId={chainId}
          loanType={loanType}
        />
      );
    case "more":
      return <LoanCellMore id={id} chainId={chainId} loanType={loanType} />;
  }
}
