import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export default function XChangePage() {
  return (
    <div>
      <Heading
        id={"xchange"}
        title={"XChange"}
        subHeader="XChange is a decentralized exchange that allows users to swap tokens permissionlessly"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
