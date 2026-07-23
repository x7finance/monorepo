"use client"

import { useState } from "react"
import type { Abi } from "viem"
import { formatEther } from "viem"
import { useReadContracts } from "wagmi"

import {
  X7D,
  X7DAODiscountAuthority,
  X7DAOLiquidityHub,
  X7EcosystemSplitter,
  X7LendingDiscountAuthority,
  X7LendingPoolReserve,
  X7LendingPoolV2,
  X7NFT,
  X7R,
  X7RDiscountAuthority,
  X7LiquidityTreasury,
  X7RLiquidityHub,
  X7TokenBurner,
  X7TokenTimeLock,
  X7TreasurySplitterV3,
  X7100DiscountAuthority,
  X7100LiquidityHub,
  XchangeDiscountAuthority,
  XchangeFactory,
  XchangeRouterAbi,
} from "@x7/contracts"
import { cn } from "@x7/css"
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleAlertIcon,
} from "@x7/icons"
import { X7ContractsEnum } from "@x7/sdk"
import { Button } from "@x7/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@x7/ui/collapsible"
import type { ChainId } from "@x7/utils"
import { generateChainDenomination } from "@x7/utils"

type ContractFunctionResult = boolean | string | number

interface ConfigurationProps {
  contract: `0x${string}`
  chainId: ChainId
}

interface ConfigCheck {
  name: string
  functionName: string
  abi: Abi
  args?: (string | number)[]
  format?: string
  expectedValue?: ContractFunctionResult
}

const createConfigChecks = (
  abi: Abi,
  checks: {
    name: string
    functionName: string
    args?: (string | number)[]
    format?: string
    expectedValue?: string | number | boolean
  }[],
  chainId: ChainId
): ConfigCheck[] => {
  return [
    {
      name: "DAO Owned",
      functionName: "owner",
      abi,
      args: [],
      expectedValue: X7ContractsEnum.DAOMultiSig(chainId),
    },
    ...checks.map((check) => ({
      ...check,
      abi,
    })),
  ]
}

