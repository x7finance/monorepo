"use client"

import { Suspense, useState } from "react"
import { ChainEnum, ChainIdentifierEnum, LoanType } from "@x7/common"

import { useIsComponentReady } from "@/lib/hooks/useIsComponentReady"
import { LoadingShimmer } from "@/components/table/loading-shimmer"
import {
  CHAIN_TAB_BUTTONS,
  LOAN_TAB_BUTTONS,
  TabButtons,
} from "@/components/table/tabs"

import { LoansTable } from "./table"

export function LiveLoans() {
  const [activeTab, setActiveTab] = useState(ChainIdentifierEnum.erc)
  const [loanTypeId, setLoanTypeId] = useState<LoanType>("001")

  const handleLoanTypeTabChange = (tabId) => {
    setLoanTypeId(tabId)
  }
  const isComponentReady = useIsComponentReady()

  const handleTabChange = (tabId) => {
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
      <div className="justify-center px-1 pt-5 overflow-x-auto">
        <TabButtons
          tabs={CHAIN_TAB_BUTTONS}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        <div className="justify-center overflow-x-auto px-3 mt-1 pt-1 pb-5">
          <TabButtons
            tabs={LOAN_TAB_BUTTONS}
            activeTab={loanTypeId}
            handleTabChange={handleLoanTypeTabChange}
          />
        </div>
      </div>

      {isComponentReady ? (
        <Suspense fallback={<LoadingShimmer />}>
          <LoansTable loanTypeId={loanTypeId} chainId={activeChainId} />
        </Suspense>
      ) : (
        <LoadingShimmer />
      )}
    </>
  )
}
