import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export default function ProductsPage() {
  return (
    <div>
      <Heading
        id={"products"}
        title={"Products"}
        subHeader="X7 Protocol is a suite of products that enable users permissionless access to the world of DeFi"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
