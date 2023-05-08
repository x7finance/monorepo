import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function X7102TokenPage() {
  return (
    <div>
      <Heading
        id={"x7102"}
        title={"X7102"}
        subHeader="X7102 is the second constellation token"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          here is the content
        </div>
      </SiteContentContainer>
    </div>
  )
}
