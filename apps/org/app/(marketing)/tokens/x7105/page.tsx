import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "X7105",
  description: "",
}

export default function X7105TokenPage() {
  return (
    <div>
      <Heading
        id={"x7105"}
        title={"X7105"}
        subHeader="X7105 is the fifth constellation token"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
