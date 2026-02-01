import { DialogContent, DialogHeader, DialogTitle } from "@x7/ui/dialog"

interface HowItWorksDialogContentProps {
  _children?: React.ReactNode
}

export function HowItWorksDialogContent({
  _children,
}: HowItWorksDialogContentProps) {
  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>
          Xchange is different. Stop contemplating. Start launching.
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            We believe too many talented individuals waste their time and skill
            working on ideas and businesses the market doesn't want.
          </p>

          <p className="text-sm text-muted-foreground">
            Xchange helps bring ideas to market through project developers and
            AI agents 🤖, letting the market quickly decide if an idea is worth
            pursuing.
          </p>

          <p className="text-sm text-muted-foreground">
            Xchange offers startup capital at little to no cost, so you can
            focus on launching your idea instead of contemplating it.
          </p>

          <div className="space-y-4">
            <h3 className="font-medium">Key points about Xchange :</h3>
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
              <li>
                There are no hidden taxes or fees charged by the platform for
                trading. Only a lower than industry standard 0.2% fee to X7 and
                liquidity providers.
              </li>
              <li>
                Once a Liquidity Pool is deployed, trading starts immediately
                with an Xchange V2 Liquidity Pool.
              </li>
              <li>
                The only liquidity owed back to the protocol is what's initially
                lent, meaning active coins will always be tradable.
              </li>
              <li>
                Xchange can also provide institutional-sized capital to bright
                minds with bold ideas for their initial Liquidity Pool at
                launch.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
