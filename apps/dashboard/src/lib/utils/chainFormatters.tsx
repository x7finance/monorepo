import { SignalSlashIcon } from '@heroicons/react/20/solid';
import { Chain } from 'wagmi';

import Icon from '../../components/icons';
import {
  BlockchainType,
  ChainDenominationEnum,
  ChainEnum,
  ChainIdentifierEnum,
  ChainNameEnum,
  ChainScannerEnum,
  ChainScannerLinksEnum,
  ChainTokenOracleEtherUSDEnum,
  TokenContractAddresses,
} from '../types';

export function generateChainDenomination(chain: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return ChainDenominationEnum.erc;
    case ChainEnum.optimism:
      return ChainDenominationEnum.optimism;
    case ChainEnum.bsc:
      return ChainDenominationEnum.bsc;
    case ChainEnum.polygon:
      return ChainDenominationEnum.polygon;
    case ChainEnum.arbitrum:
      return ChainDenominationEnum.arbitrum;
    default:
      return ChainDenominationEnum.erc;
  }
}

export function generateChainIdentifier(chain: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return ChainIdentifierEnum.erc;
    case ChainEnum.optimism:
      return ChainIdentifierEnum.optimism;
    case ChainEnum.bsc:
      return ChainIdentifierEnum.bsc;
    case ChainEnum.polygon:
      return ChainIdentifierEnum.polygon;
    case ChainEnum.arbitrum:
      return ChainIdentifierEnum.arbitrum;
    default:
      return ChainIdentifierEnum.erc;
  }
}

export function generateChainBase(chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return ChainScannerLinksEnum.erc;
    case ChainEnum.bsc:
      return ChainScannerLinksEnum.bsc;
    case ChainEnum.polygon:
      return ChainScannerLinksEnum.polygon;
    case ChainEnum.arbitrum:
      return ChainScannerLinksEnum.arbitrum;
    case ChainEnum.optimism:
      return ChainScannerLinksEnum.optimism;
    default:
      return ChainScannerLinksEnum.erc;
  }
}

export function generateChainAbbreviation(chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return ChainDenominationEnum.erc;
    case ChainEnum.bsc:
      return ChainDenominationEnum.bsc;
    case ChainEnum.arbitrum:
      return ChainDenominationEnum.arbitrum;
    case ChainEnum.optimism:
      return ChainDenominationEnum.optimism;
    case ChainEnum.polygon:
      return ChainDenominationEnum.polygon;
    default:
      return 'ETH';
  }
}

export function generateNativeQueryCommands(chainId?: BlockchainType) {
  switch (chainId) {
    case ChainEnum.erc:
      return { nativeCurrency: 'ethereum' };
    case ChainEnum.bsc:
      return { nativeCurrency: 'binancecoin' };
    case ChainEnum.polygon:
      return { nativeCurrency: 'matic' };
    case ChainEnum.optimism:
      return { nativeCurrency: 'ethereum' };
    case ChainEnum.arbitrum:
      return { nativeCurrency: 'ethereum' };
    default:
      return { nativeCurrency: 'ethereum' };
  }
}

export function generateChainEtherTokenEnum(chainId?: BlockchainType) {
  switch (chainId) {
    case ChainEnum.erc:
      return TokenContractAddresses.WETH;
    case ChainEnum.bsc:
      return TokenContractAddresses.BNB;
    case ChainEnum.polygon:
      return TokenContractAddresses.MATIC;
    case ChainEnum.arbitrum:
      return TokenContractAddresses.WETH;
    case ChainEnum.optimism:
      return TokenContractAddresses.WETH;
    default:
      return TokenContractAddresses.WETH;
  }
}

