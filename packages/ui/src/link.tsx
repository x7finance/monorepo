import type { AnchorHTMLAttributes, FC } from "react"

import Link from "next/link"

const LinkInternal = Link
const LinkExternal: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}) => {
  return <a {...props} target={target} rel={rel} />
}

export { LinkExternal, LinkInternal }
