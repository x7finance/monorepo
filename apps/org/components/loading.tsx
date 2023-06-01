import { cn } from "utils"
import { IconWrapper } from "icons"

export function Loading({
  size = 6,
  fill = "currentColor",
  containerClass = "",
}: {
  size?: number
  fill?: string
  containerClass?: string
}): JSX.Element {
  return (
    <div
      className={cn(
        containerClass
          ? containerClass
          : "relative z-50 flex flex-auto items-center justify-center self-stretch"
      )}
    >
      <IconWrapper glyph={IconWrapper.glyph.loading} fill={fill} size={size} />
    </div>
  )
}
