import type { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"
import { ContractTemplatesGrid } from "./grid"

const metadata = {
  title: "Templates",
  description:
    "Jumpstart your projects development process with pre-built community solutions.",
  slug: "/templates",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function TemplatesPage() {
  return (
    <div>
      <Heading
        id={"templates"}
        title={"Find your Contract"}
        subHeader="Jumpstart your projects development process with pre-built community solutions."
      />
      <SiteContentContainer>
        <div className="mt-4 min-h-[1200px] border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <ContractTemplatesGrid />
        </div>
      </SiteContentContainer>
    </div>
  )
}
