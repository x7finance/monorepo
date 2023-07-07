"use client"

import { Suspense, useState } from "react"

import type { LoanType } from "@x7/common"
import { ChainEnum, ChainIdentifierEnum } from "@x7/common"
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer"

import { useIsComponentReady } from "@/lib/hooks/useIsComponentReady"
import { CHAIN_TAB_BUTTONS, LOAN_TAB_BUTTONS, TabButtons } from "../tabs"
import { LoansTable } from "./table"

export function LiveLoans() {
  const [activeTab, setActiveTab] = useState(ChainIdentifierEnum.erc)
  const [loanTypeId, setLoanTypeId] = useState<LoanType>("001")

  const handleLoanTypeTabChange: any = (tabId: LoanType) => {
    setLoanTypeId(tabId)
  }
  const isComponentReady = useIsComponentReady()

  const handleTabChange = (tabId: any) => {
    setActiveTab(tabId)
  }

  const activeChainId =
    activeTab === ChainIdentifierEnum.erc
      ? ChainEnum.erc
      : activeTab === ChainIdentifierEnum.bsc
      ? ChainEnum.bsc
      : activeTab === ChainIdentifierEnum.polygon
      ? ChainEnum.polygon
      : activeTab === ChainIdentifierEnum.arbitrum
      ? ChainEnum.arbitrum
      : activeTab === ChainIdentifierEnum.optimism
      ? ChainEnum.optimism
      : ChainEnum.erc

  return (
    <>
      <div className="justify-center overflow-x-auto px-1 pt-5">
        <TabButtons
          tabs={CHAIN_TAB_BUTTONS}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        <div className="mt-1 justify-center overflow-x-auto px-3 pb-5 pt-1">
          <TabButtons
            tabs={LOAN_TAB_BUTTONS}
            activeTab={loanTypeId}
            handleTabChange={handleLoanTypeTabChange}
          />
        </div>
      </div>

      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          <LoansTable loanTypeId={loanTypeId} chainId={activeChainId} />
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  )
}
