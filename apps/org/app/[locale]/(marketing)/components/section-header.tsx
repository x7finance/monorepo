import { cn } from "utils"

import { PioneerDrop } from "@/components/pioneer-drop"

export function SectionHeader(props: any) {
  const {
    pioneerId,
    subHeader,
    header,
    description,
    lineColor,
    gradientColor,
    hasSubSection,
  } = props

  return (
    <div
      className={cn(
        "mx-auto max-w-2xl text-center",
        !hasSubSection ? `mb-16` : ``
      )}
    >
      <PioneerDrop pioneerId={pioneerId} lineColor={lineColor} />
      <p
        className={cn(
          gradientColor,
          `inline font-bold bg-gradient-to-r bg-clip-text font-display text-xl sm:text-3xl my-3 uppercase text-transparent`
        )}
      >
        {subHeader}
      </p>
      <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl dark:text-white text-black">
        {header}
      </h2>

      <p className="mt-6 text-xl leading-8 text-zinc-400 dark:text-zinc-500">
        {description}
      </p>
    </div>
  )
}
