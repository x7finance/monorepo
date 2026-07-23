/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
// import { ChainLinkAbi } from "@x7/contracts";

import { PinIcon } from "@x7/icons"
// import { useAccount, useReadContracts } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { CircleLoading } from "@x7/ui/circle-loading"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@x7/ui/hover-card"
import { Tag } from "@x7/ui/tag"
import type { Currency, CurrencyAmount } from "@x7/utils"
// import type { RouteWithValidQuote } from "@x7/smart-order-router";
// import { SkeletonBox } from "@x7/ui/skeleton";
// import { generateChainTokenOracleEtherUSDEnum, Native, WETH9 } from "@x7/utils";
import { formatUSD, safeParseEther } from "@x7/utils"
import { useLoanState } from "~/lib/stores/loan"

interface LoanLaunchPriceProps {
  // collateralToken: Currency;
  // loanToken: Currency;
  // loanAmount: string;
  // collateralAmount: string;
  isNativePriceLoading: boolean
  isMarketPriceLoading: boolean
  marketPrice: CurrencyAmount<Currency> | undefined
  nativePrice: CurrencyAmount<Currency> | undefined
}

export function LoanLaunchPrice({
  // collateralToken,
  // loanToken,
  // loanAmount,
  // collateralAmount,
  marketPrice,
  nativePrice,
  isMarketPriceLoading,
  isNativePriceLoading,
}: LoanLaunchPriceProps) {
  const {
    state: { collateralAmount, loanAmount, collateralToken, loanToken },
    mutate: { setCollateralAmount },
  } = useLoanState()
  // const { chainId } = useAccount();

  // const { data: usdPrice } = useReadContracts({
  //   contracts: [
  //     {
  //       address: generateChainTokenOracleEtherUSDEnum(chainId as ChainId), // Chainlink's Price Feed contract address
  //       abi: ChainLinkAbi,
  //       functionName: "latestAnswer",
  //     },
  //   ],
  // });

  if (!collateralToken || !loanToken || !nativePrice) {
    return null
  }

  if (isNativePriceLoading || isMarketPriceLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <CircleLoading size={8} />
      </div>
    )
  }

  const unitPriceEther =
    parseInt(safeParseEther(loanAmount).toString()) /
    parseInt(safeParseEther(collateralAmount).toString())
  const etherInUSD = nativePrice
    ? Number(nativePrice.quotient ?? "0") /
      Number(`1e${nativePrice.currency.decimals}`)
    : 0

  const launchPrice = (etherInUSD * unitPriceEther).toFixed(8)

  if (marketPrice) {
    const usdOffOfNativePer = collateralToken?.isNative
      ? parseFloat(nativePrice.toExact())
      : parseFloat(nativePrice.toExact()) *
        (parseFloat(marketPrice.toExact()) * 0.99)

    const _difference = usdOffOfNativePer / parseFloat(launchPrice) - 1

    const optimalCollateral =
      (parseFloat(loanAmount) * etherInUSD) / usdOffOfNativePer

    return (
      <Card className="overflow-hidden border border-emerald-500 shadow-md shadow-emerald-500/50 transition-all duration-200">
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-heading text-lg font-semibold text-primary">
              Launch Price
            </h3>
            <Tag variant="large" color="emerald">
              Market Available
            </Tag>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            Ensure your proposed launch price is reasonable compared to the
            market price.
          </p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <div>
              <p className="font-medium text-primary">Proposed Price</p>
              <p className="text-muted-foreground">
                <Tag variant="large" color="emerald">
                  $ {launchPrice}
                </Tag>
              </p>
            </div>
            <div>
              <p className="font-medium text-primary">Market Price</p>
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger>
                  <p className="text-muted-foreground">
                    <Tag variant="large" color="emerald">
                      $ {usdOffOfNativePer.toFixed(8)}
                      <PinIcon
                        width={16}
                        height={16}
                        className="ml-1 inline-block cursor-pointer"
                        onClick={() =>
                          setCollateralAmount(optimalCollateral.toString())
                        }
                      />
                    </Tag>
                  </p>
                </HoverCardTrigger>
                <HoverCardContent className="max-w-[320px] p-0!">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-100">
                      Market Price
                    </CardTitle>
                    <CardDescription>
                      Please ensure your proposed launch price is a reasonable
                      price compared to this market price, this pair exists
                      elsewhere besides XChange and to ensure your pool isn't
                      nuked please ensure launch pricing
                    </CardDescription>
                  </CardHeader>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border border-emerald-500 shadow-md shadow-emerald-500/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-heading text-lg font-semibold text-primary">
            Launch Price
          </h3>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">
          Please review as these are the values you will be launching with.
        </p>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div>
            <p className="font-medium text-primary">Price Per Token</p>
            <p className="text-muted-foreground">
              <Tag variant="large" color="emerald">
                $ {launchPrice}
              </Tag>
            </p>
          </div>
          <div>
            <p className="font-medium text-primary">Total Market Cap</p>
            <p className="text-muted-foreground">
              <Tag variant="large" color="emerald">
                {formatUSD(
                  parseFloat(launchPrice) * parseFloat(collateralAmount)
                )}
              </Tag>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
