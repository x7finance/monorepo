"use client";

// import { useSearchParams } from "next/navigation"
import { Container } from "@x7/ui/container";
import { LinkInternal } from "@x7/ui/link";
import { PathnameButton } from "@x7/ui/pathname-button";

import { Hero } from "./_components/hero";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const searchParams = useSearchParams()

  return (
    <>
      <Container maxWidth="7xl" className="px-1 py-8 sm:py-12">
        <Hero />
      </Container>
      <Container maxWidth="7xl" className="px-1">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <LinkInternal
            prefetch={true}
            shallow={true}
            scroll={false}
            href="#"
            // href={`/vote?${searchParams.toString()}`}
          >
            <PathnameButton
              id="all-votes"
              pathname="#"
              pathSelector="tab"
              activeTab={"all-votes"}
              asChild
              size="sm"
            >
              Vote
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href="#"
            // href={`/vote/new?${searchParams.toString()}`}
          >
            <PathnameButton
              id="new"
              pathname="#"
              pathSelector="tab"
              activeTab={"new"}
              // pathname={"/vote/new"}
              asChild
              size="sm"
            >
              Create Proposal
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href="#"
            // href={`vote/closed?${searchParams.toString()}`}
          >
            <PathnameButton
              id="closed"
              pathname="#"
              pathSelector="tab"
              activeTab={"closed"}
              // pathname={"/vote/closed"}
              asChild
              size="sm"
            >
              Closed
            </PathnameButton>
          </LinkInternal>
          <LinkInternal
            shallow={true}
            scroll={false}
            href="#"
            // href={`/vote/excecuted?${searchParams.toString()}`}
          >
            <PathnameButton
              id="migrate"
              pathname="#"
              pathSelector="tab"
              activeTab={"migrate"}
              // pathname={"/vote/executed"}
              asChild
              size="sm"
            >
              Executed
            </PathnameButton>
          </LinkInternal>
        </div>
      </Container>
      <section className="flex flex-1 flex-col">
        <div className="h-full border-t border-zinc-400 pt-4 pb-20 dark:border-zinc-800">
          {children}
        </div>
      </section>
    </>
  );
}
