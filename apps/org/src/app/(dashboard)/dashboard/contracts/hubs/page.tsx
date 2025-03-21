import type { Metadata } from "next";

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { DashboardContainer } from "../../../_components/dashboard-container";
import { DashboardTitle } from "../../../_components/dashboard-title";
import { LiquidityHubsComponent } from "../../../_components/hubs/component";

const metadata = {
  title: "X7 Finance Liquidity Hubs",
  description:
    "Dive into X7 Finance's Smart Contracts Showcase: A comprehensive platform featuring all of X7's innovative DeFi smart contracts. Explore our Automated Market Making (AMM) contracts, lending pool contracts, liquidity loan contracts, and more. Understand the mechanics behind our DeFi solutions and how they contribute to a seamless, trustless, and efficient financial ecosystem. Discover the power of decentralized finance with X7 Finance's Smart Contracts Showcase.",
  slug: "/dashboard/contracts/hubs",
  section: "dashboard",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function LiquidityHubsPage() {
  return (
    <>
      <div className="xl:max-w-none">
        <DashboardTitle
          title="X7 Finance Liquidity Hubs"
          subHeader="A detailed breakdown of where liquidity and funds are being moved through the ecosystem"
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
          <LiquidityHubsComponent />
        </DashboardContainer>
      </div>
    </>
  );
}
