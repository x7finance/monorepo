import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { GradientTypes } from "@/site-components/gradients"
import { PioneerDrop } from "@/site-components/pioneer-drop"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { buttonVariants } from "@x7/ui/button"
import { cn, getRandomPioneerNumber } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"

const metadata = {
  title: "X7D",
  description:
    "X7’s Decentralized Exchange is a peer-to-peer Automated Market Making (AMM) platform integrated with a novel trustless, permissionless on-chain undercollateralized loan origination and servicing system known as the Lending Pool. For end-users, swapping is intuitive: a user picks an input token and an output token. They specify an input amount, and the protocol calculates how much of the output token they’ll receive. They then execute the swap with one click, receiving the output token in their wallet immediately.",
  slug: "/products/xchange",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

const imagesArray = Array.from({ length: 64 }, (_, index) => index)

export default function X7D() {
  return (
    <div>
      <SiteContentContainer>
        <div className="absolute left-0 right-0 top-36 z-[9] mx-auto max-w-5xl sm:px-6 lg:px-8 xl:top-80">
          <div className="relative mx-8 overflow-hidden bg-black px-6 py-6 shadow-xl sm:rounded-3xl sm:px-10 sm:pb-16 sm:pt-12 md:px-12 lg:px-20">
            <div className={cn("mx-auto max-w-2xl text-center")}>
              <PioneerDrop pioneerId={"3721"} lineColor={"to-emerald-500"} />
              <p
                className={cn(
                  GradientTypes.bank,
                  `font-display my-3 inline bg-gradient-to-r bg-clip-text text-xl font-bold uppercase text-transparent`
                )}
              ></p>
              <h2 className="font-heading text-3xl leading-[1.1] text-black dark:text-white sm:text-3xl md:text-6xl">
                XCHANGE
              </h2>

              <p className="mt-6 text-base leading-8 text-zinc-400 dark:text-zinc-500 sm:text-xl">
                {metadata.description}
              </p>
              <div className="mt-6 flex flex-col items-center gap-y-2 md:gap-x-3 md:gap-y-0">
                <Link
                  href={`/docs/whitepaper/xchange-a-leveraged-initial-liquidity-dex`}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })
                  )}
                >
                  Learn More
                </Link>
                <Link
                  href={`https://app.x7.finance/#/swap`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "sm",
                    }),
                    "border-white border-opacity-60 hover:border-opacity-100"
                  )}
                >
                  Enter Xchange
                  {` `}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="columns-8 gap-4 xl:columns-6 2xl:columns-8">
          {imagesArray.map((_i, key) => (
            <div
              key={key}
              className="after:content after:shadow-highlight group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg"
            >
              <Image
                alt={`random pioneer image`}
                className="h-12 w-12 transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 lg:h-24 lg:w-24 xl:h-auto xl:w-full"
                style={{ transform: "translate3d(0, 0, 0)" }}
                src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                width={400}
                height={400}
              />
            </div>
          ))}
        </div>
      </SiteContentContainer>
    </div>
  )
}
