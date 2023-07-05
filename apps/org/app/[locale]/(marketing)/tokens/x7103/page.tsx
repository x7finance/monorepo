import type { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "X7103",
  description:
    "Dive into X7103: A unique token within the X7 Finance ecosystem, designed with specific features and benefits. Learn how X7103 contributes to our DeFi platform, facilitating transactions and incentivizing active participation. Understand the tokenomics, benefits, and potential returns of holding X7103. Experience the potential of decentralized finance with X7103, a crucial component of X7 Finance.",
  slug: "/tokens/x7103",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}
export default function X7103TokenPage() {
  return (
    <div>
      <Heading
        id={"x7103"}
        title={"X7103"}
        subHeader="X7103 is the third constellation token"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