const getConfigChecks = (contract: string, chainId: ChainId): ConfigCheck[] => {
  switch (contract) {
    case X7ContractsEnum.X7R(chainId):
    case X7ContractsEnum.X7DAO(chainId):
    case X7ContractsEnum.X7101(chainId):
    case X7ContractsEnum.X7102(chainId):
    case X7ContractsEnum.X7103(chainId):
    case X7ContractsEnum.X7104(chainId):
    case X7ContractsEnum.X7105(chainId):
      return createConfigChecks(
        X7R as Abi,
        [
          { name: "Liquidity Hub Set", functionName: "liquidityHub" },
          {
            name: "Max Fee Numerator (Tax) Set",
            functionName: "maxFeeNumerator",
            format: "percent100",
          },
          {
            name: "Fee Numerator (Tax) Set",
            functionName: "feeNumerator",
            format: "percent100",
          },
          {
            name: "Total Supply Set",
            functionName: "totalSupply",
            format: "supply",
          },
          { name: "Off Ramp Pair Set", functionName: "offRampPair" },
        ],
        chainId
      )

    case X7ContractsEnum.X7R_LiquidityHub(chainId):
      return createConfigChecks(
        X7RLiquidityHub as Abi,
        [
          {
            name: "Balance Threshold Set",
            functionName: "balanceThreshold",
            format: "ether",
          },
          {
            name: "Distribution Share Set",
            functionName: "distributeShare",
            format: "percent10",
          },
          {
            name: "Distribution Target Set",
            functionName: "distributeTarget",
            expectedValue: X7ContractsEnum.EcosystemSplitter(chainId),
          },
          {
            name: "Liquidity Ratio Target Set",
            functionName: "liquidityRatioTarget",
            format: "percent10",
          },
          {
            name: "Liquidity Share Set",
            functionName: "liquidityShare",
            format: "percent10",
          },
          {
            name: "Liquidity Token Receiver Set",
            functionName: "liquidityTokenReceiver",
            expectedValue: X7ContractsEnum.TokenTimeLock(chainId),
          },
          {
            name: "Min Share Set",
            functionName: "minShare",
            format: "percent10",
          },
          {
            name: "Max Share Set",
            functionName: "maxShare",
            format: "percent10",
          },
          {
            name: "Minimum Liquidity Ratio Target Set",
            functionName: "minLiquidityRatioTarget",
            format: "percent10",
          },
          {
            name: "Off Ramp Pair Set",
            functionName: "offRampPair",
            expectedValue: X7ContractsEnum.X7RXchangePair(chainId),
          },
          {
            name: "Router Set",
            functionName: "router",
            expectedValue: X7ContractsEnum.XchangeRouter(chainId),
          },
          {
            name: "Treasury Share Set",
            functionName: "treasuryShare",
            format: "percent10",
          },
          {
            name: "Treasury Target Set",
            functionName: "treasuryTarget",
            expectedValue: X7ContractsEnum.TreasurySplitter(chainId),
          },
          {
            name: "Token Set",
            functionName: "x7r",
            expectedValue: X7ContractsEnum.X7R(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.X7DAO_LiquidityHub(chainId):
      return createConfigChecks(
        X7DAOLiquidityHub as Abi,
        [
          {
            name: "Auxiliary Share Set",
            functionName: "auxiliaryShare",
            format: "percent10",
          },
          {
            name: "Auxiliary Target Set",
            functionName: "auxiliaryTarget",
            expectedValue: X7ContractsEnum.TokenBurner(chainId),
          },
          {
            name: "Balance Threshold Set",
            functionName: "balanceThreshold",
            format: "ether",
          },
          {
            name: "Distribution Share Set",
            functionName: "distributeShare",
            format: "percent10",
          },
          {
            name: "Distribution Target Set",
            functionName: "distributeTarget",
            expectedValue: X7ContractsEnum.EcosystemSplitter(chainId),
          },
          {
            name: "Liquidity Ratio Target Set",
            functionName: "liquidityRatioTarget",
            format: "percent10",
          },
          {
            name: "Liquidity Share Set",
            functionName: "liquidityShare",
            format: "percent10",
          },
          {
            name: "Liquidity Token Receiver Set",
            functionName: "liquidityTokenReceiver",
            expectedValue: X7ContractsEnum.TokenTimeLock(chainId),
          },
          {
            name: "Min Share Set",
            functionName: "minShare",
            format: "percent10",
          },
          {
            name: "Max Share Set",
            functionName: "maxShare",
            format: "percent10",
          },
          {
            name: "Minimum Liquidity Ratio Target Set",
            functionName: "minLiquidityRatioTarget",
            format: "percent10",
          },
          {
            name: "Off Ramp Pair Set",
            functionName: "offRampPair",
            expectedValue: X7ContractsEnum.X7DAOXchangePair(chainId),
          },
          {
            name: "Router Set",
            functionName: "router",
            expectedValue: X7ContractsEnum.XchangeRouter(chainId),
          },
          {
            name: "Treasury Share Set",
            functionName: "treasuryShare",
            format: "percent10",
          },
          {
            name: "Treasury Target Set",
            functionName: "treasuryTarget",
            expectedValue: X7ContractsEnum.TreasurySplitter(chainId),
          },
          {
            name: "Token Set",
            functionName: "x7dao",
            expectedValue: X7ContractsEnum.X7DAO(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.X7100_LiquidityHub(chainId):
      return createConfigChecks(
        X7100LiquidityHub as Abi,
        [
          {
            name: "Balance Threshold Set",
            functionName: "balanceThreshold",
            format: "ether",
          },
          {
            name: "Distribution Share Set",
            functionName: "distributeShare",
            format: "percent10",
          },
          {
            name: "Distribution Target Set",
            functionName: "distributeTarget",
            expectedValue: X7ContractsEnum.EcosystemSplitter(chainId),
          },
          {
            name: "Liquidity Ratio Target Set",
            functionName: "liquidityRatioTarget",
            format: "percent10",
          },
          {
            name: "Liquidity Balance Threshold Set",
            functionName: "liquidityBalanceThreshold",
            format: "ether",
          },
          {
            name: "Liquidity Share Set",
            functionName: "liquidityShare",
            format: "percent10",
          },
          {
            name: "Liquidity Token Receiver Set",
            functionName: "liquidityTokenReceiver",
            expectedValue: X7ContractsEnum.TokenTimeLock(chainId),
          },
          {
            name: "Min Share Set",
            functionName: "minShare",
            format: "percent10",
          },
          {
            name: "Max Share Set",
            functionName: "maxShare",
            format: "percent10",
          },
          {
            name: "Minimum Liquidity Ratio Target Set",
            functionName: "minLiquidityRatioTarget",
            format: "percent10",
          },
          {
            name: "Router Set",
            functionName: "router",
            expectedValue: X7ContractsEnum.XchangeRouter(chainId),
          },
          {
            name: "Treasury Share Set",
            functionName: "treasuryShare",
            format: "percent10",
          },
          {
            name: "Treasury Target Set",
            functionName: "treasuryTarget",
            expectedValue: X7ContractsEnum.TreasurySplitter(chainId),
          },
          {
            name: "Lending Pool Share Set",
            functionName: "lendingPoolShare",
            format: "percent10",
          },
          {
            name: "Lending Pool Target Set",
            functionName: "lendingPoolTarget",
            expectedValue: X7ContractsEnum.LendingPoolReserve(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.EcosystemSplitter(chainId):
      return createConfigChecks(
        X7EcosystemSplitter as Abi,
        [
          {
            name: "Min Shares Set",
            functionName: "minShare",
            format: "percent10",
          },
          {
            name: "Max Shares Set",
            functionName: "maxShare",
            format: "percent10",
          },
          {
            name: "Treasury Min Shares Set",
            functionName: "treasuryMinShare",
            format: "percent10",
          },
          { name: "WETH Set", functionName: "weth" },
        ],
        chainId
      )

    case X7ContractsEnum.TreasurySplitter(chainId):
      return createConfigChecks(
        X7TreasurySplitterV3 as Abi,
        [{ name: "WETH Set", functionName: "WETH" }],
        chainId
      )

    case X7ContractsEnum.XchangeFactory:
      return createConfigChecks(
        XchangeFactory as Abi,
        [
          {
            name: "Discount Authority Address Set",
            functionName: "discountAuthority",
            expectedValue: X7ContractsEnum.X7R_DiscountAuthority(chainId),
          },
          { name: "Fee To Address Set", functionName: "feeTo" },
          {
            name: "Xchange Router Trusted",
            functionName: "isTrusted",
            args: [X7ContractsEnum.XchangeRouter(chainId)],
          },
          {
            name: "Xchange Router With Discounts Trusted",
            functionName: "isTrusted",
            args: [X7ContractsEnum.XchangeRouterWithDiscounts(chainId)],
          },
          {
            name: "Lending Pool Trusted",
            functionName: "isTrusted",
            args: [X7ContractsEnum.X7_LendingPool(chainId)],
          },
        ],
        chainId
      )

    case X7ContractsEnum.XchangeRouter(chainId):
      return createConfigChecks(
        XchangeRouterAbi as Abi,
        [
          {
            name: "Factory Address Set",
            functionName: "factory",
            expectedValue: X7ContractsEnum.XchangeFactory,
          },
          { name: "WETH Address Set", functionName: "WETH" },
        ],
        chainId
      )

    case X7ContractsEnum.X7_LendingPool(chainId):
      return createConfigChecks(
        X7LendingPoolV2 as Abi,
        [
          {
            name: "X7100 Origination Share Set",
            functionName: "X7100OriginationShare",
            format: "percent100",
          },
          {
            name: "X7100 Premium Share Set",
            functionName: "X7100PremiumShare",
            format: "percent100",
          },
          {
            name: "X7100 Reserve Recipient Set",
            functionName: "X7100ReserveRecipient",
          },
          {
            name: "X7D Set",
            functionName: "X7D",
            expectedValue: X7ContractsEnum.X7D(chainId),
          },
          {
            name: "X7DAO Originanation Share Set",
            functionName: "X7DAOOriginationShare",
            format: "percent100",
          },
          {
            name: "X7DAO Premium Share Set",
            functionName: "X7DAOPremiumShare",
            format: "percent100",
          },
          {
            name: "X7DAO Reward Recipient Set",
            functionName: "X7DAORewardRecipient",
            expectedValue: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
          },
          {
            name: "Active Loan Term Contracts",
            functionName: "countOfActiveLoanTerms",
          },
          {
            name: "Lending Discount Authority Set",
            functionName: "discountAuthority",
            expectedValue: X7ContractsEnum.LendingDiscountAuthority(chainId),
          },
          {
            name: "Ecosystem Recipient Set",
            functionName: "ecosystemRecipient",
            expectedValue: X7ContractsEnum.TokenTimeLock(chainId),
          },
          {
            name: "Ecosystem Splitter Set",
            functionName: "ecosystemSplitter",
            expectedValue: X7ContractsEnum.EcosystemSplitter(chainId),
          },
          {
            name: "Ecosystem Splitter Origination Share Set",
            functionName: "ecosystemSplitterOriginationShare",
            format: "percent100",
          },
          {
            name: "Ecosystem Splitter Premium Share Set",
            functionName: "ecosystemSplitterPremiumShare",
            format: "percent100",
          },
          {
            name: "Lending Pool Origination Shares Set",
            functionName: "lendingPoolOriginationShare",
            format: "percent100",
          },
          {
            name: "Lending Pool Premium Shares Set",
            functionName: "lendingPoolPremiumShare",
            format: "percent100",
          },
          {
            name: "Lending Pool Reserve Set",
            functionName: "lendingPoolReserve",
            expectedValue: X7ContractsEnum.LendingPoolReserve(chainId),
          },
          {
            name: "Liquidation Reward Set",
            functionName: "liquidationReward",
            format: "ether",
          },
          {
            name: "Retained Fee Numerator Set",
            functionName: "retainedFeeNumerator",
          },
          { name: "WETH Set", functionName: "weth" },
        ],
        chainId
      )

    case X7ContractsEnum.LendingPoolReserve(chainId):
      return createConfigChecks(
        X7LendingPoolReserve as Abi,
        [
          {
            name: "Ecosystem Recipient Set",
            functionName: "ecosystemRecipient",
            expectedValue: X7ContractsEnum.TokenTimeLock(chainId),
          },
          {
            name: "Ecosystem Payer Set",
            functionName: "isEcosystemPayer",
            args: [X7ContractsEnum.EcosystemSplitter(chainId)],
          },
          {
            name: "X7D Set",
            functionName: "X7D",
            expectedValue: X7ContractsEnum.X7D(chainId),
          },
          {
            name: "Lending Pool Set",
            functionName: "lendingPool",
            expectedValue: X7ContractsEnum.X7_LendingPool(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.TokenTimeLock(chainId):
      return createConfigChecks(
        X7TokenTimeLock as Abi,
        [
          {
            name: "X7R Time Lock Set",
            functionName: "tokenUnlockTimestamp",
            args: [X7ContractsEnum.X7RXchangePair(chainId)],
            format: "timestamp",
          },
          {
            name: "X7DAO Time Lock Set",
            functionName: "tokenUnlockTimestamp",
            args: [X7ContractsEnum.X7DAOXchangePair(chainId)],
            format: "timestamp",
          },
          {
            name: "X7D Time Lock Set",
            functionName: "tokenUnlockTimestamp",
            args: [X7ContractsEnum.X7D(chainId)],
            format: "timestamp",
          },
          {
            name: "X7101-X7105 Time Lock Set",
            functionName: "tokenUnlockTimestamp",
            args: [X7ContractsEnum.X7101XchangePair(chainId)],
            format: "timestamp",
          },
        ],
        chainId
      )

    case X7ContractsEnum.BorrowingMaxi(chainId):
    case X7ContractsEnum.DexMaxi(chainId):
    case X7ContractsEnum.EcosystemMaxi(chainId):
    case X7ContractsEnum.LiquidityMaxi(chainId):
    case X7ContractsEnum.Magister(chainId):
      return createConfigChecks(
        X7NFT as Abi,
        [
          {
            name: "Mint Fee Destination Set",
            functionName: "mintFeeDestination",
          },
          {
            name: "Mint Price Set",
            functionName: "mintPrice",
            format: "ether",
          },
          { name: "Minting Open Set", functionName: "mintingOpen" },
        ],
        chainId
      )

    case X7ContractsEnum.X7D(chainId):
      return createConfigChecks(
        X7D as Abi,
        [
          {
            name: "Lending Pool- Authorised Minter Set",
            functionName: "authorizedMinter",
            args: [X7ContractsEnum.X7_LendingPool(chainId)],
          },
          {
            name: "Lending Pool Reserve - Authorised Minter Set",
            functionName: "authorizedMinter",
            args: [X7ContractsEnum.LendingPoolReserve(chainId)],
          },
          {
            name: "Lending Pool Reserve - Authorised Redeemer Set",
            functionName: "authorizedRedeemer",
            args: [X7ContractsEnum.LendingPoolReserve(chainId)],
          },
          {
            name: "Recovered ETH Redeemer Set",
            functionName: "recoveredETHRecipient",
          },
          {
            name: "Recovered Token Redeemer Set",
            functionName: "recoveredTokenRecipient",
          },
        ],
        chainId
      )

    case X7ContractsEnum.TokenBurner(chainId):
      return createConfigChecks(
        X7TokenBurner as Abi,
        [
          {
            name: "Router Set",
            functionName: "router",
            expectedValue: X7ContractsEnum.XchangeRouter(chainId),
          },
          {
            name: "Target Token Set",
            functionName: "targetToken",
            expectedValue: X7ContractsEnum.X7R(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.X7R_DiscountAuthority(chainId):
      return createConfigChecks(
        X7RDiscountAuthority as Abi,
        [
          {
            name: "Magister NFT Set",
            functionName: "magisterNFT",
            expectedValue: X7ContractsEnum.Magister(chainId),
          },
          {
            name: "Liquidity Maxi NFT Set",
            functionName: "liqMaxiNFT",
            expectedValue: X7ContractsEnum.LiquidityMaxi(chainId),
          },
          {
            name: "Ecosystem Maxi NFT Set",
            functionName: "ecoMaxiNFT",
            expectedValue: X7ContractsEnum.EcosystemMaxi(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.X7DAO_DiscountAuthority(chainId):
      return createConfigChecks(
        X7DAODiscountAuthority as Abi,
        [
          {
            name: "Liquidity Maxi NFT Set",
            functionName: "liqMaxiNFT",
            expectedValue: X7ContractsEnum.LiquidityMaxi(chainId),
          },
          {
            name: "Ecosystem Maxi NFT Set",
            functionName: "ecoMaxiNFT",
            expectedValue: X7ContractsEnum.EcosystemMaxi(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.X7100_DiscountAuthority(chainId):
      return createConfigChecks(
        X7100DiscountAuthority as Abi,
        [
          {
            name: "X7DAO Set",
            functionName: "x7dao",
            expectedValue: X7ContractsEnum.X7DAO(chainId),
          },
          {
            name: "Magister NFT Set",
            functionName: "magisterNFT",
            expectedValue: X7ContractsEnum.Magister(chainId),
          },
          {
            name: "Liquidity Maxi NFT Set",
            functionName: "liqMaxiNFT",
            expectedValue: X7ContractsEnum.LiquidityMaxi(chainId),
          },
          {
            name: "Ecosystem Maxi NFT Set",
            functionName: "ecoMaxiNFT",
            expectedValue: X7ContractsEnum.EcosystemMaxi(chainId),
          },
        ],
        chainId
      )

    case X7ContractsEnum.XchangeDiscountAuthority(chainId):
      return createConfigChecks(
        XchangeDiscountAuthority as Abi,
        [{ name: "DEX Maxi NFT Set", functionName: "dexMaxiNFT" }],
        chainId
      )

    case X7ContractsEnum.LendingDiscountAuthority(chainId):
      return createConfigChecks(
        X7LendingDiscountAuthority as Abi,
        [
          {
            name: "Lending Pool - Authorised Consumer Set",
            functionName: "authorizedConsumers",
            args: [X7ContractsEnum.X7_LendingPool(chainId)],
          },
          {
            name: "Consumable Discount NFT Set",
            functionName: "consumableDiscountNFT",
          },
          {
            name: "Consumable Discount NFT Origination Discount Set",
            functionName: "consumableDiscountNFTOriginationFeeDiscount",
            format: "percent100",
          },
          {
            name: "Consumable Discount NFT Origination Discount Set",
            functionName: "consumableDiscountNFTPremiumFeeDiscount",
            format: "percent100",
          },
          {
            name: "Borrowing Maxi NFT Set",
            functionName: "discountNFT",
            expectedValue: X7ContractsEnum.BorrowingMaxi(chainId),
          },
          {
            name: "Borrowing Maxi Origination Discount Set",
            functionName: "discountNFTOriginationFeeDiscount",
            format: "percent100",
          },
          {
            name: "Borrowing Maxi Origination Discount Set",
            functionName: "discountNFTPremiumFeeDiscount",
            format: "percent100",
          },
        ],
        chainId
      )

    case X7ContractsEnum.X7LiquidityTreasury(chainId):
      return createConfigChecks(
        X7LiquidityTreasury as Abi,
        [
          {
            name: "WETH Set",
            functionName: "WETH",
          },
          {
            name: "Remote Address Set",
            functionName: "remoteAddress",
          },
          {
            name: "Router Address",
            functionName: "routerAddress",
            expectedValue: X7ContractsEnum.XchangeRouter(chainId),
          },
        ],
        chainId
      )
    default:
      return []
  }
}

const formatResult = (
  result: ContractFunctionResult | undefined,
  format?: string,
  chainId?: ChainId
): boolean | string | number | bigint => {
  if (
    result === undefined ||
    result === false ||
    result === "0x0000000000000000000000000000000000000000" ||
    result === "0" ||
    result === 0
  ) {
    return false
  }

  if (typeof result === "number" || typeof result === "bigint") {
    const numericResult = typeof result === "bigint" ? Number(result) : result

    if (format === "timestamp") {
      if (numericResult !== 0) {
        const date = new Date(numericResult * 1000)
        const now = Math.floor(Date.now() / 1000)

        if (numericResult < now) {
          return false
        }

        return `${result} (${date.toISOString()})`
      } else {
        return false
      }
    }

    if (format === "percent10") {
      return `${result} (${(numericResult / 10).toFixed(2)}%)`
    }

    if (format === "percent100") {
      return `${result} (${(numericResult / 100).toFixed(2)}%)`
    }

    if (format === "supply") {
      return `${result} (${(numericResult / 10 ** 18).toLocaleString()})`
    }

    if (format === "ether") {
      return `${result} (${formatEther(BigInt(result))}${
        chainId ? ` ${generateChainDenomination(chainId)}` : ""
      })`
    }
  }

  return String(result)
}

const isConfigured = (
  result: ContractFunctionResult | undefined,
  format?: string
): boolean => {
  const formattedResult = formatResult(result, format)

  return Boolean(formattedResult)
}

export function Configuration({ contract, chainId }: ConfigurationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const configChecks = getConfigChecks(contract, chainId)

  const { data, isFetched } = useReadContracts({
    contracts: configChecks.map(({ functionName, abi, args }) => ({
      address: contract,
      abi,
      functionName,
      chainId,
      args,
    })),
  })

  const checkResults = configChecks.map((check, index) => {
    const result =
      isFetched && data
        ? (data[index]?.result as ContractFunctionResult | undefined)
        : undefined

    if (check.functionName === "owner") {
      const isOwnerCorrect = result === X7ContractsEnum.DAOMultiSig(chainId)
      return {
        ...check,
        result: isOwnerCorrect ? `true` : `false`,
        isConfigured: isOwnerCorrect,
        affectOverallStatus: false,
      }
    }
    const formattedResult = formatResult(result, check.format, chainId)

    // Validate against expectedValue if provided
    const matchesExpectedValue =
      check.expectedValue !== undefined ? result === check.expectedValue : true

    // Determine if the check is configured correctly
    const isConfiguredCorrectly =
      matchesExpectedValue && isConfigured(result, check.format)

    return {
      ...check,
      result: formattedResult,
      isConfigured: isConfiguredCorrectly,
      affectOverallStatus: true,
    }
  })

  // Determine if all relevant checks are configured
  const allOtherChecksConfigured = checkResults
    .filter((check) => check.affectOverallStatus)
    .every((check) => check.isConfigured)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-between hover:bg-transparent",
            allOtherChecksConfigured
              ? "bg-emerald-800/10 text-emerald-500 hover:text-emerald-600"
              : "bg-orange-700/10 text-orange-500 hover:text-orange-600"
          )}
        >
          <span>
            {allOtherChecksConfigured ? (
              <span className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                <span className="pl-2 text-sm text-zinc-500">
                  View Configuration
                </span>
              </span>
            ) : (
              <span className="flex items-center">
                <CircleAlertIcon className="h-5 w-5 text-orange-500" />
                <span className="pl-2 text-sm text-orange-500">
                  Needs Review
                </span>
              </span>
            )}
          </span>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
          {checkResults.map((check) => (
            <div
              key={`${check.name}-${check.functionName}`}
              className="flex justify-between"
            >
              <div className="flex flex-col">
                <span>{check.name}</span>
                <span className="text-sm text-zinc-500">
                  {String(check.result)}
                </span>
              </div>
              <span
                className={
                  check.isConfigured ? "text-emerald-500" : "text-red-500"
                }
              >
                {check.isConfigured ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                ) : (
                  <CircleAlertIcon className="h-5 w-5 text-red-500" />
                )}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
