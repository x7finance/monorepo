import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

const metadata = {
  title: "Tokens",
  description:
    "Explore the Core Seven Tokens of X7 Finance: A comprehensive overview of our unique tokens - X7 DAO, X7R, X7101, X7102, X7103, X7104, and X7105. Each token plays a significant role in our DeFi ecosystem, from facilitating transactions and incentivizing participation to empowering holders with governance rights. Understand the tokenomics, benefits, and potential returns of holding these tokens. Experience the diversity and potential of decentralized finance with the core seven tokens of X7 Finance.",
  slug: "/tokens",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function TokensPage() {
  return (
    <div>
      <Heading
        id={"tokens"}
        title={"Tokens"}
        subHeader="X7 has 7 core tokens that are used to ensure the protocol is running optimally"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
