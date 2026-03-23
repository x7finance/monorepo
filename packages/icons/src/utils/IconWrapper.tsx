/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { FC, MouseEventHandler, ReactElement, SVGAttributes } from "react"
import { createElement } from "react"

import { cn } from "@x7/css"

import glyphArbitrum from "../glyphs/arbitrum"
import glyphBase from "../glyphs/base"
import glyphBsc from "../glyphs/bsc"
import glyphDextools from "../glyphs/dextools"
import glyphEthereum from "../glyphs/ethereum"
import glyphEtherscan from "../glyphs/etherscan"
import glyphLoading from "../glyphs/loading"
import glyphOpensea from "../glyphs/opensea"
import glyphOptimism from "../glyphs/optimism"
import glyphPolygon from "../glyphs/polygon"

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
  etherscan,
  optimism,
  polygon,
  dextools,
  base,
  opensea,
}

export const GLYPH_MAPS: Record<Glyph, FC<GlyphProps>> = {
  [Glyph.loading]: glyphLoading as FC<GlyphProps>,
  [Glyph.arbitrum]: glyphArbitrum,
  [Glyph.bsc]: glyphBsc,
  [Glyph.ethereum]: glyphEthereum,
  [Glyph.etherscan]: glyphEtherscan,
  [Glyph.optimism]: glyphOptimism,
  [Glyph.polygon]: glyphPolygon,
  [Glyph.dextools]: glyphDextools,
  [Glyph.base]: glyphBase,
  [Glyph.opensea]: glyphOpensea,
}

export function IconWrapper(props: IconProps): ReactElement {
  const { glyph, fill, rotate, size = 8, containerClass = "", ...res } = props

  return (
    <span className={cn(`w-${size} h-${size} inline-block`, containerClass)}>
      {createElement(GLYPH_MAPS[glyph], {
        fill: fill || "currentColor",
        rotate,
        ...res,
      })}
    </span>
  )
}

IconWrapper.Glyph = Glyph
