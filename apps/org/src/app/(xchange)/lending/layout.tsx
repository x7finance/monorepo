import { Container } from "@x7/ui/container";

import { AnimatedTabs } from "~/lib/components/core/animate-tabs";
import { LendingTabs } from "~/lib/types";
import { XchangeLinks } from "~/types/links";
import { Hero } from "./_components/hero";

const lendingTabs = [
  { id: LendingTabs.AllLoans, label: "All Loans" },
  { id: LendingTabs.MyOpenLoans, label: "My Open Loans" },
  { id: LendingTabs.MyClosedLoans, label: "My Closed Loans" },
  { id: LendingTabs.LendingPool, label: "Lending Pool" },
  { id: LendingTabs.LoanTerms, label: "Loan Terms" },
  { id: LendingTabs.InitiateLoan, label: "Initiate Loan" },
];

export default function LendingLayout({
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
          baseLink={XchangeLinks.Lending}
          tabs={lendingTabs}
          defaultTab={LendingTabs.AllLoans}
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
