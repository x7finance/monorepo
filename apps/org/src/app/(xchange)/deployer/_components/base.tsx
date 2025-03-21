"use client";

import { useSearchParams } from "next/navigation";

function getView(tab: string | null) {
  switch (tab) {
    case "deploy-form":
      return <p>deployer from</p>;
    case "previous-deployments":
      return <p>previous deployments</p>;
    default:
      return <p>Placeholder</p>;
  }
}

export function DeployerBase() {
  const router = useSearchParams();
  const tab = router.get("tab");

  const view = getView(tab);

  return <>{view}</>;
}
