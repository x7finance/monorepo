import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { PioneerDrop } from "@/components/pioneer-drop"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/(marketing)/components/heading"

const metadata = {
  title: "Styles",
  description:
    "Embark on Your DeFi Journey with X7 Finance: A comprehensive platform tailored for investors and project launchers. Delve into our innovative DeFi solutions, including our Automated Market Making (AMM) Decentralized Exchange (DEX), Lending Pool, and Initial Liquidity Loans. Explore our democratic DAO governance model and learn how to participate. Whether you're an investor seeking opportunities or a project launcher aiming for success, X7 Finance is your portal to the future of decentralized finance.",
  slug: "/styles",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

const colorList = [
  "background",
  "foreground",
  "muted",
  "muted-foreground",
  "popover",
  "popover-foreground",
  "border",
  "input",
  "card",
  "card-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "nav-shadow-color",
  "ring",
]

export default function GettingStartedPage() {
  return (
    <div>
      <Heading
        id={"Styles"}
        title={"X7 Styles"}
        subHeader={"Styles helping us build the X7 ecosystem"}
      />
      <SiteContentContainer>
        <PioneerDrop pioneerId="2239" lineColor="to-emerald-500" />
        <div>
          <div className="grid grid-cols-2 p-4">
            {colorList.map((color) => (
              <div
                key={color}
                className="flex items-center p-2 rounded-md odd:rounded-r-none even:rounded-l-none odd:border-r-0 even:border-l-0 mb-2 border-zinc-200/30 border"
              >
                <div
                  className="w-12 h-12 mr-4 rounded-full border dark:border-zinc-700 border-zinc-300"
                  style={{ backgroundColor: `hsl(var(--${color}))` }}
                ></div>
                <p className="text-sm font-bold">{color}</p>
              </div>
            ))}
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
