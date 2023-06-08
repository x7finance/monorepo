import { BlockchainType, ContractsEnum } from "common"
import {
  generateChainEtherTokenEnum,
  generateChainTokenOracleEtherUSDEnum,
} from "utils"
import { AllPairs, ChainLinkAbi, ERC20, PairsAbi } from "contracts"

import { Address, formatUnits } from "viem"
import { useContractReads } from "wagmi"

import { generateWagmiChain } from "../generateWagmiChain"

export function useXchangeTokenData(id: number, chainId: BlockchainType) {
  const { data, isLoading: isInitialPairLoading } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.XchangeFactory,
        abi: AllPairs as any,
        functionName: "allPairs",
        args: [id],
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const contractAddress = `${data?.[0]?.result}` as Address

  const { data: pairTokens, isLoading: isTokenPairLoading } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: PairsAbi as any,
        functionName: "token0",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: contractAddress,
        abi: PairsAbi as any,
        functionName: "token1",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: contractAddress,
        abi: PairsAbi,
        functionName: "getReserves",
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const token0 = `${pairTokens?.[0]?.result}` as Address
  const token1 = `${pairTokens?.[1]?.result}` as Address
  const reserves = pairTokens?.[2]?.result

  const { data: usdPrice } = useContractReads({
    contracts: [
      {
        address: generateChainTokenOracleEtherUSDEnum(chainId), // Chainlink's Price Feed contract address
        abi: ChainLinkAbi as any,
        functionName: "latestAnswer",
      },
    ],
  })

  const token: Address =
    token0 !== generateChainEtherTokenEnum(chainId) ? token0 : token1

  const { data: erc20Details, isLoading } = useContractReads({
    contracts: [
      {
        address: token,
        abi: ERC20 as any,
        functionName: "name",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: token,
        abi: ERC20,
        functionName: "symbol",
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const name: string = (erc20Details?.[0]?.result as string) || ""
  const symbol = erc20Details?.[1]?.result

  const etherInUSD = usdPrice
    ? // @ts-expect-error
      parseInt(usdPrice?.[0]?.result?.toString()) / 10 ** 8
    : 0

  return {
    isLoading: isLoading || isTokenPairLoading || isInitialPairLoading,
    tokenName: name,
    tokenSymbol: symbol,
    tokenContract: token,
    // eth price
    tokenReserve: generatePairReserve(token0, reserves, chainId),
    // usd price
    tokenPrice: generatePairUSDPrice(token0, reserves, etherInUSD, chainId),
  }
}

function generatePairReserve(
  token0: any,
  reserves: any,
  chainId?: BlockchainType
) {
  if (reserves?.length) {
    const [_reserve0, _reserve1] = reserves

    const etherReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve0 : _reserve1

    return roundToString(formatUnits(etherReserve, 18), 2)
  }

  return "0"
}

function generatePairUSDPrice(
  token0: any,
  reserves: any,
  etherInUSD: number,
  chainId?: BlockchainType
) {
  if (reserves?.length) {
    const [_reserve0, _reserve1] = reserves

    const etherReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve0 : _reserve1

    const tokenReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve1 : _reserve0

    const unitPriceEther =
      parseFloat(formatUnits(etherReserve, 18)) /
      parseFloat(formatUnits(tokenReserve, 18))

    // return formatUnits(unitPriceEther, 18);
    return (etherInUSD * unitPriceEther).toFixed(8)
  }

  return 0
}

function roundToString(input: string, decimalPoints: number): string {
  const parsedNumber = parseFloat(input)
  if (isNaN(parsedNumber)) {
    throw new Error("Input is not a valid number.")
  }
  const roundedNumber = parsedNumber.toFixed(decimalPoints)
  return roundedNumber.toString()
}
