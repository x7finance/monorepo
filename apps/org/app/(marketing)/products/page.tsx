import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

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
          here is the content
        </div>
      </SiteContentContainer>
    </div>
  )
}
