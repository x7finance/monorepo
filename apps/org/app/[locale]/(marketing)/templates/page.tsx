import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/[locale]/(marketing)/components/heading"

import { ContractTemplatesGrid } from "./grid"

const metadata = {
  title: "Templates",
  description:
    "Jumpstart your projects development process with pre-built community solutions.",
  slug: "/templates",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
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
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5 min-h-[1200px]">
          <ContractTemplatesGrid />
        </div>
      </SiteContentContainer>
    </div>
  )
}
