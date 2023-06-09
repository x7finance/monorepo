import type { Metadata } from "next"
import { Web3Wrapper } from "@/site-components/web3-wrapper"

import type { ChainShortNameType, LoanType } from "@x7/common"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardContainer } from "@/app/[locale]/(dashboard)/_components/dashboard-container"
import { DashboardTitle } from "@/app/[locale]/(dashboard)/_components/dashboard-title"
import { LoanDetails } from "@/app/[locale]/(dashboard)/_components/loan/details"

const metadata = {
  title: "Loan Details",
  description:
    "Stay updated with X7 Finance's Live Loans Dashboard: A real-time platform showcasing all the latest loans on Xchange. Our dashboard provides comprehensive data on each loan, allowing you to make informed trading decisions. Track the performance of your favorite loans, discover new trading opportunities, and navigate the DeFi market with confidence. Experience the pulse of decentralized trading with X7 Finance's Live Loans Dashboard.",
  section: "dashboard",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

interface Props {
  params: { id: string; chain: ChainShortNameType; type: LoanType }
}

export default function LoanDetailsPage({ params }: Props) {
  const { chain, type } = params

  return (
    <div className="xl:max-w-none">
      <DashboardTitle
        title="Loan Details"
        subHeader=""
        secondaryButton={{
          text: "View Loan Options",
          href: "/loans",
        }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <LoanDetails chain={chain} loanType={type} loanId={params.id} />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
