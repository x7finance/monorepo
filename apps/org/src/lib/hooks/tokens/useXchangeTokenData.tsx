import type { ChainId } from "@x7/utils"
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/restrict-template-expressions */
import type { Address } from "viem"

import { formatUnits } from "viem"
import { useChainId, useReadContracts } from "wagmi"

import { AllPairs, ChainLinkAbi, ERC20, PairsAbi } from "@x7/contracts"
import { generateChainEtherTokenEnum, X7ContractsEnum } from "@x7/sdk"
import { generateChainTokenOracleEtherUSDEnum } from "@x7/utils"

export function useXchangeTokenData(id: number) {
  const chainId = useChainId() as ChainId
  const { data, isLoading: isInitialPairLoading } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.XchangeFactory,
        abi: AllPairs,
        functionName: "allPairs",
        args: [id],
        chainId,
      },
    ],
  })

  const contractAddress = `${data?.[0]?.result}` as Address

  const { data: pairTokens, isLoading: isTokenPairLoading } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: PairsAbi,
        functionName: "token0",
        chainId,
      },
      {
        address: contractAddress,
        abi: PairsAbi as any,
        functionName: "token1",
        chainId,
      },
      {
        address: contractAddress,
        abi: PairsAbi,
        functionName: "getReserves",
        chainId,
      },
    ],
  })

  const token0 = `${pairTokens?.[0]?.result}` as Address
  const token1 = `${pairTokens?.[1]?.result}` as Address
  const reserves = pairTokens?.[2]?.result as [bigint, bigint]

  const { data: usdPrice } = useReadContracts({
    contracts: [
      {
        address: generateChainTokenOracleEtherUSDEnum(chainId), // Chainlink's Price Feed contract address
        abi: ChainLinkAbi,
        functionName: "latestAnswer",
      },
    ],
  })

  const projectToken: Address =
    token0 !== generateChainEtherTokenEnum(chainId) ? token0 : token1

  const pairedToken: Address =
    token0 === generateChainEtherTokenEnum(chainId) ? token0 : token1

  const { data: erc20token0Details, isLoading } = useReadContracts({
    contracts: [
      {
        address: projectToken,
        abi: ERC20,
        functionName: "name",
        chainId,
      },
      {
        address: projectToken,
        abi: ERC20,
        functionName: "symbol",
        chainId,
      },
      {
        address: projectToken,
        abi: ERC20,
        functionName: "decimals",
        chainId,
      },
      {
        address: pairedToken,
        abi: ERC20,
        functionName: "symbol",
        chainId,
      },
    ],
  })

  const name: string = (erc20token0Details?.[0]?.result as string) || ""
  const symbol = erc20token0Details?.[1]?.result
  const tokenDecimals = parseInt(
    erc20token0Details?.[2]?.result?.toString() ?? "0"
  )
  const pairedSymbol: string = (erc20token0Details?.[3]?.result as string) || ""

  const etherInUSD = usdPrice
    ? parseInt(usdPrice[0].result?.toString() ?? "0") / 10 ** 8
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
    contractAddress: contractAddress,
  }
}

function generatePairReserve(
  token0: Address,
  token1: Address,
  reserves: [bigint, bigint],
  chainId?: ChainId
): string {
  // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      : etherReserve.toString()
  }

  return "0"
}

function generatePairUSDPrice(
  token0: Address,
  token1: Address,
  reserves: [bigint, bigint],
  etherInUSD: number,
  tokenDecimals: number,
  chainId?: ChainId
): string | number {
  // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
