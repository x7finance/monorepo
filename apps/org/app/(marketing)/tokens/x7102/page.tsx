import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"
import { Heading } from "@/app/(marketing)/components/heading"

const metadata = {
  title: "X7102",
  description:
    "Uncover X7102: A special token in the X7 Finance ecosystem, designed with unique functionalities and rewards. Learn how X7102 plays an integral role in our DeFi platform, facilitating transactions and incentivizing active participation. Understand the tokenomics, benefits, and potential returns of holding X7102. Experience the evolution of decentralized finance with X7102, a key asset of X7 Finance.",
  slug: "/tokens/x7102",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function X7102TokenPage() {
  return (
    <div>
      <Heading
        id={"x7102"}
        title={"X7102"}
        subHeader="X7102 is the second constellation token"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
