import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "X7D",
  description: "",
}

export default function X7D() {
  return (
    <div>
      <Heading
        id={"x7d"}
        title={"x7d"}
        subHeader="X7D is the deposit token for capital providers wishing to contribute to the lending pool."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
