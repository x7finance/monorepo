import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "X7DAO",
  description: "",
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
