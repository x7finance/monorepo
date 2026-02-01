import type { Metadata } from "next";
import Image from "next/image";

import { cn } from "@x7/css";
import { X7ContractsEnum } from "@x7/sdk";
import { buttonVariants } from "@x7/ui/button";
import { LinkInternal } from "@x7/ui/link";
import { ChainId, getRandomPioneerNumber } from "@x7/utils";

import { SiteContentContainer } from "~/lib/components/core/site-content-container";
import { PioneerDrop } from "~/lib/components/utils/pioneer-drop";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { GradientTypes } from "~/lib/utils/gradients";

const metadata = {
  title: "X7R",
  description:
    "The X7R token is designed to reward long-term holders through deflationary mechanisms. This encourages users to hold onto their tokens, stabilizing the tokens value and promoting a healthy ecosystem.",
  slug: "/tokens/x7r",
  section: "default",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

const imagesArray = Array.from({ length: 60 }, (_, index) => index);

export default function X7R() {
  return (
    <div>
      <SiteContentContainer>
        <div className="absolute top-36 right-0 left-0 z-9 mx-auto max-w-5xl sm:px-6 lg:px-8 xl:top-80">
          <div className="relative mx-8 overflow-hidden bg-black px-6 py-6 shadow-xl sm:rounded-3xl sm:px-10 sm:pt-12 sm:pb-16 md:px-12 lg:px-20">
            <div className={cn("mx-auto max-w-2xl text-center")}>
              <PioneerDrop
                pioneerId={getRandomPioneerNumber()}
                lineColor={"to-emerald-500"}
              />
              <p
                className={cn(
                  GradientTypes.bank,
                  `font-display my-3 inline bg-linear-to-r bg-clip-text text-xl font-bold text-transparent uppercase`,
                )}
              ></p>
              <h2 className="font-heading text-3xl leading-[1.1] text-black sm:text-3xl md:text-6xl dark:text-white">
                X7R
              </h2>

              <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-xl dark:text-zinc-500">
                {metadata.description}
              </p>
              <div className="mt-6 flex flex-col items-center gap-y-2 md:gap-x-3 md:gap-y-0">
                <LinkInternal
                  prefetch={true}
                  href={`/docs/whitepaper/x7r`}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                  )}
                >
                  Learn More
                </LinkInternal>
                <LinkInternal
                  prefetch={true}
                  href={`/swap?token0=NATIVE&token1=${X7ContractsEnum.X7R(ChainId.ETHEREUM)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "sm",
                    }),
                    "border-opacity-60 hover:border-opacity-100 border-white",
                  )}
                >
                  Trade
                  {` `}
                  <span aria-hidden="true">&rarr;</span>
                </LinkInternal>
              </div>
            </div>
          </div>
        </div>
        <div className="image-container flex items-center justify-center">
          <div className="columns-4 gap-8 xl:columns-6 2xl:columns-8">
            {imagesArray.map((_, index) => (
              <div
                key={`pioneer-image-${index}`}
                className="after:content after:shadow-highlight group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg"
              >
                <Image
                  alt={`random pioneer image`}
                  className="h-12 w-12 transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 lg:h-24 lg:w-24 xl:h-auto xl:w-full"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  src={`https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png`}
                  width={400}
                  height={400}
                />
              </div>
            ))}
          </div>
        </div>
      </SiteContentContainer>
    </div>
  );
}
