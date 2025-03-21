import type { Metadata } from "next";

import { getRandomPioneerNumber } from "@x7/utils";

import { SiteContentContainer } from "~/lib/components/core/site-content-container";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { GradientTypes } from "~/lib/utils/gradients";
import { DashboardLinksEnum, NftsLinkEnum } from "~/types/links";
import { Heading } from "../../_components/heading";
import { SectionStep } from "../../_components/section-step";

const metadata = {
  title: "DEX Maxi NFT",
  description:
    "Explore X7 Finance's Dex Maxi NFT: A unique digital asset that offers holders exclusive benefits on our Automated Market Making (AMM) Decentralized Exchange (DEX). Learn how the Dex Maxi NFT can enhance your trading experience, provide preferential rates, and unlock new trading opportunities. Understand the mechanics, benefits, and potential returns of our Dex Maxi NFT and elevate your decentralized trading journey.",
  slug: NftsLinkEnum.DexMaxi,
  section: "default",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function DexMaxiPage() {
  return (
    <div>
      <Heading
        id={"dex-maxi"}
        title={"DEX Maxi NFT"}
        subHeader="Lower costs on Xchange"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <SectionStep
            showLeadIn={false}
            header="Dex Maxi NFTs provide users of Xchange an additional layer of flexibility during trading."
            subHeader="Xchange users will find this NFT useful towards a more frictionless trading experience."
            pioneerId={getRandomPioneerNumber()}
            gradient={GradientTypes.redLight}
            checkColor="text-rose-600"
            highlightHeader="Preserve Capital while trading"
            highlights={["50% discount on Xchange LP fee"]}
            primaryAction={{
              text: "Buy DEX Maxi NFT",
              href: DashboardLinksEnum.Marketplace,
            }}
          />
        </div>
      </SiteContentContainer>
    </div>
  );
}
