import type { Metadata } from "next"

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { CoinDetails } from "../_components/coin-details"

interface Props {
  params: Promise<{ contract: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contract } = await params
  return generateMetadataFromDoc({
    title: "Token Details",
    description:
      "View live price, liquidity, market cap and trading activity for this token on X7 Finance Xchange — the DAO-governed leveraged-liquidity DEX.",
    slug: `/coin/${contract}`,
  })
}

export default function CoinDetailsPage() {
  return <CoinDetails />
}
