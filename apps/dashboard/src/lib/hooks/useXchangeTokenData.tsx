import { AllPairs } from 'common-files';
import { ChainLinkAbi } from 'common-files';
import { ERC20 } from 'common-files';
import { PairsAbi } from 'common-files';
import { Address, useContractReads, useNetwork } from 'wagmi';

import {
  BlockchainType,
  ContractsEnum,
  TokenContractAddresses,
} from '../types';
import {
  generateChainTokenOracleEtherUSDEnum,
  generateChainEtherTokenEnum,
} from '../utils/chainFormatters';

export function useXchangeTokenData(id: number) {
  const { chain } = useNetwork();
  const { data, isLoading: isInitialPairLoading } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.XchangeFactory,
        abi: AllPairs,
        functionName: 'allPairs',
        args: [id],
      },
    ],
  });

  const { data: pairTokens, isLoading: isTokenPairLoading } = useContractReads({
    contracts: [
      {
        address: data?.[0] as Address,
        abi: PairsAbi,
        functionName: 'token0',
      },
      {
        address: data?.[0] as Address,
        abi: PairsAbi,
        functionName: 'token1',
      },
      {
        address: data?.[0] as Address,
        abi: PairsAbi,
        functionName: 'getReserves',
      },
    ],
  });

  const { data: usdPrice } = useContractReads({
    contracts: [
      {
        address: generateChainTokenOracleEtherUSDEnum(chain?.id), // Chainlink's Price Feed contract address
        abi: ChainLinkAbi,
        functionName: 'latestAnswer',
      },
    ],
  });

  // @ts-expect-error
  const token: Address =
    pairTokens?.[0] !== TokenContractAddresses.WETH
      ? pairTokens?.[0]
      : pairTokens?.[1];

  const { data: erc20Details, isLoading } = useContractReads({
    contracts: [
      {
        address: token,
        abi: ERC20,
        functionName: 'name',
      },
      {
        address: token,
        abi: ERC20,
        functionName: 'symbol',
      },
    ],
  });

  const name: string = !!erc20Details?.[0] ? `${erc20Details?.[0]}` : ``;
  const symbol = erc20Details?.[1];
  const contractData = data?.[0];

  const etherInUSD = !!usdPrice ? parseInt(usdPrice.toString()) / 10 ** 8 : 0;

  return {
    isLoading: isLoading || isTokenPairLoading || isInitialPairLoading,
    tokenName: name,
    tokenSymbol: symbol,
    tokenContract: contractData,
    tokenReserve: generatePairReserve(pairTokens, chain?.id),
    tokenPrice: generatePairUSDPrice(pairTokens, etherInUSD, chain?.id),
  };
}

function generatePairReserve(pairTokens: any, chainId?: BlockchainType) {
  const reserves = pairTokens?.[2];
  if (reserves) {
    const { _reserve0, _reserve1 } = reserves;

    const etherReserve =
      pairTokens?.[0] === generateChainEtherTokenEnum(chainId)
        ? _reserve0
        : _reserve1;

    return (etherReserve / 10 ** 18).toFixed(2);
  }

  return '0';
}

function generatePairUSDPrice(
  pairTokens: any,
  etherInUSD: number,
  chainId?: BlockchainType
) {
  const reserves = pairTokens?.[2];

  if (reserves) {
    const { _reserve0, _reserve1 } = reserves;

    const etherReserve =
      pairTokens?.[0] === generateChainEtherTokenEnum(chainId)
        ? _reserve0
        : _reserve1;

    const tokenReserve =
      pairTokens?.[0] === generateChainEtherTokenEnum(chainId)
        ? _reserve1
        : _reserve0;

    const unitPriceEther = etherReserve / tokenReserve;

    return (etherInUSD * (unitPriceEther / 10 ** 18)).toFixed(4);
  }

  return 0;
}
