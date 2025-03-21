import Image from "next/image";

import { cn } from "@x7/css";
import { buttonVariants } from "@x7/ui/button";
import { LinkInternal } from "@x7/ui/link";
import { getRandomPioneerNumber } from "@x7/utils";

import { XchangeLinks } from "~/types/links";

export function TopBanner() {
  return (
    <div className="bg-linear-to-b from-emerald-800 to-emerald-950 p-4">
      <div className="relative overflow-hidden rounded-lg bg-black/20 text-emerald-50 shadow-xs shadow-black">
        <div className="relative z-10 flex flex-col items-center justify-between p-4 lg:flex-row">
          <div className="flex w-full items-start justify-start lg:mb-0 lg:w-96 lg:items-center">
            <div className="mb-2">
              <span
                style={{ height: "40" }}
                className={cn(
                  "to-emerald-500",
                  `pioneer-line-drop mx-auto block w-[1px] bg-linear-to-b`,
                )}
              />

              <Image
                height={200}
                width={200}
                className="mx-auto h-auto w-12 overflow-hidden rounded-full shadow-xs ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                src={`https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png`}
                alt="Random Pioneer Image"
              />
            </div>

            <div className="ml-4">
              <span className="text-sm font-light text-emerald-300 italic sm:text-base">
                Introducing
              </span>
              <h2 className="font-heading text-lg font-bold sm:text-2xl">
                AI Agents Liquidity Loans
              </h2>
            </div>
          </div>
          <div className="mt-6 flex items-center text-center sm:text-left">
            <p className="mr-4 max-w-lg text-left text-xs tracking-tight text-emerald-200 sm:text-sm">
              Take advantage of our lending pool to pair your Agents token with
              ETH today
            </p>
            <LinkInternal
              prefetch={true}
              href={XchangeLinks.Lending}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "outline",
                }),
                "inline-flex border-emerald-400 bg-emerald-900 text-emerald-100 hover:bg-emerald-800 hover:text-white",
              )}
            >
              Learn more &rarr;
            </LinkInternal>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 opacity-50 sm:h-40 sm:w-40">
          <div className="absolute inset-0 origin-bottom-left rotate-45 transform bg-linear-to-br from-emerald-700 to-emerald-800"></div>
        </div>
      </div>
    </div>
  );
}
