import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"
import { Heading } from "@/app/[locale]/(marketing)/components/heading"

const metadata = {
  title: "Xchange",
  description:
    "Explore Xchange: X7 Finance's native Decentralized Exchange (DEX) powered by Automated Market Making (AMM). Learn how Xchange offers seamless, trustless trading of ERC-20 tokens, providing unparalleled opportunities for crypto investors. Understand the mechanics, benefits, and potential returns of trading on Xchange. Experience the future of decentralized trading with Xchange by X7 Finance.",
  slug: "/products/x7d",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function XChangePage() {
  return (
    <div>
      <Heading
        id={"xchange"}
        title={"Xchange"}
        subHeader="Xchange is a decentralized exchange that allows users to swap tokens permissionlessly"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
