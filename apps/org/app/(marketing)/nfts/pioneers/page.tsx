import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Pioneers NFT",
  description: "",
}

export default function PioneersPage() {
  return (
    <div>
      <Heading
        id={"pioneers"}
        title={"Pioneers NFT"}
        subHeader="Pioneers NFTs were a limited edition NFT that were gifted to early supporters of the X7 Finance."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
