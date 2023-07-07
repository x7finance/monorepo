import React from "react"

import {
  ChainEnum,
  ChainNameEnum,
  ChainScannerEnum,
  ChainScannerLinksEnum,
} from "@x7/common"

import { Glyph, IconWrapper } from "./IconWrapper"

interface Chain {
  name: ChainNameEnum
  id: ChainEnum
  icon: React.ReactElement
  scanner: ChainScannerEnum
  scannerLink: ChainScannerLinksEnum
}

export const ChainsArray: Chain[] = [
  {
    name: ChainNameEnum.erc,
    id: ChainEnum.erc,
    icon: <IconWrapper glyph={Glyph.ethereum} size={5} />,
    scanner: ChainScannerEnum.erc,
    scannerLink: ChainScannerLinksEnum.erc,
  },
  {
    name: ChainNameEnum.bsc,
    id: ChainEnum.bsc,
    icon: <IconWrapper glyph={Glyph.bsc} size={5} />,
    scanner: ChainScannerEnum.bsc,
    scannerLink: ChainScannerLinksEnum.bsc,
  },
  {
    name: ChainNameEnum.polygon,
    id: ChainEnum.polygon,
    icon: <IconWrapper glyph={Glyph.polygon} size={5} />,
    scanner: ChainScannerEnum.polygon,
    scannerLink: ChainScannerLinksEnum.polygon,
  },
  {
    name: ChainNameEnum.arbitrum,
    id: ChainEnum.arbitrum,
    icon: <IconWrapper glyph={Glyph.arbitrum} size={5} />,
    scanner: ChainScannerEnum.arbitrum,
    scannerLink: ChainScannerLinksEnum.arbitrum,
  },
  {
    name: ChainNameEnum.optimism,
    id: ChainEnum.optimism,
    icon: <IconWrapper glyph={Glyph.optimism} size={5} />,
    scanner: ChainScannerEnum.optimism,
    scannerLink: ChainScannerLinksEnum.optimism,
  },
]
