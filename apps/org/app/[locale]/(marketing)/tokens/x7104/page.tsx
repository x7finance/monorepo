import type { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"

const metadata = {
  title: "X7104",
  description:
    "Explore X7104: A distinctive token in the X7 Finance ecosystem, crafted with unique functionalities and advantages. Learn how X7104 plays a significant role in our DeFi platform, facilitating transactions and incentivizing active participation. Understand the tokenomics, benefits, and potential returns of holding X7104. Experience the innovation of decentralized finance with X7104, a vital element of X7 Finance.",
  slug: "/tokens/x7104",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function X7104TokenPage() {
  return (
    <div>
      <Heading
        id={"x7104"}
        title={"X7104"}
        subHeader="X7104 is the fourth constellation token"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
