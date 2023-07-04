import { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "X7R",
  description:
    "Explore X7R: A unique token in the X7 Finance ecosystem, designed with specific functionalities and benefits. Learn how X7R plays a significant role in our DeFi platform, from facilitating transactions to incentivizing participation in the ecosystem. Understand the tokenomics, benefits, and potential returns of holding X7R. Experience the potential of decentralized finance with X7R, a key component of X7 Finance.",
  slug: "/tokens/x7r",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function X7RTokenPage() {
  return (
    <div>
      <Heading
        id={"x7r"}
        title={"X7R"}
        subHeader="X7R is the main X7 reward token for people that want access to the upside of the protocol"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
