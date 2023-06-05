import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

const metadata = {
  title: "X7DAO",
  description:
    "Dive into X7 DAO: The governance token of X7 Finance, playing a crucial role in our decentralized finance ecosystem. Learn how X7 DAO empowers holders with voting rights, enabling them to participate in key protocol decisions, from modifying tokenomics to determining the long-term fate of locked liquidity. Understand the tokenomics, benefits, and potential returns of holding X7 DAO. Experience the power of decentralized governance with X7 DAO, the voice of X7 Finance.",
  slug: "/tokens/x7dao",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function X7RDAO() {
  return (
    <div>
      <Heading
        id={"x7dao"}
        title={"X7DAO"}
        subHeader="X7DAO is the governance token for the X7 Protocol"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
