/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */

import { scaleSymlog } from "d3-scale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@x7/ui/chart";
import type { ChartConfig } from "@x7/ui/chart";

interface ChartDataItem {
  token: string;
  loan: number;
  amount: number;
}

interface SwapChartLiquidityBarChartProps {
  chartData: ChartDataItem[];
  dex: string;
}

export function SwapChartLiquidityBarChart({
  chartData,
  dex,
}: SwapChartLiquidityBarChartProps) {
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

  const scale = scaleSymlog();

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
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey="token"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            tickFormatter={(value) => value.slice(0, 6)}
          />
          <YAxis scale={scale} interval="preserveStartEnd" tickCount={1000} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {dex === "XCHANGE" && (
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
