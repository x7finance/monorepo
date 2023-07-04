import { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "Products",
  description:
    "Discover X7 Finance's DeFi Product Suite: A comprehensive platform showcasing our innovative decentralized finance solutions. Learn about our Automated Market Making (AMM) Decentralized Exchange (DEX), Lending Pool, Initial Liquidity Loans, and unique Utility NFTs. Understand how our democratic DAO governance model works and how you can participate. Whether you're an investor seeking growth or a project launcher looking for support, X7 Finance's product suite is your gateway to the future of decentralized finance.",
  slug: "/products",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function ProductsPage() {
  return (
    <div>
      <Heading
        id={"products"}
        title={"Products"}
        subHeader="The X7 Finance Protocol is a suite of products that enable users permissionless access to the world of DeFi"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
