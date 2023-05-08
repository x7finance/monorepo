import {
  ChainEnum,
  ChainNameEnum,
  ChainScannerEnum,
  ChainScannerLinksEnum,
} from 'common';

import IconWrapper from './IconWrapper';

export const ChainsArray = [
  {
    name: ChainNameEnum.erc,
    id: ChainEnum.erc,
    icon: <IconWrapper glyph={IconWrapper.glyph.ethereum} size={5} />,
    scanner: ChainScannerEnum.erc,
    scannerLink: ChainScannerLinksEnum.erc,
  },
  {
    name: ChainNameEnum.bsc,
    id: ChainEnum.bsc,
    icon: <IconWrapper glyph={IconWrapper.glyph.bsc} size={5} />,
    scanner: ChainScannerEnum.bsc,
    scannerLink: ChainScannerLinksEnum.bsc,
  },
  {
    name: ChainNameEnum.polygon,
    id: ChainEnum.polygon,
    icon: <IconWrapper glyph={IconWrapper.glyph.polygon} size={5} />,
    scanner: ChainScannerEnum.polygon,
    scannerLink: ChainScannerLinksEnum.polygon,
  },
  {
    name: ChainNameEnum.arbitrum,
    id: ChainEnum.arbitrum,
    icon: <IconWrapper glyph={IconWrapper.glyph.arbitrum} size={5} />,
    scanner: ChainScannerEnum.arbitrum,
    scannerLink: ChainScannerLinksEnum.arbitrum,
  },
  {
    name: ChainNameEnum.optimism,
    id: ChainEnum.optimism,
    icon: <IconWrapper glyph={IconWrapper.glyph.optimism} size={5} />,
    scanner: ChainScannerEnum.optimism,
    scannerLink: ChainScannerLinksEnum.optimism,
  },
];
