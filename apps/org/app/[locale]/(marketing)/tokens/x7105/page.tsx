import { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "X7105",
  description:
    "Discover X7105: A special token within the X7 Finance ecosystem, designed with unique features and rewards. Learn how X7105 plays an integral role in our DeFi platform, facilitating transactions and incentivizing active participation. Understand the tokenomics, benefits, and potential returns of holding X7105. Experience the evolution of decentralized finance with X7105, a key asset of X7 Finance.",
  slug: "/tokens/x7105",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function X7105TokenPage() {
  return (
    <div>
      <Heading
        id={"x7105"}
        title={"X7105"}
        subHeader="X7105 is the fifth constellation token"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
