import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function X7RTokenPage() {
  return (
    <div>
      <Heading
        id={"x7r"}
        title={"X7R"}
        subHeader="X7R is the main X7 reward token for people that want access to the upside of the protocol"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          here is the content
        </div>
      </SiteContentContainer>
    </div>
  )
}
