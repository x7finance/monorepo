import { BlockchainType, ContractsEnum, TokenContractAddresses } from 'common';
import { AllPairs, ChainLinkAbi, PairsAbi, ERC20 } from 'contracts';
import {
  generateChainTokenOracleEtherUSDEnum,
  generateChainEtherTokenEnum,
} from 'utils';
import { useContractReads, useNetwork } from 'wagmi';
import { Address, formatUnits } from 'viem';

export function useXchangeTokenData(id: number) {
  const { chain } = useNetwork();
  const { data, isLoading: isInitialPairLoading } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.XchangeFactory,
        abi: AllPairs as any,
        functionName: 'allPairs',
        args: [id],
      },
    ],
  });

  const contractAddress = `${data?.[0]?.result}` as Address;

  const { data: pairTokens, isLoading: isTokenPairLoading } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: PairsAbi as any,
        functionName: 'token0',
      },
      {
        address: contractAddress,
        abi: PairsAbi as any,
        functionName: 'token1',
      },
      {
        address: contractAddress,
        abi: PairsAbi,
        functionName: 'getReserves',
      },
    ],
  });

  const token0 = `${pairTokens?.[0]?.result}` as Address;
  const token1 = `${pairTokens?.[1]?.result}` as Address;
  const reserves = pairTokens?.[2]?.result;

  const { data: usdPrice } = useContractReads({
    contracts: [
      {
        address: generateChainTokenOracleEtherUSDEnum(chain?.id), // Chainlink's Price Feed contract address
        abi: ChainLinkAbi as any,
        functionName: 'latestAnswer',
      },
    ],
  });

  const token: Address =
    token0 !== TokenContractAddresses.WETH ? token0 : token1;

  const { data: erc20Details, isLoading } = useContractReads({
    contracts: [
      {
        address: token,
        abi: ERC20 as any,
        functionName: 'name',
      },
      {
        address: token,
        abi: ERC20,
        functionName: 'symbol',
      },
    ],
  });

  const name: string = (erc20Details?.[0]?.result as string) || '';
  const symbol = erc20Details?.[1]?.result;
  const contractData = data?.[0]?.result;

  const etherInUSD = usdPrice
    ? parseInt(usdPrice?.[0]?.result?.toString()) / 10 ** 8
    : 0;

  return {
    isLoading: isLoading || isTokenPairLoading || isInitialPairLoading,
    tokenName: name,
    tokenSymbol: symbol,
    tokenContract: contractData,
    // eth price
    tokenReserve: generatePairReserve(token0, reserves, chain?.id),
    // usd price
    tokenPrice: generatePairUSDPrice(token0, reserves, etherInUSD, chain?.id),
  };
}

function generatePairReserve(
  token0: any,
  reserves: any,
  chainId?: BlockchainType
) {
  if (reserves?.length) {
    const [_reserve0, _reserve1] = reserves;

    const etherReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve0 : _reserve1;

    return roundToString(formatUnits(etherReserve, 18), 2);
  }

  return '0';
}

function generatePairUSDPrice(
  token0: any,
  reserves: any,
  etherInUSD: number,
  chainId?: BlockchainType
) {
  if (reserves?.length) {
    const [_reserve0, _reserve1] = reserves;

    const etherReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve0 : _reserve1;

    const tokenReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve1 : _reserve0;

    const unitPriceEther =
      parseFloat(formatUnits(etherReserve, 18)) /
      parseFloat(formatUnits(tokenReserve, 18));

    // return formatUnits(unitPriceEther, 18);
    return (etherInUSD * unitPriceEther).toFixed(8);
  }

  return 0;
}

function roundToString(input: string, decimalPoints: number): string {
  const parsedNumber = parseFloat(input);
  if (isNaN(parsedNumber)) {
    throw new Error('Input is not a valid number.');
  }
  const roundedNumber = parsedNumber.toFixed(decimalPoints);
  return roundedNumber.toString();
}
