/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { Suspense } from "react";

import { useLocalStorage } from "@x7/ui";
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer";
import type { LoanType } from "@x7/utils";
import { ChainId, ChainIdentifierEnum } from "@x7/utils";

import { useIsComponentReady } from "~/lib/hooks/utils/useIsComponentReady";
import {
  CHAIN_MAPPING,
  CHAIN_TAB_BUTTONS,
  Combobox,
  LOAN_TAB_BUTTONS,
} from "../tabs";
import { LoansTable } from "./table";

export function LiveLoans() {
  const [activeTab, setActiveTab] = useLocalStorage<ChainIdentifierEnum>(
    "globalActiveChainTab",
    ChainIdentifierEnum.eth,
  );
  const [loanTypeId, setLoanTypeId] = useLocalStorage<LoanType>(
    "globalLoanDataTab",
    "001",
  );

  const handleLoanTypeTabChange = (id: string) => {
    if (LOAN_TAB_BUTTONS.map((tab) => tab.id).includes(id)) {
      setLoanTypeId(id as LoanType);
    }
  };

  const isComponentReady = useIsComponentReady();

  const handleTabChange = (id: string) => {
    if (
      Object.values(ChainIdentifierEnum).includes(id as ChainIdentifierEnum)
    ) {
      setActiveTab(id as ChainIdentifierEnum);
    }
  };

  const activeChainId: ChainId = CHAIN_MAPPING[activeTab] || ChainId.BASE;

  return (
    <>
      <div className="ml-4 flex py-6">
        <Combobox
          tabs={CHAIN_TAB_BUTTONS}
          title="Chain"
          placeholderSearch="Search Chain"
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        <Combobox
          title="Loan Type"
          placeholderSearch="Search Loan Type"
          tabs={LOAN_TAB_BUTTONS}
          activeTab={loanTypeId}
          handleTabChange={handleLoanTypeTabChange}
        />
      </div>
      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          <LoansTable loanTypeId={loanTypeId} chainId={activeChainId} />
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  );
}
