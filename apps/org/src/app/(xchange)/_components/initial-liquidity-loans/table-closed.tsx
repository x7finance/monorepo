/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useAccount } from "wagmi";

import type { ChainId } from "@x7/utils";

import { EmptyPioneer } from "~/lib/components/core/empty-pioneer";
import { useNextLoanID } from "~/lib/hooks/loans/useXchangeLendingPoolData";
import { useClosedLoanStore } from "./closed-loan-store";
import { ILLTableConnect } from "./connect";
import { ILLClosedListItem } from "./initial-liquidity-loan-closed-item";

export function ILLTableClosed() {
  const { isConnected, chain } = useAccount();

  const chainId = chain?.id ?? 1;
  const { closedLoans } = useClosedLoanStore((state) => state);

  const totalSupply = useNextLoanID(chainId as ChainId).nextLoanID;

  const loansToDisplay = Array.from(
    { length: totalSupply },
    (_, idx) => totalSupply - idx - 1,
  );

  if (!isConnected) {
    return <ILLTableConnect />;
  }

  if (closedLoans <= 0) {
    return (
      <div className="mb-96">
        <EmptyPioneer message="No Loan History" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div>
        <ul>
          {loansToDisplay.map((id: any) => (
            <ILLClosedListItem
              key={`closed-${id}`}
              id={id}
              chainId={chainId as ChainId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
