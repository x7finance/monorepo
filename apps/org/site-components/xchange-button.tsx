import { cn } from "@x7/utils"

interface XchangeButtonProps {
  forceXchange?: boolean
}

export function XchangeButton(props: XchangeButtonProps) {
  const { forceXchange } = props
  return (
    <span className="whitespace-nowrap">
      <span>Trade</span>
      <span
        className={cn(
          forceXchange ? `ml-1 inline-block` : `hidden`,
          `xl:ml-1 xl:inline-block`
        )}
      >
        on Xchange
      </span>
    </span>
  )
}
