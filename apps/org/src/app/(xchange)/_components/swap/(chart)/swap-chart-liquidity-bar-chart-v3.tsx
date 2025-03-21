import { scaleSymlog } from "d3-scale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Address } from "viem";
import { useChainId, useReadContracts } from "wagmi";

import { erc20Abi } from "@x7/contracts";
import type { Pool } from "@x7/sdk";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@x7/ui/chart";
import type { ChartConfig } from "@x7/ui/chart";
import type { ChainId } from "@x7/utils";
import { DEAD_ADDRESS, Implementation, Protocol } from "@x7/utils";

interface SwapChartLiquidityBarChartProps {
  pool: Pool;
  protocol: Protocol;
  isRouteFound: boolean;
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

export function SwapChartLiquidityBarChartV3({
  pool,
  protocol,
  isRouteFound,
}: SwapChartLiquidityBarChartProps) {
  const chainId = useChainId() as ChainId;
  const scale = scaleSymlog();

  const dex = pool.poolType;

  const { data } = useReadContracts({
    contracts: [
      {
        address:
          isRouteFound === true && protocol === Protocol.V3
            ? pool.token0.address
            : DEAD_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [pool.address as Address],
        chainId: chainId,
      },
      {
        address:
          isRouteFound === true && protocol === Protocol.V3
            ? pool.token1.address
            : DEAD_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [pool.address as Address],
        chainId: chainId,
      },
    ],
  });

  const token0Amount = data?.[0].result
    ? Number(
        BigInt(data[0].result) / BigInt(10 ** pool.token0.decimals),
      ).toFixed(4)
    : "0.0000";
  const token1Amount = data?.[1].result
    ? Number(
        BigInt(data[1].result) / BigInt(10 ** pool.token1.decimals),
      ).toFixed(4)
    : "0.0000";

  const chartData = [
    {
      token: pool.token0.symbol,
      loan: 0,
      amount: token0Amount,
    },
    {
      token: pool.token1.symbol,
      loan: 0,
      amount: token1Amount,
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
