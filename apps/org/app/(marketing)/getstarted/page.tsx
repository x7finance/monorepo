import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Getting Started",
  description: "",
}

export default function GettingStartedPage() {
  return (
    <div>
      <Heading
        id={"getstarted"}
        title={"Get Started"}
        subHeader="Here you'll find everything you need to get started with the protocol"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
