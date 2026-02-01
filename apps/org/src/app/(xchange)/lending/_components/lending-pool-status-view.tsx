/* oxlint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";
import { ChainId, generateChainName } from "@x7/utils";

import { DonutChart } from "~/app/(dashboard)/_components/donutChart/donut-chart";
import { useLendingPoolPrettyData } from "../_hooks/useLendingPoolPrettyData";
import { StatusCard } from "./status-card";

interface StatusTableProps {
  chainId: ChainId;
}

export function LendingPoolStatusView({ chainId }: StatusTableProps) {
  const { statusData, splitData, utilizedData } =
    useLendingPoolPrettyData(chainId);

  return (
    <div className="container mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold text-primary">
          {generateChainName(chainId)} Lending Pool Status
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The X7 Lending Pool consists of two parts: the Lending Pool itself and
          the Lending Pool Reserve. This page provides a breakdown of the X7
          Finance Lending Pool Status, detailing how these components are
          allocated and utilized within the ecosystem.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatusCard
          title="Current Lending Pool Overview"
          items={[
            { label: "Lending Pool", value: statusData.poolBalance },
            { label: "Lending Pool Reserve", value: statusData.reserveBalance },
            { label: "Total", value: statusData.totalBalance },
          ]}
          chainId={chainId}
        />

        <StatusCard
          title="Loan Statistics"
          items={[
            { label: "Available", value: statusData.available },
            {
              label: "Loans Initiated",
              value: chainId !== ChainId.ETHEREUM ? statusData.loanCount - 20 : statusData.loanCount,
              useChainDenomination: false,
            },
            {
              label: "Live Loans",
              value: statusData.liveLoans,
              useChainDenomination: false,
            },
          ]}
          chainId={chainId}
        />

        <StatusCard
          title="Liquidation Details"
          items={[
            {
              label: (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>Liquidation Escrow</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      The amount held in escrow for liquidation purposes.
                    </span>
                  </TooltipContent>
                </Tooltip>
              ),
              value: statusData.escrow,
            },
            {
              label: (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>Liquidation Reward</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      This is the reward for initiating a liquidation.
                    </span>
                  </TooltipContent>
                </Tooltip>
              ),
              value: statusData.liquidationReward,
            },
          ]}
          chainId={chainId}
        />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <ChartCard title="Pool Allocation" data={splitData} />
        <ChartCard title="Pool Utilization" data={utilizedData} />
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  data: any[];
}

function ChartCard({ title, data }: ChartCardProps) {
  return (
    <Card className="overflow-hidden bg-secondary">
      <CardHeader className="bg-background">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 pt-6">
        <div className="mx-auto aspect-square w-full max-w-lg">
          <DonutChart height={300} innerRadius={0.6} width={300} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
