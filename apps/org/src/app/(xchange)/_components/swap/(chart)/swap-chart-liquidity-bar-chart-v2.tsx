import { scaleSymlog } from "d3-scale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useChainId, useReadContracts } from "wagmi";

import { XchangePair } from "@x7/contracts";
import type { Pair } from "@x7/sdk";
import type { SwapRoute } from "@x7/smart-order-router";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@x7/ui/chart";
import type { ChartConfig } from "@x7/ui/chart";
import type { ChainId, Native, Token } from "@x7/utils";
import { DEAD_ADDRESS, Implementation, Protocol } from "@x7/utils";

interface SwapChartLiquidityBarChartProps {
  route?: SwapRoute | undefined;
  pair: Pair;
  protocol: Protocol;
  isRouteFound: boolean;
  token0: Token | Native | undefined;
  token1: Token | Native | undefined;
}

const chartConfig = {
  loan: {
    label: "loan",
    color: "hsl(var(--chart-3))",
  },
  amount: {
    label: "amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SwapChartLiquidityBarChartV2({
  route,
  pair,
  protocol,
  isRouteFound,
  token0,
  token1,
}: SwapChartLiquidityBarChartProps) {
  const chainId = useChainId() as ChainId;
  const scale = scaleSymlog();
  const { token0Amount, token1Amount } = getTokenAmounts(pair, token0, token1);
  const dex = pair.pairType;
  const loanToken =
    route?.trade.swaps[0]?.route.input.symbol === "WETH" ||
    route?.trade.swaps[0]?.route.input.symbol === "ETH"
      ? token0?.isToken
        ? token0
        : token0?.wrapped
      : token1?.isToken
        ? token1
        : token1?.wrapped;

  const { data: loanAmountResult } = useReadContracts({
    contracts: [
      {
        address:
          isRouteFound === true &&
          protocol === Protocol.V2 &&
          dex === Implementation.XCHANGE
            ? pair.liquidityToken.address
            : DEAD_ADDRESS,
        abi: XchangePair,
        functionName: "tokenMinimumBalance",
        args: [loanToken?.address],
        chainId,
      },
    ],
  });

  const loanAmount =
    Number(
      parseInt(loanAmountResult?.[0]?.result as string) /
        10 ** pair.token0.decimals,
    ) || 0;

  const chartData = [
    {
      token: pair.token0.symbol,
      loan: loanAmount,
      amount: Number(token0Amount) - loanAmount,
    },
    {
      token: pair.token1.symbol,
      loan: 0,
      amount: Number(token1Amount),
    },
  ];

  return (
    <ResponsiveContainer width={300} height="100%">
      <ChartContainer config={chartConfig} className="h-[180px]">
        <BarChart
          width={200}
          height={200}
          data={chartData}
          margin={{
            left: 25,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="token"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            tickFormatter={(value: string) => value.slice(0, 6)}
          />
          <YAxis
            scale={scale}
            tickLine={false}
            axisLine={false}
            tickMargin={3}
            tickCount={3}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {dex === Implementation.XCHANGE && (
            <Bar
              dataKey="loan"
              stackId="a"
              fill="var(--color-loan)"
              radius={4}
            />
          )}
          <Bar
            dataKey="amount"
            stackId="a"
            fill="var(--color-amount)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
function getTokenAmounts(
  pair: Pair | undefined,
  token0: Token | Native | undefined,
  token1: Token | Native | undefined,
) {
  if (!pair || !token0 || !token1) {
    return { token0Amount: 0, token1Amount: 0 };
  }

  const token0Amount = (
    Number(BigInt(pair.token0Price.denominator)) /
    10 ** pair.token0.decimals
  ).toFixed(4);
  const token1Amount = (
    Number(BigInt(pair.token1Price.denominator)) /
    10 ** pair.token1.decimals
  ).toFixed(4);

  return { token0Amount, token1Amount };
}
