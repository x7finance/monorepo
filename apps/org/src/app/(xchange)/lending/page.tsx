import type { Metadata } from "next";

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { XchangeLinks } from "~/types/links";
import { LendingBase } from "./_components/base";

const metadata = {
  title: "Xchange Lending",
  description:
    "X7 Finance: View and manage your liquidity loans on the Xchange protocol.",
  slug: XchangeLinks.Lending,
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function LendingPage() {
  return (
    <div className="relative mx-auto mb-40">
      <div className="flex-1">
        <div className="mx-auto">
          <LendingBase />
        </div>
      </div>
    </div>
  );
}
