import { X7LinksEnum } from "common"
import { cn } from "utils"
import { XChange } from "icons"

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { DocsLinks } from "@/lib/types/links"
import { buttonVariants } from "@/components/ui/button"

import { HeaderVideoComponent } from "./components/video"

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 md:pb-12">
        <HeaderVideoComponent />
        <div className="pointer-events-none absolute inset-x-0 text-sm md:text-base top-16 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
          <div className="pointer-events-auto flex items-center announcement-shadow justify-between gap-x-6 bg-black border-zinc-900 border px-6 py-3 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
            <p className="text-zinc-400 tracking-tight">
              <Link
                href={X7LinksEnum.XChange}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 inline-block text-zinc-400 mr-2"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
                <strong className="font-semibold text-zinc-200">
                  X7 has launched on 5 chains
                </strong>
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                Launch with a Leveraged Liquidity Loan{` `}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </div>
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative">
          <h1 className="py-14 text-[10vw] text-center sm:text-10xl leading-none select-none tracking-tightest font-extrabold">
            <span
              data-content="Trade"
              className="relative block italic before:content-[attr(data-content)] before:w-full before:z-0 before:block before:absolute before:top-0 before:px-2 before:bottom-0 before:left-0 before:text-center before:text-hero-header before:animate-gradient-background-1"
            >
              <span className="px-6 text-hero animate-gradient-foreground-1">
                Trade
              </span>
            </span>
            <span
              data-content="On"
              className="relative block italic before:content-[attr(data-content)] before:w-full before:z-0 before:block before:absolute before:top-0 before:px-2 before:bottom-0 before:left-0 before:text-center before:text-hero-header before:animate-gradient-background-2"
            >
              <span className="px-6 text-hero animate-gradient-foreground-2">
                {" "}
                On
              </span>
            </span>
            <span
              data-content=""
              className="relative py-4 block before:w-full before:z-0 before:block before:absolute before:top-0 before:px-2 before:bottom-0 before:left-0 before:text-center before:text-black before:animate-gradient-background-3"
            >
              <Image
                height={1000}
                width={1000}
                priority={true}
                className="h-auto w-full"
                src={`/images/xchange-shadow-white.png`}
                alt="Utility NFT Image"
              />
            </span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 bg-transparent"></p>
          <div className="space-x-4">
            <Link
              href={DocsLinks.Index}
              className={cn(
                buttonVariants({
                  variant: "border",
                  size: "lg",
                }),
                "text-md"
              )}
            >
              Read Docs
            </Link>
            <Link
              href={X7LinksEnum.XChange}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-background inline-block rounded-md bg-zinc-900 from-[#23094f] via-[#b74e4c] to-yellow-500 hover:bg-none bg-[length:400%_400%] p-[0.175rem] [animation-duration:_6s] bg-gradient-to-r dark:bg-black"
            >
              <span className="flex items-center bg-white px-8 rounded-md py-2 text-md font-medium text-zinc-900 dark:bg-black dark:text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:text-white hover:via-purple-800 hover:to-red-500">
                Enter <XChange className="w-24 pl-1 pr-2" />
                {` `}
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="long-live-decentralization"
        className="container pt-8 md:pt-12 lg:pt-24 bg-gradient-to-b to-black"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Completely Decentralized
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            All official channels are run by community members in a
            decentralized fashion. We believe a distributed network of
            individuals and committees - free from central influence is
            paramount to the longevity of decentralized finance.
          </p>
        </div>
      </section>
    </>
  )
}
