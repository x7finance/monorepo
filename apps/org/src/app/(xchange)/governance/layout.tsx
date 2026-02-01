import { Container } from "@x7/ui/container"
import { AnimatedTabs } from "~/lib/components/core/animate-tabs"
import { GovernanceTabs } from "~/lib/types"
import { XchangeLinks } from "~/types/links"

import { Hero } from "./_components/hero"

const governanceTabs = [
  { id: GovernanceTabs.Proposals, label: "Proposals" },
  { id: GovernanceTabs.Stake, label: "Stake" },
  { id: GovernanceTabs.MyVotes, label: "My Previous Votes" },
  { id: GovernanceTabs.PreviousProposals, label: "Previous Proposals" },
]

export default function GovernanceLayout({
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
          baseLink={XchangeLinks.Governance}
          tabs={governanceTabs}
          defaultTab={GovernanceTabs.Proposals}
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
