// import { Heading } from "@/components/heading"
import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "NFTs",
  description: "",
}

export default function NftsPage() {
  return (
    <div>
      <Heading
        id={"utility-nfts"}
        title={"Utility NFTs"}
        subHeader="X7 Finance's Utility NFTs are unique digital assets that provide holders with exclusive benefits and privileges within the X7 ecosystem, enhancing their DeFi experience and potential returns."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
