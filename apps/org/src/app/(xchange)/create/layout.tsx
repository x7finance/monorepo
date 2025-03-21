import { Container } from "@x7/ui/container";

import { AnimatedTabs } from "~/lib/components/core/animate-tabs";
import { CreateTabs } from "~/lib/types";
import { XchangeLinks } from "~/types/links";
import { Hero } from "./_components/hero";

const createTabs = [
  { id: CreateTabs.Create, label: "Create" },
  { id: CreateTabs.Manage, label: "Manage" },
  { id: CreateTabs.Deployer, label: "Deployerrr" },
];

export default function CreateLayout({
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
          baseLink={XchangeLinks.Create}
          tabs={createTabs}
          defaultTab={CreateTabs.Create}
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
