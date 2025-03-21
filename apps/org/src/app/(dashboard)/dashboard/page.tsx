import type { Metadata } from "next";

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { ContractsComponent } from "../_components/contracts/component";
import { DashboardContainer } from "../_components/dashboard-container";
import { DashboardTitle } from "../_components/dashboard-title";

const metadata = {
  title: "X7 Contracts",
  description: "All of the contracts that make up the X7 ecosystem",
  slug: "/dashboard",
  section: "dashboard",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function DashboardIndexPage() {
  return (
    <div className="xl:max-w-none">
      <DashboardTitle
        title="X7 Finance Ecosystem"
        secondaryButton={{
          text: "Liquidity Hubs",
          href: "/dashboard/contracts/hubs",
        }}
        primaryButton={{
          text: "Splitters",
          href: "/dashboard/contracts/splitters",
        }}
      />
      <DashboardContainer>
        <ContractsComponent />
      </DashboardContainer>
    </div>
  );
}
