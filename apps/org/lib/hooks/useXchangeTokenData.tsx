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

  const projectToken: Address =
    token0 !== generateChainEtherTokenEnum(chainId) ? token0 : token1

  const pairedToken: Address =
    token0 === generateChainEtherTokenEnum(chainId) ? token0 : token1

  const { data: erc20token0Details, isLoading } = useContractReads({
    contracts: [
      {
        address: projectToken,
        abi: ERC20 as any,
        functionName: "name",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: projectToken,
        abi: ERC20,
        functionName: "symbol",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: projectToken,
        abi: ERC20,
        functionName: "decimals",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: pairedToken,
        abi: ERC20,
        functionName: "symbol",
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const name: string = (erc20token0Details?.[0]?.result as string) || ""
  const symbol = erc20token0Details?.[1]?.result
  const tokenDecimals = parseInt(
    erc20token0Details?.[2]?.result?.toString() || "0"
  )
  const pairedSymbol: string = (erc20token0Details?.[3]?.result as string) || ""

  const etherInUSD = usdPrice
    ? parseInt(usdPrice?.[0]?.result?.toString() || "0") / 10 ** 8
    : 0

  return {
    isLoading: isLoading || isTokenPairLoading || isInitialPairLoading,
    tokenName: name,
    tokenSymbol: symbol,
    pairedTokenSymbol: pairedSymbol,
    tokenContract: projectToken,
    // eth price
    tokenReserve: generatePairReserve(token0, token1, reserves, chainId),
    // usd price
    tokenPrice: generatePairUSDPrice(
      token0,
      token1,
      reserves,
      etherInUSD,
      tokenDecimals,
      chainId
    ),
  }
}

function generatePairReserve(
  token0: any,
  token1: any,
  reserves: any,
  chainId?: BlockchainType
) {
  if (reserves?.length) {
    const [_reserve0, _reserve1] = reserves

    const etherReserve =
      token0 === generateChainEtherTokenEnum(chainId)
        ? _reserve0
        : token1 === generateChainEtherTokenEnum(chainId)
        ? _reserve1
        : -1

    return etherReserve !== -1
      ? roundToString(formatUnits(etherReserve, 18), 2)
      : etherReserve
  }

  return "0"
}

function generatePairUSDPrice(
  token0: any,
  token1: any,
  reserves: any,
  etherInUSD: number,
  tokenDecimals: number,
  chainId?: BlockchainType
) {
  if (reserves?.length) {
    const [_reserve0, _reserve1] = reserves

    const etherToken =
      token0 === generateChainEtherTokenEnum(chainId)
        ? _reserve0
        : token1 === generateChainEtherTokenEnum(chainId)
        ? _reserve1
        : -1

    if (etherToken === -1) {
      return -1
    }

    const etherReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve0 : _reserve1

    const tokenReserve =
      token0 === generateChainEtherTokenEnum(chainId) ? _reserve1 : _reserve0

    const unitPriceEther =
      parseFloat(formatUnits(etherReserve, 18)) /
      parseFloat(formatUnits(tokenReserve, tokenDecimals))

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
