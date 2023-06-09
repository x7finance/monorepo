import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { GradientTypes } from "@/site-components/gradients"
import { PioneerDrop } from "@/site-components/pioneer-drop"
import { useTranslations } from "next-intl"

import { SocialsEnum, X7LinksEnum } from "@x7/common"
import { DotIcon, RocketIcon, Xchange } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { cn } from "@x7/utils"

import { env } from "@/env.mjs"
import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DocsLinks, TokenLinksEnum } from "@/lib/types/links"
import { SectionHeader } from "./_components/section-header"
import { SectionStep } from "./_components/section-step"
import { HeaderVideoComponent } from "./_components/video"

const metadata = {
  title: "Trust No One. Trust Code. Long Live DeFi.",
  description:
    "X7 Finance is a revolutionary project in the Decentralized Finance (DeFi) space, offering innovative smart contracts that provide visionary ideas with access to leveraged seed capital. Our platform features an Automated Market Making (AMM) Decentralized Exchange (DEX), a Lending Pool, and Initial Liquidity Loans, all governed by a democratic Decentralized Anonymous Organization (DAO). We offer a unique opportunity for project launchers, capital providers, system governors, and traders to participate in a trustless, permissionless, and censorship-resistant financial ecosystem. Join us in redefining the future of finance.",
  slug: "/",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function IndexPage() {
  const t = useTranslations("IndexPage")

  return (
    <>
      <section className="space-y-6 pb-8 md:pb-12">
        <HeaderVideoComponent />
        <div className="pointer-events-none absolute inset-x-0 top-4 text-sm sm:flex sm:justify-center sm:px-6 sm:pb-5 md:text-base lg:px-8">
          <div className="announcement-shadow pointer-events-auto justify-between gap-x-6 border border-zinc-900 bg-black px-6 py-1.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
            <Link
              href={X7LinksEnum.Xchange}
              target="_blank"
              className="tracking-tight text-zinc-400"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col items-center justify-center sm:flex-row">
                <div>
                  <RocketIcon className="mr-2 inline-block h-4 w-4 text-zinc-400" />
                  <strong className="font-semibold text-zinc-200">
                    {t("banner.title")}
                  </strong>
                </div>
                <div className="block">
                  <DotIcon className="mx-2 hidden h-2 w-2 fill-current sm:inline" />
                  {t("banner.description")}
                  {` `}
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="container relative mt-16 flex flex-col items-center text-center sm:gap-4">
          <h1 className="mb-6 flex flex-col flex-wrap justify-center text-center text-5xl font-extrabold italic tracking-tightest sm:text-7xl md:text-8xl lg:flex-row lg:text-[7rem]">
            <span
              data-content="Launch."
              className="before:text-hero-header before:text-super-gradient relative block before:absolute before:bottom-0 before:left-0 before:top-0 before:block before:w-full before:animate-gradient-background-1 before:px-2 before:text-center before:content-[attr(data-content)] dark:before:content-[attr(data-content)]"
            >
              <span className="animate-gradient-foreground-1 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 bg-clip-text px-2 text-transparent">
                Launch.
              </span>
            </span>
            <span
              data-content="Trade."
              className="before:text-hero-header before:text-super-gradient relative block before:absolute before:bottom-0 before:left-0 before:top-0 before:block before:w-full before:animate-gradient-background-2 before:px-2 before:text-center before:content-[attr(data-content)] dark:before:content-[attr(data-content)]"
            >
              <span className="animate-gradient-foreground-2 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 bg-clip-text px-2 text-transparent">
                Trade.
              </span>
            </span>
            <span
              data-content="Lend."
              className="before:text-hero-header before:text-super-gradient relative block before:absolute before:bottom-0 before:left-0 before:top-0 before:block before:w-full before:animate-gradient-background-3 before:px-2 before:text-center before:content-[attr(data-content)] dark:before:content-[attr(data-content)]"
            >
              <span className="animate-gradient-foreground-3 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 bg-clip-text px-2 text-transparent">
                Lend.
              </span>
            </span>
          </h1>

          <span
            data-content="On"
            className="before:text-hero-header relative block text-2xl italic before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:block before:w-full before:px-2 before:text-center before:content-[attr(data-content)] sm:text-3xl xl:text-4xl"
          >
            <span className="text-hero text-on px-6">On</span>
          </span>
          <span className="relative w-[350px] py-4 before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:block before:w-full before:px-2 before:text-center before:text-black sm:w-[400px] xl:w-[550px]">
            <Image
              height={500}
              width={500}
              priority={true}
              className="h-auto w-full"
              src={`/images/xchange-shadow-white.png`}
              alt="Utility NFT Image"
            />
          </span>

          <p className="max-w-[42rem] bg-transparent leading-normal sm:text-xl sm:leading-8"></p>
          <div className="flex flex-col-reverse items-center gap-y-2 md:flex-row md:gap-x-3 md:gap-y-0">
            <Link
              href={DocsLinks.Index}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
                "text-md h-12 w-full border-zinc-500 text-zinc-300 transition-all duration-500 hover:bg-transparent hover:text-white hover:shadow-sm hover:shadow-white"
              )}
            >
              Read Docs
            </Link>
            <Link
              href={X7LinksEnum.Xchange}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-background m-auto inline-block rounded-md bg-zinc-900 bg-gradient-to-r from-[#23094f] via-[#b74e4c] to-yellow-500 bg-[length:400%_400%] p-[0.175rem] transition-all duration-1000 [animation-duration:_6s] hover:bg-none dark:bg-black"
            >
              <span className="text-md flex items-center rounded-md bg-white px-8 py-3 font-medium text-zinc-900 hover:bg-gradient-to-tr hover:from-purple-500 hover:via-purple-800 hover:to-red-500 hover:text-white dark:bg-black dark:text-white">
                Enter <Xchange className="w-24 pl-1 pr-2" />
                {` `}
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-12 overflow-hidden py-24 sm:mt-48 sm:py-32 md:mt-24 lg:mt-28">
        <SectionHeader
          pioneerId="0069"
          subHeader="Trade"
          lineColor="to-sky-600"
          gradientColor="from-sky-400 via-violet-500 to-indigo-400"
          header="Get the best price. Everytime."
          description="The Xchange routing algorithm will select the most advantageous route to
          take either on leading DEX's or across multiple pairs on multiple
          exchanges."
        />
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
            <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-zinc-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative md:pl-9">
                      <dt className="inline font-semibold text-zinc-900">
                        <Image
                          height={200}
                          width={200}
                          className="h-auto w-12 overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                          src={`https://img.x7.finance/pioneers/${feature.id}.png`}
                          alt="Random Pioneer Image"
                        />
                        <h5 className="mb-1 mt-2 text-[22px] font-semibold tracking-tighter text-black dark:text-white">
                          {feature.name}
                        </h5>
                      </dt>{" "}
                      <dd className="inline text-zinc-400 dark:text-zinc-500">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="sm:px-6 lg:px-0">
              <div className="rounded-tb-3xl relative isolate overflow-hidden rounded-tl-3xl bg-gradient-to-bl from-violet-800 to-black px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
                <div
                  className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-32deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white"
                  aria-hidden="true"
                />
                <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                  <Image
                    src={`${env.NEXT_PUBLIC_ASSETS_URL}/images/home/xchange.png`}
                    alt="Xchange screenshot"
                    width={2432}
                    height={1442}
                    className="-mb-12 w-[40rem] max-w-none rounded-tl-xl bg-zinc-800 ring-1 ring-white/10 sm:w-[57rem]"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden py-12 sm:py-24">
        <SectionHeader
          pioneerId="0561"
          lineColor="to-teal-600"
          gradientColor={GradientTypes.bank}
          subHeader="Launch"
          header="Supercharge your project with Xchange"
          description="Through our innovative Leveraged Initial Liquidity Loans Xchange can provide massive initial seed capital to visionary entrepreneurs, organizations, and businesses."
          hasSubSection={true}
        />
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl px-2 lg:max-w-none">
            <SectionStep
              header="Kickstart Your Project with the Right Liquidity"
              subHeader="Determine the optimal liquidity level to make your project's launch a success. By borrowing liquidity from Xchange to launch your token, you'll have the ability to attract larger investments early with healthier liquidity levels"
              pioneerId="0600"
              gradient={GradientTypes.sunset}
              checkColor="text-orange-600"
              highlightHeader="Benefits of Xchange Liquidity"
              highlights={[
                "Flexible leverage options (1-10x)",
                "Competitive borrowing rates",
                "A privacy-focused/trustless DEX",
                "Access to institutional capital",
                "Permissionless & trustless access - anyone anywhere can borrow",
                "Preserve cash that you'd otherwise tie up in liquidity",
              ]}
            />
            <SectionStep
              header="Choose the Perfect Loan for Your Project"
              subHeader="Flexible loan options to fuel the growth of your project - regardless of size"
              pioneerId="0621"
              gradient={GradientTypes.mining}
              checkColor="text-blue-600"
              isReverse={true}
              highlightHeader="Diverse loan options"
              highlights={[
                "Minimal fees",
                "Complete protection of your LP",
                "Discounts available from X7 DAO",
                "ERC, BSC, Polygon, Arbitrum and more",
              ]}
            />
            <SectionStep
              header="Make a Splash with Your Launch on Xchange"
              subHeader="Seamless Launches for Maximum Impact"
              pioneerId="0590"
              gradient={GradientTypes.redLight}
              checkColor="text-rose-600"
              highlightHeader="High Availability Launch Tooling"
              highlights={[
                "Smooth pair launch",
                "High liquidity provision",
                "Trustless trading experience for traders",
                "All pairs available at your investors fingertips",
              ]}
            />
            <SectionStep
              header="Choose How You Want to Pay Off Your Loan"
              subHeader="Under-collateralized loans with flexible terms"
              pioneerId="0166"
              isReverse={true}
              gradient={GradientTypes.marsSunset}
              checkColor="text-amber-600"
              highlightHeader="Your LP. Your Choice."
              highlights={[
                "Multiple repayment options",
                "Have your LP work for you",
                "Protocol is completely extensible to manage your liquidity",
                "Or don't pay it off at all!",
              ]}
            />
          </div>
        </div>
      </div>

      <section className="relative isolate overflow-hidden px-6 py-12 lg:px-8">
        <div
          className={cn(
            `mx-auto w-full max-w-5xl rounded-3xl bg-gradient-to-r from-emerald-400/50 via-green-500/50 to-cyan-400/50 p-[2px]`
          )}
        >
          <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white dark:bg-black">
            <div className="mx-auto max-w-2xl py-12 lg:max-w-4xl">
              <h3 className="dark:text-hero-header-regular text-hero-header-light mx-4 mt-1 text-center text-xl font-bold italic tracking-tight sm:text-3xl">
                Common Token Launch Scenario
              </h3>
              <PioneerDrop lineColor="to-emerald-500" height={50} />
              <figure>
                <blockquote className="mx-4 text-center font-semibold leading-8 tracking-tight text-zinc-900 dark:text-zinc-300 sm:leading-9">
                  <p className="text-base italic sm:text-lg md:text-2xl">
                    {`Bruce Lee has a great idea for a token, but only has 10 ETH
                    in startup captial available. Bruce needs to pay for product,
                    marketing, community growth, and many other expenses.`}
                  </p>
                  <p className="mt-5 text-base italic sm:text-lg md:text-2xl">
                    {`Before X7, Bruce would need to use 20-30% of his startup
                    capital just for liquidity, and he'd rarely get it back.
                    Using X7, Bruce can take just 0.5 ETH and leverage it 10X to
                    launch with sufficient liquidity and use his cash on hand
                    more efficiently.`}
                  </p>
                </blockquote>
                <figcaption className="mt-10">
                  <Image
                    height={200}
                    width={200}
                    className="mx-auto h-auto w-24 overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                    src={"https://img.x7.finance/pioneers/1234.png"}
                    alt="Bruce Lee Pioneer Image"
                  />
                  <div className="mt-4 flex items-center justify-center space-x-1 text-base">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Bruce Lee
                    </div>
                    <DotIcon className="fill-zinc-900 dark:fill-zinc-100" />
                    <div className="text-zinc-600 dark:text-zinc-400">
                      Project Dev
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden py-12 sm:py-24">
        <SectionHeader
          pioneerId="0269"
          lineColor="to-pink-600"
          gradientColor={GradientTypes.rosey}
          subHeader="Invest"
          header="The future of DeFi is actually decentralized."
          description="Our innovative DeFi solutions, from our AMM DEX Xchange and lending pool to our unique utility NFTs, offer a range of investment opportunities. By investing in the X7 Finance ecosystem, you're not just investing in a single project, but in a suite of DeFi solutions with great potential."
        />
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl px-2 lg:max-w-none">
            <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
              <div className="order-last md:order-1">
                <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-7xl lg:pl-9">
                  Pioneers <br />
                  of
                  <br />
                  DeFi
                  <br />
                  have
                  <br />
                  arrived.
                </h2>
              </div>

              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-zinc-100 md:order-last">
                <Image
                  src={`${env.NEXT_PUBLIC_ASSETS_URL}/images/home/astronaut.gif`}
                  alt="Pioneer Astronaut Image"
                  width={1000}
                  height={1000}
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              {incentives.map((incentive) => (
                <div key={incentive.name} className="sm:flex lg:block">
                  <div className="sm:flex-shrink-0">
                    <Image
                      height={200}
                      width={200}
                      className="h-auto w-24 overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                      src={incentive.imageSrc}
                      alt="Random Pioneer Image"
                    />
                  </div>
                  <div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                    <h5 className="mb-1 mt-2 text-[22px] font-semibold tracking-tighter text-black dark:text-white">
                      {incentive.name}
                    </h5>

                    <p className="mt-2 text-sm  text-zinc-500">
                      {incentive.description}
                    </p>
                    <Link
                      className={cn(
                        incentive?.gradient,
                        `font-display mt-2 flex-none transform bg-gradient-to-r bg-clip-text text-sm font-semibold leading-6 text-transparent duration-300 group-hover:opacity-90 sm:group-hover:text-[25px]`
                      )}
                      {...(incentive?.isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      href={`${incentive?.href}`}
                    >
                      {incentive?.linkText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section
        id="long-live-decentralization"
        className="container mb-20 pt-8 md:pt-12 lg:pt-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <PioneerDrop pioneerId={"4208"} lineColor={"to-sky-500"} />
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Completely Decentralized
          </h2>
          <p className="max-w-[85%] leading-normal text-zinc-500 sm:text-lg sm:leading-7">
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

const features = [
  {
    name: "High Liquidity",
    description:
      "Xchange searches for the deepest liquidity pools to reduce slippage on your orders.",
    id: "0013",
  },
  {
    name: "Privacy First",
    description:
      "Xchange will never track or store any of your trading history. Everything is handled on-chain.",
    id: "0077",
  },
  {
    name: "Trustless Transactions",
    description:
      "Experience secure, trustless transactions in the world of decentralized finance.",
    id: "0532",
  },
]

const incentives = [
  {
    name: "Diverse Opportunities",
    imageSrc: "https://img.x7.finance/pioneers/0123.png",
    description:
      "X7 Finance provides a range of investment avenues including participating in trading ERC-20 tokens on Xchange, to contributing to our lending pool to earn potential returns, or purchasing our unique Utility NFTs for exclusive benefits, and holding our native tokens like X7 DAO for governance rights, all while emphasizing the importance of individual research and risk assessment.",
    href: "/docs/whitepaper/tokenomics/",
    linkText: <>Explore Tokenomics &#8594;</>,
    gradient: GradientTypes.marsSunset,
  },
  {
    name: "DAO Governance",
    imageSrc: "https://img.x7.finance/pioneers/0236.png",
    description:
      "X7 DAO is a revolutionary democratic governance model that empowers token holders with decision-making authority, shaping the future of the X7 Finance ecosystem and playing a pivotal role in the evolution of decentralized finance",
    href: TokenLinksEnum.X7DAO,
    linkText: <>Join X7 DAO &#8594;</>,
    gradient: GradientTypes.bank,
  },
  {
    name: "Innovative Community",
    imageSrc: "https://img.x7.finance/pioneers/0111.png",
    description:
      "Be part of an ecosystem that's at the forefront of DeFi innovation.",
    href: SocialsEnum.telegram,
    linkText: <>Say Hello &#8594;</>,
    gradient: GradientTypes.rosey,
    isExternal: true,
  },
]
