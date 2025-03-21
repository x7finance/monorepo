"use client";

import { ArrowUpRightIcon } from "@x7/icons";
import { LinkExternal } from "@x7/ui/link";
import { Tag } from "@x7/ui/tag";
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

export function ILLCardTitle({
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
      <div className="flex flex-col">
        <div className="flex">
          {tokenSymbol}
          <div className="ml-auto">
            <LinkExternal
              href={fullLoanAddress}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tag variant="large" color="zinc">
                <span className="w-full">
                  View Contract{" "}
                  <ArrowUpRightIcon className="relative bottom-0.5 inline-flex h-3 w-3 whitespace-nowrap" />
                </span>
              </Tag>
            </LinkExternal>
          </div>
        </div>
        <div className="text-muted-foreground mt-1 text-sm">
          Loan Type: {symbol}
        </div>
      </div>
    </>
  );
}
