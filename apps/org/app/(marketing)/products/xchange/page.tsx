import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function XChangePage() {
  return (
    <div>
      <Heading
        id={"xchange"}
        title={"xChange"}
        subHeader="xChange is a decentralized exchange that allows users to swap tokens permissionlessly"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          here is the content
        </div>
      </SiteContentContainer>
    </div>
  )
}
