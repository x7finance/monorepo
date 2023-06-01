import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export default function TokensPage() {
  return (
    <div>
      <Heading
        id={"tokens"}
        title={"Tokens"}
        subHeader="X7 has 7 core tokens that are used to ensure the protocol is running optimally"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
