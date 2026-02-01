import { cn } from "@x7/css"
import { buttonVariants } from "@x7/ui/button"
import { Card, CardContent } from "@x7/ui/card"
import { LinkInternal } from "@x7/ui/link"
import { TabsContent } from "@x7/ui/tabs"
import { MyOpenLiquidityPositions } from "~/app/(xchange)/liquidity/_components/my-positions"

export function PoolsTab() {
  return (
    <TabsContent value="pools">
      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardContent className="space-y-4 p-0">
          <div className="mb-4 w-full px-4">
            <LinkInternal
              prefetch={true}
              href={`liquidity?tab=my-open-positions`}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
                "w-full"
              )}
            >
              Manage Positions
            </LinkInternal>
          </div>

          <div className="mt-2">
            <MyOpenLiquidityPositions view="small" />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
