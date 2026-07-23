import type { Metadata } from "next"

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { DeployerBase } from "./_components/base"

const metadata = {
  title: "Deployer",
  description: "Powered by Deployer",
  slug: "/deployer",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function DeployerPage() {
  return (
    <div className="relative mx-auto mb-40">
      <div className="flex-1">
        <div className="mx-auto">
          <DeployerBase />
        </div>
      </div>
    </div>
  )
}
