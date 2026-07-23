import { Container } from "@x7/ui/container"
import { AnimatedTabs } from "~/lib/components/core/animate-tabs"
import { FundingTabs } from "~/lib/types"
import { XchangeLinks } from "~/types/links"

import { Hero } from "./_components/hero"

const fundTabs = [
  { id: FundingTabs.Fund, label: "Mint X7D" },
  { id: FundingTabs.History, label: "Transaction History" },
]

export default function LendingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Container maxWidth="6xl" className="px-1 py-8 sm:py-12">
        <Hero />
      </Container>
      <Container maxWidth="6xl" className="px-1">
        <AnimatedTabs
          baseLink={XchangeLinks.Fund}
          tabs={fundTabs}
          defaultTab={FundingTabs.Fund}
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
  )
}
