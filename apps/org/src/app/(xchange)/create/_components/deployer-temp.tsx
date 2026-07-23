import Image from "next/image"

import { Card, CardContent } from "@x7/ui/card"
import { LinkExternal } from "@x7/ui/link"

export function DeployerTemp() {
  return (
    <Card className="mx-auto mt-8 max-w-lg transition-colors duration-300 hover:border-emerald-500 focus:z-20">
      <CardContent>
        <div className="flex flex-col items-center space-y-6 p-6 text-center">
          <div className="flex justify-center">
            <Image
              src="/images/logos/deployyyyer.svg"
              alt="Deployer Logo"
              width={120}
              height={120}
            />
          </div>
          <h2 className="font-heading text-xl font-bold">Coming Soon...</h2>

          <div className="text-muted-foreground space-y-4">
            <p>
              Deploy Multiverse's Lending Pool is here to provide the crucial
              liquidity boost your project needs. Focus on building your
              community and let us handle the financial stress.
            </p>
            <p>
              In partnership with{" "}
              <LinkExternal
                href="https://x.com/X7_Finance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @X7_Finance
              </LinkExternal>
              , Deploy Multiverse is building Lending Pools to provide users
              with essential liquidity loans.
            </p>
          </div>

          <p className="font-semibold">
            Deploy with confidence, succeed with lending pools!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
