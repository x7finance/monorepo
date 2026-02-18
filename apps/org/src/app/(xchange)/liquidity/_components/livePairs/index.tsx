"use client"

import { memo, Suspense, useCallback, useMemo } from "react"

import { useLocalStorage } from "@x7/ui"
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer"
import type { ChainId } from "@x7/utils"
import { ChainIdentifierEnum } from "@x7/utils"
import { useIsComponentReady } from "~/lib/hooks/utils/useIsComponentReady"

import {
  CHAIN_MAPPING,
  CHAIN_TAB_BUTTONS,
  Combobox,
} from "../../../../(dashboard)/_components/tabs"

import { PairsTable } from "./table"

// Memoize the PairsTable component to prevent unnecessary re-renders
const MemoizedPairsTable = memo(PairsTable)

// Memoize the Combobox component to prevent unnecessary re-renders
const MemoizedCombobox = memo(Combobox)

export function LivePairs() {
  const [activeTab, setActiveTab] = useLocalStorage<ChainIdentifierEnum>(
    "globalActiveChainTab",
    ChainIdentifierEnum.eth
  )
  const isComponentReady = useIsComponentReady()

  // Use useCallback to ensure handleTabChange is stable and doesn't cause re-renders
  const handleTabChange = useCallback(
    (id: string) => {
      if (
        Object.values(ChainIdentifierEnum).includes(id as ChainIdentifierEnum)
      ) {
        setActiveTab(id as ChainIdentifierEnum)
      }
    },
    [setActiveTab]
  )

  // Use useMemo to ensure activeChainId is stable and doesn't cause re-renders
  const activeChainId: ChainId = useMemo(
    () => CHAIN_MAPPING[activeTab],
    [activeTab]
  )

  return (
    <>
      <div className="ml-2 flex py-6">
        <MemoizedCombobox
          tabs={CHAIN_TAB_BUTTONS}
          title="Chain"
          placeholderSearch="Search Chain"
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </div>
      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          <MemoizedPairsTable chainId={activeChainId} />
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  )
}
