"use client"

import { useSearchParams } from "next/navigation"

import { FundingTabs } from "~/lib/types"

import { X7DFunding } from "../_components/x7d/base"
import { X7DTransactionTable } from "../_components/x7d/transaction-table"

function getView(tab: string | null) {
  switch (tab) {
    case FundingTabs.History:
      return (
        <div className="mx-auto">
          <div className="my-12 flex w-full justify-center text-sm text-zinc-500">
            <X7DTransactionTable />
          </div>
        </div>
      )
    default:
      return <X7DFunding />
  }
}

export function FundBase() {
  const router = useSearchParams()
  const tab = router.get("tab") ?? FundingTabs.Fund
  const view = getView(tab)

  return <div className="mb-96">{view}</div>
}
