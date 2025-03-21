/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useAccount } from "wagmi";

import type { ChainId } from "@x7/utils";

import { EmptyPioneer } from "~/lib/components/core/empty-pioneer";
import { useActiveLoansByBorrower } from "~/lib/hooks/loans/useXchangeLendingPoolData";
import { ILLTableConnect } from "./connect";
import { ILLOpenListItem } from "./initial-liquidity-loan-open-item";

export function ILLTableOpen() {
  const { isConnected, chain, address } = useAccount();
  const chainId = chain?.id ?? (1 as ChainId);

  const { activeLoansByBorrower } = useActiveLoansByBorrower(
    address!,
    chainId as ChainId,
  );

  return (
    <>
      {!isConnected ? (
        <ILLTableConnect />
      ) : (
        <>
          {activeLoansByBorrower > 0 ? (
            <>
              <ul className="mb-5 mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {Array.from({ length: activeLoansByBorrower }).map(
                  (_, index) => (
                    <ILLOpenListItem
                      key={`${index}-ill-card`}
                      address={address!}
                      userloanCountIndex={index}
                      chainId={chainId as ChainId}
                    />
                  ),
                )}
              </ul>
            </>
          ) : (
            <div className="mb-96">
              <EmptyPioneer message="No Active Loans" />
            </div>
          )}
        </>
      )}
    </>
  );
}