export function generateChainTokenOracleEtherUSDEnum(chainId?: BlockchainType) {
  switch (chainId) {
    case ChainEnum.erc:
      return ChainTokenOracleEtherUSDEnum.erc;
    case ChainEnum.bsc:
      return ChainTokenOracleEtherUSDEnum.bsc;
    case ChainEnum.polygon:
      return ChainTokenOracleEtherUSDEnum.polygon;
    case ChainEnum.arbitrum:
      return ChainTokenOracleEtherUSDEnum.arbitrum;
    case ChainEnum.optimism:
      return ChainTokenOracleEtherUSDEnum.optimism;
    default:
      return ChainTokenOracleEtherUSDEnum.erc;
  }
}

export function renderConnectedChain(chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return <Icon glyph={Icon.glyph.ethereum} size={5} />;
    case ChainEnum.bsc:
      return <Icon glyph={Icon.glyph.bsc} size={5} />;
    case ChainEnum.polygon:
      return <Icon glyph={Icon.glyph.polygon} size={5} />;
    case ChainEnum.optimism:
      return <Icon glyph={Icon.glyph.optimism} size={5} />;
    case ChainEnum.arbitrum:
      return <Icon glyph={Icon.glyph.arbitrum} size={5} />;
    case ChainEnum.offline:
      return (
        <SignalSlashIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
      );
    default:
      return (
        <SignalSlashIcon className="h-5 w-5 text-black" aria-hidden="true" />
      );
  }
}

export function providerLinkGenerator(chain: Chain) {
  switch (chain?.id) {
    case ChainEnum.erc: {
      return {
        ankr: 'eth',
        blast: 'eth-mainnet',
        blockpi: 'ethereum',
        getblock: 'eth',
        pocket: 'eth-mainnet',
      };
    }
    case ChainEnum.bsc: {
      return {
        ankr: 'bsc',
        blast: 'bsc-mainnet',
        blockpi: 'bsc',
        getblock: 'bsc',
        pocket: 'bsc-mainnet',
      };
    }
    case ChainEnum.polygon: {
      return {
        ankr: 'polygon',
        blast: 'polygon-mainnet',
        blockpi: 'polygon',
        getblock: 'matic',
        pocket: 'poly-mainnet',
      };
    }
    case ChainEnum.optimism: {
      return {
        ankr: 'optimism',
        blast: 'optimism-mainnet',
        blockpi: 'optimism',
        getblock: 'op',
        pocket: 'optimism-mainnet',
      };
    }
    case ChainEnum.arbitrum: {
      return {
        ankr: 'arbitrum',
        blast: 'eth-mainnet',
        blockpi: 'arbitrum',
        getblock: 'arbitrum',
        pocket: 'arbitrum-one',
      };
    }
  }
}

export const chainsArray = [
  {
    name: ChainNameEnum.erc,
    id: ChainEnum.erc,
    icon: <Icon glyph={Icon.glyph.ethereum} size={5} />,
    scanner: ChainScannerEnum.erc,
    scannerLink: ChainScannerLinksEnum.erc,
  },
  {
    name: ChainNameEnum.bsc,
    id: ChainEnum.bsc,
    icon: <Icon glyph={Icon.glyph.bsc} size={5} />,
    scanner: ChainScannerEnum.bsc,
    scannerLink: ChainScannerLinksEnum.bsc,
  },
  {
    name: ChainNameEnum.polygon,
    id: ChainEnum.polygon,
    icon: <Icon glyph={Icon.glyph.polygon} size={5} />,
    scanner: ChainScannerEnum.polygon,
    scannerLink: ChainScannerLinksEnum.polygon,
  },
  {
    name: ChainNameEnum.arbitrum,
    id: ChainEnum.arbitrum,
    icon: <Icon glyph={Icon.glyph.arbitrum} size={5} />,
    scanner: ChainScannerEnum.arbitrum,
    scannerLink: ChainScannerLinksEnum.arbitrum,
  },
  {
    name: ChainNameEnum.optimism,
    id: ChainEnum.optimism,
    icon: <Icon glyph={Icon.glyph.optimism} size={5} />,
    scanner: ChainScannerEnum.optimism,
    scannerLink: ChainScannerLinksEnum.optimism,
  },
];
