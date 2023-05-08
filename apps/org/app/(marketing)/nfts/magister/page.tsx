import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export default function MagisterNftPage() {
  return (
    <div>
      <Heading
        id={"magister"}
        title={"Magister NFT"}
        subHeader="Veto power in DAO votes"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          Each Magister token will cost 50 ETH to mint, and that ETH will go
          directly into token liquidity across the ecosystem. The Magister token
          also offers discounts on dex trading and loan origination.
          <div>
            MAGISTER NFTs are designed to give investors responsible access to
            higher DAO voting privileges. Providing this ensures a proper array
            of checks and balances to the ecosystem. The MAGISTER NFTs also
            provide owners with the similar high tier benefits of Ecosystem,
            Liquidity, Dex and Borrower Maxi NFTs.
            <ul>
              <li>Majority MAGISTER vote overrides 50-75% yea DAO vote</li>
              <li>50% discount on DEX LP fee</li>
              <li>20% loan origination fee reduction</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
