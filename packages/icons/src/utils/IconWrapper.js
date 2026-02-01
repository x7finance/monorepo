import { jsx as _jsx } from "react/jsx-runtime";
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
export { Glyph };
var Glyph;
(function (Glyph) {
    Glyph[Glyph["loading"] = 0] = "loading";
    Glyph[Glyph["arbitrum"] = 1] = "arbitrum";
    Glyph[Glyph["bsc"] = 2] = "bsc";
    Glyph[Glyph["ethereum"] = 3] = "ethereum";
    Glyph[Glyph["etherscan"] = 4] = "etherscan";
    Glyph[Glyph["optimism"] = 5] = "optimism";
    Glyph[Glyph["polygon"] = 6] = "polygon";
    Glyph[Glyph["dextools"] = 7] = "dextools";
    Glyph[Glyph["base"] = 8] = "base";
    Glyph[Glyph["opensea"] = 9] = "opensea";
})(Glyph || (Glyph = {}));
export const GLYPH_MAPS = {
    [Glyph.loading]: loading,
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
export function IconWrapper(props) {
    const { glyph, fill, rotate, size = 8, containerClass = "", ...res } = props;
    return (_jsx("span", { className: cn(`w-${size} h-${size} inline-block`, containerClass), children: createElement(GLYPH_MAPS[glyph], {
            fill: fill || "currentColor",
            rotate,
            ...res,
        }) }));
}
IconWrapper.Glyph = Glyph;
//# sourceMappingURL=IconWrapper.js.map