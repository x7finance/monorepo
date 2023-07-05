import type { Metadata } from "next"
import Image from "next/image"
import { GradientTypes } from "@/site-components/gradients"
import { PioneerDrop } from "@/site-components/pioneer-drop"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { cn, getRandomPioneerNumber } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"

const metadata = {
  title: "X7DAO",
  description:
    "Dive into X7 DAO: The governance token of X7 Finance, playing a crucial role in our decentralized finance ecosystem. Learn how X7 DAO empowers holders with voting rights, enabling them to participate in key protocol decisions, from modifying tokenomics to determining the long-term fate of locked liquidity. Understand the tokenomics, benefits, and potential returns of holding X7 DAO. Experience the power of decentralized governance with X7 DAO, the voice of X7 Finance.",
  slug: "/tokens/x7dao",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

const imagesArray = Array.from({ length: 64 }, (_, index) => index)

export default function X7RDAO() {
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
              >
                Welcome
              </p>
              <h2 className="font-heading text-3xl leading-[1.1] text-black dark:text-white sm:text-3xl md:text-6xl">
                We Are X7 DAO
              </h2>

              <p className="mt-6 text-base leading-8 text-zinc-400 dark:text-zinc-500 sm:text-xl">
                X7 DAO is the governance token of X7 Finance, playing a crucial
                role in maintaining a balance of the X7 Protocol
              </p>
            </div>
          </div>
        </div>
        <div className="columns-8 gap-4 xl:columns-6 2xl:columns-8">
          {imagesArray.map((i, key) => (
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
