import { createElement, MemoExoticComponent } from 'react';
import { cn } from 'utils';

import arbitrum from '../glyphs/arbitrum';
import bsc from '../glyphs/bsc';
import dextools from '../glyphs/dextools';
import ethereum from '../glyphs/ethereum';
import loading from '../glyphs/loading';
import optimism from '../glyphs/optimism';
import polygon from '../glyphs/polygon';

interface IconProps {
  glyph: glyph;
  size?: number;
  onClick?: any;
  fill?: string;
  rotate?: number;
  height?: number;
  isAbsolute?: boolean;
  secondaryFill?: string;
  text?: string;
  containerClass?: string;
}

export enum glyph {
  loading,
  arbitrum,
  bsc,
  ethereum,
  optimism,
  polygon,
  dextools,
}

export const GLYPH_MAPS: Record<glyph, MemoExoticComponent<any>> = {
  [glyph.loading]: loading,
  [glyph.arbitrum]: arbitrum,
  [glyph.bsc]: bsc,
  [glyph.ethereum]: ethereum,
  [glyph.optimism]: optimism,
  [glyph.polygon]: polygon,
  [glyph.dextools]: dextools,
};

function IconWrapper(props: IconProps): JSX.Element {
  const { glyph, fill, rotate, size = 8, containerClass = '', ...res } = props;

  return (
    <span className={cn(`w-${size} h-${size} inline-block`, containerClass)}>
      {createElement(GLYPH_MAPS[glyph], {
        fill: fill ? fill : 'currentColor',
        ...res,
        rotate,
      })}
    </span>
  );
}

export default IconWrapper;

IconWrapper.glyph = glyph;
