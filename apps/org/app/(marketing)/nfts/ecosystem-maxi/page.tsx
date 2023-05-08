import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function EcosystemMaxiPage() {
  return (
    <div>
      <Heading
        id={"ecosystem-maxi"}
        title={"Ecosystem Maxi NFT"}
        subHeader="Lower fees on trades"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          The Ecosystem Maxi NFTs are for your everyday X7 maximalist. Ownership
          will provide traders with added flexibility during their trading
          experience between trading pairs.
          <div>
            <ul>
              <li>25% fee discount on X7100</li>
              <li>10% fee discount on X7DAO and X7R</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
