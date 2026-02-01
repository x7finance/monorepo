"use client"

import { useSearchParams } from "next/navigation"

import { CreateCoinForm } from "./create-coin-form"
import { DeployerTemp } from "./deployer-temp"
import { ManageCoinForm } from "./manage-coin-form"

function getView(tab: string | null) {
  switch (tab) {
    case "create":
      return <CreateCoinForm />
    case "manage":
      return <ManageCoinForm />
    case "deployer":
      return <DeployerTemp />
    default:
      return <CreateCoinForm />
  }
}

export function CreateBase() {
  const router = useSearchParams()
  const tab = router.get("tab")

  const view = getView(tab)

  return <>{view}</>
}
