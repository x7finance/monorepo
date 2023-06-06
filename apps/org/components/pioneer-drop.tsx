import { cn } from "utils"

import Image from "next/image"

export function PioneerDrop(props: { pioneerId: string; lineColor: string }) {
  const { pioneerId, lineColor } = props

  return (
    <div className="mb-6">
      <span
        className={cn(
          lineColor,
          "w-[1px] mx-auto block h-[100px] bg-gradient-to-b pioneer-line-drop"
        )}
      />
      <Image
        height={200}
        width={200}
        className="h-auto w-12 mx-auto overflow-hidden rounded-full shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
        src={`https://img.x7.finance/pioneers/${pioneerId}.png`}
        alt="Random Pioneer Image"
      />
    </div>
  )
}
