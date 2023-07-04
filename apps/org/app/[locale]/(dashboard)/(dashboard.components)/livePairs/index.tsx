"use client"

import { Suspense, useState } from "react"
import { ChainEnum, ChainIdentifierEnum } from "@x7/common"

import { useIsComponentReady } from "@/lib/hooks/useIsComponentReady"
import { LoadingShimmer } from "@/components/table/loading-shimmer"
import { CHAIN_TAB_BUTTONS, TabButtons } from "@/components/table/tabs"

import { PairsTable } from "./table"

export function LivePairs() {
  const [activeTab, setActiveTab] = useState(ChainIdentifierEnum.erc)
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
      <div className="justify-center px-1 py-5 overflow-x-auto">
        <TabButtons
          tabs={CHAIN_TAB_BUTTONS}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </div>

      {isComponentReady ? (
        <Suspense fallback={<LoadingShimmer />}>
          <PairsTable chainId={activeChainId} />
        </Suspense>
      ) : (
        <LoadingShimmer />
      )}
    </>
  )
}
