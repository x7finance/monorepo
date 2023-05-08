import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function DexMaxiPage() {
  return (
    <div>
      <Heading
        id={"dex-maxi"}
        title={"DEX Maxi NFT"}
        subHeader="Lower costs on X7's LDEX"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          Dex Maxi NFTs provide users of our Dex an additional layer of
          flexibility during trading. Dex users will find this NFT useful
          towards a more frictionless trading experience.
          <div>
            <ul>
              <li>50% discount on DEX LP fee</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
