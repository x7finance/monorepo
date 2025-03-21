import type { Metadata } from "next";

import { cn } from "@x7/css";
import { buttonVariants } from "@x7/ui/button";
import { Dialog, DialogTrigger } from "@x7/ui/dialog";
import { LinkInternal } from "@x7/ui/link";

import { AnimatedShinyText } from "~/lib/components/utils/animated-text";
import { CheckerProviderComponent } from "~/lib/providers/checker";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { HowItWorksDialogContent } from "./_components/how-it-works-dialog";
import { TradingLayout } from "./_components/trading-layout";

const metadata = {
  title: "Trust No One. Trust Code. Long Live Defi.",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function XchangeSwapPage() {
  return (
    <CheckerProviderComponent>
      <div className="relative mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
        <main className="w-full flex-1">
          <div className="my-8 sm:my-12">
            <div className="flex items-center justify-between">
              <AnimatedShinyText
                shimmerWidth={400}
                className="font-heading text-3xl font-extrabold sm:text-4xl md:text-5xl"
              >
                <h1>From Idea to Token, in seconds ⚡</h1>
              </AnimatedShinyText>

              {/* Desktop Dialog */}
              <Dialog>
                <DialogTrigger>
                  <span
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "sm",
                      }),
                      "hidden sm:inline-flex",
                    )}
                  >
                    How it works
                  </span>
                </DialogTrigger>
                <HowItWorksDialogContent />
              </Dialog>
            </div>

            <div className="text-md font-heading text-muted-foreground my-2">
              Also featuring AI Agents launching coins in real-time
            </div>

            {/* Mobile Dialog */}
            <Dialog>
              <DialogTrigger>
                <span className="text-muted-foreground m-0 mb-2 block cursor-pointer text-sm italic underline sm:hidden">
                  How It Works &rarr;
                </span>
              </DialogTrigger>
              <HowItWorksDialogContent />
            </Dialog>
            <LinkInternal
              prefetch={true}
              href="/create"
              className="ease group relative z-30 mt-2 box-border inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-md bg-emerald-600 px-8 py-3 font-bold text-white ring-1 ring-emerald-300 ring-offset-2 ring-offset-emerald-200 transition-all duration-300 hover:bg-emerald-700 hover:ring-2 hover:ring-emerald-400 hover:ring-offset-4 hover:ring-offset-emerald-300 focus:outline-hidden"
            >
              <span className="absolute right-0 bottom-0 -mr-5 -mb-8 h-20 w-8 translate-x-1 rotate-45 transform bg-white opacity-10 transition-all duration-300 ease-out group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 -mt-1 -ml-12 h-8 w-20 -translate-x-1 -rotate-45 transform bg-white opacity-10 transition-all duration-300 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-20 flex items-center text-sm">
                <svg
                  className="relative mr-2 h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                Create Coin Instantly
              </span>
            </LinkInternal>
          </div>

          <TradingLayout />
        </main>
      </div>
    </CheckerProviderComponent>
  );
}
