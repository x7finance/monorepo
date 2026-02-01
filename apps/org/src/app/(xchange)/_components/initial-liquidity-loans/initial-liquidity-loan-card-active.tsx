/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */

import { Tag } from "@x7/ui/tag"

/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
interface ILLCardLiquidationActiveProps {
  principalPaymentSchedule: number[][]
}

export function ILLCardActiveStatus({
  principalPaymentSchedule,
}: ILLCardLiquidationActiveProps) {
  const loanActive = getLoanActive(principalPaymentSchedule)

  return (
    <div className="flex w-full border-t border-muted py-2">
      <h4 className="text-sm text-muted-foreground">Active loan</h4>
      <div className="ml-auto">
        {loanActive ? (
          <Tag variant="large" color="emerald">
            Yes
          </Tag>
        ) : (
          <Tag variant="large" color="zinc">
            No
          </Tag>
        )}
      </div>
    </div>
  )
}

function getLoanActive(principalPaymentSchedule: any): boolean {
  const lastPaymentTs =
    principalPaymentSchedule?.[0][principalPaymentSchedule?.[0].length - 1]
  const currentTimeUnix = Math.floor(new Date().getTime() / 1000)
  return lastPaymentTs > currentTimeUnix
}
