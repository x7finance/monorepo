/* oxlint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import type { ActiveChainId, ChainId } from "@x7/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { parseEther, parseUnits } from "viem"
import { useAccount, useChainId } from "wagmi"
import * as z from "zod"

import { cn } from "@x7/css"
import { CheckCircleIcon } from "@x7/icons"
import { Button, buttonVariants } from "@x7/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@x7/ui/form"
import { LinkInternal } from "@x7/ui/link"
import { CurrencyAmount, LogCodes, Native } from "@x7/utils"
import { CurrencyInput } from "~/lib/components/utils/currency-input"
import { SECONDS_IN_A_DAY } from "~/lib/constants/misc"
import { useGetInitialLiquidityLoan } from "~/lib/hooks/loans/useGetInitialLiquidityLoan"
import { useLiquidationReward } from "~/lib/hooks/loans/useXchangeLendingPoolData"
import { usePrice } from "~/lib/hooks/prices/usePrice"
import { useTransactionDeadline } from "~/lib/hooks/utils/useTransactionDeadline"
import { useLoanState } from "~/lib/stores/loan"
import { ApproveERC20Multiple } from "~/lib/systems/Checker/ApproveERC20Multiple"
import { log } from "~/lib/utils/log"
import { XchangeLinks } from "~/types/links"

import { StatusCard } from "../../lending/_components/status-card"
import { useLendingPoolPrettyData } from "../../lending/_hooks/useLendingPoolPrettyData"

import { LoanLaunchPrice } from "./(sections)/loan-launch-price"
// import { LoanPairCreation } from "./(sections)/loan-pair-creation";
import { LoanSummary } from "./(sections)/loan-summary"
import { LoanTokenAmount } from "./(sections)/loan-token-amount"
import { LoanTypeDuration } from "./(sections)/loan-type-duration"
import { LoanOptions } from "./loan-options"

const FormSchema = z.object({
  duration: z.number().int().min(1).max(28),
})

export function ILLBaseForm() {
  const chainId = useChainId() as ActiveChainId
  const { address } = useAccount()
  const {
    state: {
      errors,
      quotes,
      loanDuration,
      loanTerms,
      selectedQuote,
      collateralAmount,
      loanAmount,
      collateralToken,
      neededApprovals,
      loanToken,
      selectedLoan,
    },
    mutate: {
      setLoanDuration,
      setCollateralToken,
      setCollateralAmount,
      setLoan,
      setLoanAmount,
    },
  } = useLoanState()
  const [isActionDisabled, setIsActionDisabled] = useState<boolean>(true)
  // const isActionDisabled = errors.length > 0 || !selectedQuote;
  const [rawCollateralAmount, setRawCollateralAmount] = useState<string>("")

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    log.error(
      LogCodes.FAIL,
      `On submit for loan needs to be implemented`,
      JSON.stringify(data, null, 2)
    )
  }

  const { liquidationReward } = useLiquidationReward(chainId)
  const deadline = useTransactionDeadline({
    chainId: chainId,
    enabled: true,
  })

  const { data: nativePrice, isLoading: isNativePriceLoading } = usePrice({
    chainId: chainId as ChainId,
    currency: Native.onChain(chainId as ChainId),
  })

  const { data: marketPrice, isLoading: isMarketPriceLoading } = usePrice({
    chainId: chainId as ChainId,
    currency: collateralToken,
  })

  const { statusData } = useLendingPoolPrettyData(chainId)

  const { writeContract, data, isPending } = useGetInitialLiquidityLoan({
    payableAmount: BigInt(
      BigInt(selectedQuote?.result[3] ?? 0n) + BigInt(liquidationReward ?? 0n)
    ).toString(),
    tokenAddress: (collateralToken?.isNative
      ? ""
      : collateralToken?.address) as `0x${string}`,
    amount: collateralAmount,
    loanTermContractAddress: selectedQuote?.loanTerm.address!,
    loanAmount: parseUnits(loanAmount, loanToken.decimals), // uint256 loanAmount,
    loanDuration: BigInt(loanDuration * SECONDS_IN_A_DAY), // uint256 loanDurationSeconds,
    liquidityReceiverAddress: address!, // address liquidityReceiver,
    deadline: deadline.data!, // uint256 deadline
  })

  function handleQuote() {
    if (!data?.request) {
      toast.error(
        "There was an error simulating your loan transaction - please try again later."
      )
      return
    }

    writeContract(data?.request)
  }

  useEffect(() => {
    if (errors.length > 0 || !selectedQuote) {
      setIsActionDisabled(true)
    } else if (marketPrice && nativePrice) {
      // Check if the token doesn't have any liquidity yet
      if (
        parseFloat(marketPrice.toExact()) <= 1 ||
        parseFloat(nativePrice.toExact()) <= 1
      ) {
        setIsActionDisabled(false)
        return
      }

      const unitPriceEther =
        parseInt(parseEther(loanAmount).toString()) /
        parseInt(parseEther(collateralAmount).toString())
      const etherInUSD = nativePrice
        ? Number(nativePrice.quotient ?? "0") /
          Number(`1e${nativePrice.currency.decimals}`)
        : 0

      const launchPrice = (etherInUSD * unitPriceEther).toFixed(8)

      const usdOffOfNativePer = collateralToken?.isNative
        ? parseFloat(nativePrice.toExact())
        : parseFloat(nativePrice.toExact()) * parseFloat(marketPrice.toExact())

      const difference = usdOffOfNativePer / parseFloat(launchPrice) - 1

      setIsActionDisabled(difference > 0.1 || difference < -0.1)
    } else {
      setIsActionDisabled(false)
    }
  }, [
    errors,
    selectedQuote,
    loanAmount,
    loanDuration,
    collateralToken,
    collateralAmount,
    marketPrice,
    nativePrice,
    isActionDisabled,
  ])

  return (
    <Card className="mx-auto mt-6 max-w-2xl">
      <CardHeader className="space-y-1 px-3 sm:px-6">
        <CardTitle className="mb-2 text-zinc-900 dark:text-zinc-100">
          Liquidity Loan
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {`Here you'll be able to initiate a loan utilizing the X7 Lending Pool.
          This form will walk you through the steps to getting your LP live.`}
          <LinkInternal
            prefetch={true}
            href={XchangeLinks.Lending}
            target="_blank"
            className="font-medium text-emerald-500 hover:underline"
          >
            {` `}Learn More{` `}
            &#8594;
          </LinkInternal>
          <StatusCard
            layout="horizontal"
            title="Current Lending Pool Overview"
            items={[
              {
                id: "available",
                label: "Available",
                value: statusData.poolBalance,
                hovercard: {
                  title: "Lending Pool",
                  description:
                    "The amount of capital currently available in the pool. If you need more than the amount available in active loan terms, please reach out to X7 DAO",
                  linkText: "Learn More",
                  href: "/docs/guides/launch",
                },
              },
              {
                id: "in-reserve",
                label: "In Reserve",
                value: statusData.reserveBalance,
                hovercard: {
                  title: "Lending Pool Reserve",
                  description:
                    "This amount can be made available for lending, but is currently being held in reserve. If you need access please reach out to X7 DAO",
                  linkText: "Learn More",
                  href: XchangeLinks.Lending,
                },
              },
              {
                id: "lending-total",
                label: "Lending Total",
                value: statusData.totalBalance,
              },
            ]}
            chainId={chainId}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 px-3 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem className="space-y-3 border-t-2 pt-4">
              <FormLabel className="text-muted-foreground mt-4 text-sm">
                1. Select your loan type - for now, only one loan type is
                available for simplicity.
              </FormLabel>
              <div className="my-8 text-sm">
                <LoanOptions
                  loanTerms={loanTerms}
                  selectedLoan={selectedLoan}
                  setLoan={setLoan}
                />
              </div>
            </FormItem>
            {selectedLoan?.address && (
              <>
                <LoanTypeDuration
                  form={form}
                  loanDuration={loanDuration}
                  setLoanDuration={setLoanDuration}
                  loanAddress={selectedLoan?.address}
                />

                <LoanTokenAmount
                  form={form}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  loanAddress={selectedLoan?.address}
                />

                <FormField
                  control={form.control}
                  defaultValue={loanDuration}
                  name="duration"
                  render={() => (
                    <FormItem className="space-y-3 border-t-2 pt-4">
                      <FormLabel className="text-muted-foreground mt-4 text-sm">
                        4. Select the token and amount for your LP
                      </FormLabel>
                      <FormControl>
                        <div
                          onBlur={() => {
                            const parsedValue = parseFloat(rawCollateralAmount)
                            if (!isNaN(parsedValue) && parsedValue > 0) {
                              const scaledValue = BigInt(
                                Math.floor(
                                  parsedValue *
                                    10 ** (collateralToken?.decimals ?? 18)
                                )
                              )
                              setCollateralAmount(scaledValue.toString())
                            } else {
                              setCollateralAmount("0")
                            }
                          }}
                        >
                          <CurrencyInput
                            id="collateral-token"
                            type="INPUT"
                            className="rounded-xl bg-white p-3 dark:bg-zinc-800"
                            chainId={chainId}
                            onSelect={setCollateralToken}
                            value={rawCollateralAmount}
                            onChange={(value) => {
                              setRawCollateralAmount(value)
                              const parsedValue = parseFloat(value)
                              if (!isNaN(parsedValue) && parsedValue > 0) {
                                const scaledValue = BigInt(
                                  Math.floor(
                                    parsedValue *
                                      10 ** (collateralToken?.decimals ?? 18)
                                  )
                                )
                                setCollateralAmount(scaledValue.toString())
                              } else {
                                setCollateralAmount("0")
                              }
                            }}
                            currency={collateralToken}
                            disabled={
                              parseFloat(loanAmount) <= 0 || loanDuration <= 0
                            }
                            loading={false}
                            currencyLoading={false}
                            disableInsufficientBalanceError={true}
                            forceDisable={false}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {Boolean(parseFloat(collateralAmount) > 0) && (
                  <FormItem className="space-y-3 border-t-2 pt-4">
                    <FormLabel className="text-muted-foreground mt-4 text-sm">
                      5. Review the loan cost
                    </FormLabel>
                    <LoanSummary
                      quotes={quotes}
                      selectedQuote={selectedQuote}
                      loanDuration={loanDuration}
                    />
                  </FormItem>
                )}
              </>
            )}
          </form>
        </Form>

        {Boolean(errors.length === 0 && selectedQuote) && (
          <>
            <h3 className="text-muted-foreground mt-2 text-sm">
              5. Create the pair and approve the lending pool to issue the loan.
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ApproveERC20Multiple
                  className="whitespace-nowrap"
                  fullWidth
                  variant={"default"}
                  size="default"
                  id="ill-approvals"
                  amounts={neededApprovals.map((approval) => ({
                    amount: CurrencyAmount.fromRawAmount(
                      approval.token!,
                      approval.amount
                    ),
                    contract: approval.address,
                  }))}
                >
                  <Button
                    variant={"outline"}
                    icon={CheckCircleIcon}
                    iconPosition="end"
                    disabled={true}
                    iconProps={{
                      className: "h-3 w-3 relative left-2 text-emerald-500",
                    }}
                    fullWidth
                  >
                    Lending Pool Approved
                  </Button>
                </ApproveERC20Multiple>

                {/* <LoanPairCreation collateralToken={collateralToken!} /> */}
              </div>
            </div>
          </>
        )}
        {parseFloat(collateralAmount) > 0 && collateralToken && (
          <div className="flex w-full flex-col">
            <h3 className="text-muted-foreground my-2 text-sm">
              6. Review the launch price and initiate the loan.
            </h3>
            <FormItem className="space-y-3 border-t-2 pt-4">
              <LoanLaunchPrice
                isMarketPriceLoading={isMarketPriceLoading}
                marketPrice={marketPrice}
                isNativePriceLoading={isNativePriceLoading}
                nativePrice={nativePrice}
              />
            </FormItem>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        {Boolean(
          isActionDisabled || isPending || neededApprovals.length !== 0
        ) && (
          <div className="text-muted-foreground my-2 text-xs">
            Please complete the approvals above before initiating the loan
          </div>
        )}
        {Boolean(errors.length === 0 && selectedQuote) && (
          <Button
            onClick={() => {
              if (!isActionDisabled) {
                handleQuote()
              }
            }}
            disabled={
              isActionDisabled ||
              isPending ||
              neededApprovals.length !== 0 ||
              !data
            }
            className={cn(
              buttonVariants({
                variant: "primary",
                size: "lg",
              }),
              "w-full"
            )}
          >
            Initiate Loan
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
