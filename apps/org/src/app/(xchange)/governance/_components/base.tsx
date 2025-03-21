"use client";

import { useSearchParams } from "next/navigation";

import { X7Proposals } from "../../_components/governance/proposals";
import { X7Staking } from "../../_components/governance/stake";

function getView(tab: string | null) {
  switch (tab) {
    case "proposals":
      return <X7Proposals />;
    case "stake":
      return <X7Staking />;
    case "my-votes":
      return <p>my-votes</p>;
    case "previous-proposals":
      return <p>previous-proposals</p>;
    default:
      return <p>Testing</p>;
  }
}

export function GovernanceBase() {
  const router = useSearchParams();
  const tab = router.get("tab");

  const view = getView(tab);

  return <>{view}</>;
}
