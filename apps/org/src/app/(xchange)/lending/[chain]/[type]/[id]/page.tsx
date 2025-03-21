import type { Metadata } from "next";

import type { ChainShortNameType, LoanType } from "@x7/utils";

import { LoanDetails } from "~/app/(dashboard)/_components/loan/details";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { XchangeLinks } from "~/types/links";

const metadata = {
  title: "Loan Details",
  description:
    "Stay updated with X7 Finance's Onchain Loans Dashboard: A real-time platform showcasing all the latest loans on Xchange. Our dashboard provides comprehensive data on each loan, allowing you to make informed trading decisions. Track the performance of your favorite loans, discover new trading opportunities, and navigate the DeFi market with confidence. Experience the pulse of decentralized trading with X7 Finance's Onchain Loans Dashboard.",
  section: "dashboard",
  slug: XchangeLinks.Lending,
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

interface Props {
  params: Promise<{ id: string; chain: ChainShortNameType; type: LoanType }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoanDetailsPage({ params }: Props) {
  const { id, chain, type } = await params;
  const _id = parseInt(id, 10);

  return (
    <div className="xl:max-w-none">
      <LoanDetails chain={chain} loanType={type} loanId={_id} />
    </div>
  );
}
