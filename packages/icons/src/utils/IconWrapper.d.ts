import type { FC, MouseEventHandler, ReactElement, SVGAttributes } from "react";
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
export declare enum Glyph {
    loading = 0,
    arbitrum = 1,
    bsc = 2,
    ethereum = 3,
    etherscan = 4,
    optimism = 5,
    polygon = 6,
    dextools = 7,
    base = 8,
    opensea = 9
}
export declare const GLYPH_MAPS: Record<Glyph, FC<GlyphProps>>;
export declare function IconWrapper(props: IconProps): ReactElement;
export declare namespace IconWrapper {
    var Glyph: typeof import("./IconWrapper").Glyph;
}
//# sourceMappingURL=IconWrapper.d.ts.map