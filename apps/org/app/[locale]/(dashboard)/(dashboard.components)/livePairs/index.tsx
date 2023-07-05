"use client"

import { Suspense, useState } from "react"

import { ChainEnum, ChainIdentifierEnum } from "@x7/common"
// @ts-expect-error todo: fix this
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer"

import { useIsComponentReady } from "@/lib/hooks/useIsComponentReady"
import { CHAIN_TAB_BUTTONS, TabButtons } from "../tabs"
import { PairsTable } from "./table"

export function LivePairs() {
  const [activeTab, setActiveTab] = useState<ChainIdentifierEnum>(
    ChainIdentifierEnum.erc
  )
  const isComponentReady = useIsComponentReady()

  const handleTabChange = (id: string) => {
    if (
      Object.values(ChainIdentifierEnum).includes(id as ChainIdentifierEnum)
    ) {
      setActiveTab(id as ChainIdentifierEnum)
    }
  }

  const activeChainId: ChainEnum =
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
      <div className="justify-center overflow-x-auto px-1 py-5">
        <TabButtons
          tabs={CHAIN_TAB_BUTTONS}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </div>

      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          <PairsTable chainId={activeChainId} />
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  )
}
