import { Container } from "@x7/ui/container";

import { AnimatedTabs } from "~/lib/components/core/animate-tabs";
import { LiquidityTabs } from "~/lib/types";
import { XchangeLinks } from "~/types/links";
import { Hero } from "./_components/hero";

const liquidityTabs = [
  { id: LiquidityTabs.AllPools, label: "All Pools" },
  { id: LiquidityTabs.MyOpenPositions, label: "My Open Positions" },
  { id: LiquidityTabs.MyClosedPositions, label: "My Closed Positions" },
  { id: LiquidityTabs.Add, label: "Create Position" },
];

export default function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Container maxWidth="6xl" className="px-1 py-8 sm:py-12">
        <Hero />
      </Container>
      <Container maxWidth="6xl" className="px-1">
        <AnimatedTabs
          baseLink={XchangeLinks.Liquidity}
          tabs={liquidityTabs}
          defaultTab={LiquidityTabs.AllPools}
        />
      </Container>
      <div className="w-full border-t border-muted bg-zinc-100 dark:bg-zinc-900">
        <Container maxWidth="6xl" className="px-1">
          <section className="flex flex-1 flex-col">
            <div className="h-full pb-20">{children}</div>
          </section>
        </Container>
      </div>
    </>
  );
}
