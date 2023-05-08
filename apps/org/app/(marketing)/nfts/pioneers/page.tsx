import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function PioneersPage() {
  return (
    <div>
      <Heading
        id={"pioneers"}
        title={"Pioneers NFT"}
        subHeader="Pioneers NFTs were a limited edition NFT that were gifted to early supporters of the X7 Finance."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          content here
        </div>
      </SiteContentContainer>
    </div>
  )
}
