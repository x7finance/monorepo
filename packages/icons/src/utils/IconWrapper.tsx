/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { FC, MouseEventHandler, ReactElement, SVGAttributes } from "react";
import { createElement } from "react";

import { cn } from "@x7/css";

import arbitrum from "../glyphs/arbitrum";
import base from "../glyphs/base";
import bsc from "../glyphs/bsc";
import dextools from "../glyphs/dextools";
import ethereum from "../glyphs/ethereum";
import etherscan from "../glyphs/etherscan";
import loading from "../glyphs/loading";
import opensea from "../glyphs/opensea";
import optimism from "../glyphs/optimism";
import polygon from "../glyphs/polygon";

type GlyphProps = SVGAttributes<SVGSVGElement> & {
  fill?: string;
  rotate?: number;
};

interface IconProps {
  glyph: Glyph;
  size?: number;
  onClick?: MouseEventHandler<SVGSVGElement>;
  fill?: string;
  rotate?: number;
  height?: number;
  isAbsolute?: boolean;
  secondaryFill?: string;
  text?: string;
  containerClass?: string;
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
  [Glyph.loading]: loading as FC<GlyphProps>,
  [Glyph.arbitrum]: arbitrum,
  [Glyph.bsc]: bsc,
  [Glyph.ethereum]: ethereum,
  [Glyph.etherscan]: etherscan,
  [Glyph.optimism]: optimism,
  [Glyph.polygon]: polygon,
  [Glyph.dextools]: dextools,
  [Glyph.base]: base,
  [Glyph.opensea]: opensea,
};

export function IconWrapper(props: IconProps): ReactElement {
  const { glyph, fill, rotate, size = 8, containerClass = "", ...res } = props;

  return (
    <span className={cn(`w-${size} h-${size} inline-block`, containerClass)}>
      {createElement(GLYPH_MAPS[glyph], {
        fill: fill || "currentColor",
        rotate,
        ...res,
      })}
    </span>
  );
}

IconWrapper.Glyph = Glyph;
