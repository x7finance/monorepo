import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"
import { Heading } from "@/app/(marketing)/components/heading"

const metadata = {
  title: "X7101",
  description:
    "Discover X7101: A distinctive token within the X7 Finance ecosystem, crafted with unique features and advantages. Learn how X7101 contributes to our DeFi platform, facilitating transactions and incentivizing active participation. Understand the tokenomics, benefits, and potential returns of holding X7101. Experience the innovation of decentralized finance with X7101, a vital element of X7 Finance.",
  slug: "/tokens/x7101",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function X7101TokenPage() {
  return (
    <div>
      <Heading
        id={"x7101"}
        title={"X7101"}
        subHeader="X7101 is the first constellation token"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
