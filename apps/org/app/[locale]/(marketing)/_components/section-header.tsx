import { PioneerDrop } from "@/site-components/pioneer-drop"

import { cn } from "@x7/utils"

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
          `font-display my-3 inline bg-gradient-to-r bg-clip-text text-xl font-bold uppercase text-transparent sm:text-3xl`
        )}
      >
        {subHeader}
      </p>
      <h2 className="font-heading text-3xl leading-[1.1] text-black dark:text-white sm:text-3xl md:text-6xl">
        {header}
      </h2>

      <p className="mt-6 text-xl leading-8 text-zinc-400 dark:text-zinc-500">
        {description}
      </p>
    </div>
  )
}
