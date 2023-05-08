import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

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
          here is the content
        </div>
      </SiteContentContainer>
    </div>
  )
}
