import type { Metadata } from "next";

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { DashboardLinksEnum } from "~/types/links";
import { DashboardContainer } from "../../_components/dashboard-container";
import { DashboardTitle } from "../../_components/dashboard-title";
import { UtitlityNfts } from "../../_components/utilityNfts";

const metadata = {
  title: "NFT Marketplace",
  description:
    "Discover X7 Finance's NFT Marketplace: A specialized platform designed for the DeFi enthusiast. Our marketplace is home to exclusive Utility NFTs that provide holders with unique benefits and privileges within the X7 DeFi ecosystem. Trade and invest in these NFTs to unlock enhanced financial opportunities and potential returns. Experience the future of decentralized finance with X7 Finance's NFT Marketplace.",
  slug: "/dashboard/marketplace",
  section: "dashboard",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function MarketplacePage() {
  return (
    <div className="xl:max-w-none">
      <DashboardTitle
        title="NFT Marketplace"
        primaryButton={{
          text: "Pioneer Dashboard",
          href: DashboardLinksEnum.Pioneer,
        }}
      />
      <DashboardContainer>
        <UtitlityNfts />
      </DashboardContainer>
    </div>
  );
}
