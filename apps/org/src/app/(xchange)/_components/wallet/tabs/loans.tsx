import { Card, CardContent } from "@x7/ui/card"
import { TabsContent } from "@x7/ui/tabs"
import { UnderConstruction } from "~/lib/components/core/under-construction"

export function LoansTab() {
  return (
    <TabsContent value="loans">
      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardContent className="space-y-2 p-0">
          <UnderConstruction type="small" />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
