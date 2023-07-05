import type { FC, MouseEventHandler, ReactElement, SVGAttributes } from "react"
import { createElement } from "react"

import { cn } from "@x7/utils"

import arbitrum from "../glyphs/arbitrum"
import bsc from "../glyphs/bsc"
import dextools from "../glyphs/dextools"
import ethereum from "../glyphs/ethereum"
import loading from "../glyphs/loading"
import optimism from "../glyphs/optimism"
import polygon from "../glyphs/polygon"

type GlyphProps = SVGAttributes<SVGSVGElement> & {
  fill?: string
  rotate?: number
}

interface IconProps {
  glyph: Glyph
  size?: number
  onClick?: MouseEventHandler<SVGSVGElement>
  fill?: string
  rotate?: number
  height?: number
  isAbsolute?: boolean
  secondaryFill?: string
  text?: string
  containerClass?: string
}

export enum Glyph {
  loading,
  arbitrum,
  bsc,
  ethereum,
  optimism,
  polygon,
  dextools,
}

export const GLYPH_MAPS: Record<Glyph, FC<GlyphProps>> = {
  // @ts-expect-error: TODO: fix this
  [Glyph.loading]: loading,
  [Glyph.arbitrum]: arbitrum,
  [Glyph.bsc]: bsc,
  [Glyph.ethereum]: ethereum,
  [Glyph.optimism]: optimism,
  [Glyph.polygon]: polygon,
  [Glyph.dextools]: dextools,
}

export function IconWrapper(props: IconProps): ReactElement {
  const { glyph, fill, rotate, size = 8, containerClass = "", ...res } = props

  return (
    <span className={cn(`w-${size} h-${size} inline-block`, containerClass)}>
      {createElement(GLYPH_MAPS[glyph], {
        fill: fill ? fill : "currentColor",
        rotate,
        ...res,
      })}
    </span>
  )
}

IconWrapper.Glyph = Glyph
