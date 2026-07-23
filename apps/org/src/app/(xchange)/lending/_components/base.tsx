"use client"

import { useSearchParams } from "next/navigation"

import { LiveLoans } from "~/app/(dashboard)/_components/loan"
import { LendingTabs } from "~/lib/types"

import { ILLTableClosed } from "../../_components/initial-liquidity-loans/table-closed"
import { ILLTableOpen } from "../../_components/initial-liquidity-loans/table-open"
import { ILLBaseForm } from "../../_components/loans/base"

import { LendingPoolStatus } from "./lending-pool-status"
import { LoanTerms } from "./loan-terms"

function getView(tab: string | null) {
  switch (tab) {
    case LendingTabs.InitiateLoan:
      return <ILLBaseForm />
    case LendingTabs.MyClosedLoans:
      return <ILLTableClosed />
    case LendingTabs.MyOpenLoans:
      return <ILLTableOpen />
    case LendingTabs.LendingPool:
      return <LendingPoolStatus />
    case LendingTabs.LoanTerms:
      return <LoanTerms />
    default:
      return <LiveLoans />
  }
}

export function LendingBase() {
  const router = useSearchParams()
  const tab = router.get("tab") ?? LendingTabs.AllLoans
  const view = getView(tab)

  return <>{view}</>
}
