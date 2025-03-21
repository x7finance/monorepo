"use client";

import { Suspense } from "react";

import { useLocalStorage } from "@x7/ui";
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer";
import type { ChainId } from "@x7/utils";
import { ChainIdentifierEnum } from "@x7/utils";

import {
  CHAIN_MAPPING,
  CHAIN_TAB_BUTTONS,
  Combobox,
} from "~/app/(dashboard)/_components/tabs";
import { useIsComponentReady } from "~/lib/hooks/utils/useIsComponentReady";
import { LoanTermsView } from "./loan-terms-view";

export function LoanTerms() {
  const [activeTab, setActiveTab] = useLocalStorage<ChainIdentifierEnum>(
    "globalActiveChainTab",
    ChainIdentifierEnum.eth,
  );
  const isComponentReady = useIsComponentReady();

  const handleTabChange = (id: string) => {
    if (
      Object.values(ChainIdentifierEnum).includes(id as ChainIdentifierEnum)
    ) {
      setActiveTab(id as ChainIdentifierEnum);
    }
  };

  const activeChainId: ChainId = CHAIN_MAPPING[activeTab];

  return (
    <>
      <div className="ml-2 flex pt-6 sm:ml-8">
        <Combobox
          tabs={CHAIN_TAB_BUTTONS}
          title="Chain"
          placeholderSearch="Search Chain"
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </div>
      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          <LoanTermsView chainId={activeChainId} />
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  );
}
