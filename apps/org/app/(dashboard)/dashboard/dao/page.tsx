import { DashboardContainer } from "@/components/dashboard-container"
import { DashboardTitle } from "@/components/dashboard-title"
import { UnderConstruction } from "@/components/under-construction"
import { Web3Wrapper } from "@/components/web3-wrapper"

export default function DAOPage() {
  return (
    <div className="my-10 xl:max-w-none">
      <DashboardTitle
        title="X7 DAO"
        secondaryButton={{ text: "Tokens Overview", href: "/tokens" }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <UnderConstruction />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
