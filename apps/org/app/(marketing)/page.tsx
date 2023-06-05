import { X7LinksEnum } from "common"
import { cn } from "utils"
import { Xchange } from "icons"

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DocsLinks } from "@/lib/types/links"
import { buttonVariants } from "@/components/ui/button"

import { HeaderVideoComponent } from "./components/video"

const metadata = {
  title: "Trust No One. Trust Code. Long Live DeFi.",
  description:
    "X7 Finance is a revolutionary project in the Decentralized Finance (DeFi) space, offering innovative smart contracts that provide visionary ideas with access to leveraged seed capital. Our platform features an Automated Market Making (AMM) Decentralized Exchange (DEX), a Lending Pool, and Initial Liquidity Loans, all governed by a democratic Decentralized Anonymous Organization (DAO). We offer a unique opportunity for project launchers, capital providers, system governors, and traders to participate in a trustless, permissionless, and censorship-resistant financial ecosystem. Join us in redefining the future of finance.",
  slug: "/",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 md:pb-12">
        <HeaderVideoComponent />
        <div className="pointer-events-none absolute inset-x-0 text-sm md:text-base top-4 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
          <div className="pointer-events-auto flex items-center announcement-shadow justify-between gap-x-6 bg-black border-zinc-900 border px-6 py-3 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
            <p className="text-zinc-400 tracking-tight">
              <Link
                href={X7LinksEnum.Xchange}
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
          <h1 className="py-8 text-[14vw] text-center sm:text-9xl leading-none select-none tracking-tightest font-extrabold">
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
          <div className="gap-y-2 md:gap-x-3 md:gap-y-0 flex flex-col-reverse md:flex-row items-center">
            <Link
              href={DocsLinks.Index}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
                "text-md h-12 border-zinc-500 hover:shadow-sm transition-all duration-500 hover:shadow-white hover:bg-transparent w-full"
              )}
            >
              Read Docs
            </Link>
            <Link
              href={X7LinksEnum.Xchange}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-background m-auto inline-block transition-all duration-1000 rounded-md bg-zinc-900 from-[#23094f] via-[#b74e4c] to-yellow-500 hover:bg-none bg-[length:400%_400%] p-[0.175rem] [animation-duration:_6s] bg-gradient-to-r dark:bg-black"
            >
              <span className="flex items-center bg-white px-8 rounded-md py-3 text-md font-medium text-zinc-900 dark:bg-black dark:text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:text-white hover:via-purple-800 hover:to-red-500">
                Enter <Xchange className="w-24 pl-1 pr-2" />
                {` `}
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden py-24 sm:py-32 mt-12 sm:mt-48 md:mt-24 lg:mt-28">
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
                        <h5 className="mt-2 mb-1 text-black dark:text-white text-[22px] font-semibold tracking-tighter">
                          {feature.name}
                        </h5>
                      </dt>{" "}
                      <dd className="inline dark:text-zinc-500 text-zinc-400">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="sm:px-6 lg:px-0">
              <div className="relative isolate overflow-hidden  bg-gradient-to-bl from-violet-800 to-black px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
                <div
                  className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-32deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white"
                  aria-hidden="true"
                />
                <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                  <Image
                    src="/images/home/xchange-3.png"
                    alt="Xchange screenshot"
                    width={2432}
                    height={1442}
                    className="-mb-12 w-[57rem] max-w-none rounded-tl-xl bg-zinc-800 ring-1 ring-white/10"
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
          gradientColor="from-emerald-400 via-green-500 to-cyan-400"
          subHeader="Launch"
          header="Supercharge your project with Xchange"
          description="Through our innovative Leveraged Initial Liquidity Loans Xchange can provide massive initial seed capital to visionary entrepreneurs, organizations, and businesses."
          hasSubSection={true}
        />
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
            <StepSection
              header="Kickstart Your Project with the Right Liquidity"
              subHeader="Determine the optimal liquidity level to make your project's launch a success"
              pioneerId="0600"
              gradient="from-orange-400 via-red-500 to-yellow-400"
              checkColor="text-orange-600"
              highlightHeader="Benefits of Xchange Liquidity"
              highlights={[
                "Flexible leverage options (1-10x)",
                "Competitive borrowing rates",
                "A privacy-focused/trustless DEX",
                "Access to institutional capital",
              ]}
            />
            <StepSection
              header="Choose the Perfect Loan for Your Project"
              subHeader="Flexible loan options to fuel the growth of your project - regardless of size"
              pioneerId="0621"
              gradient="from-slate-400 via-blue-500 to-amber-400"
              checkColor="text-blue-600"
              isReverse={true}
              highlightHeader="Diverse loan options"
              highlights={[
                "Minimal fees",
                "Complete protection of your LP",
                "Discounts available from X7 DAO",
                "ETH, BNB, MATIC, and more",
              ]}
            />
            <StepSection
              header="Make a Splash with Your Launch on Xchange"
              subHeader="Seamless Launches for Maximum Impact"
              pioneerId="0590"
              gradient="from-slate-400 via-rose-500 to-sky-400"
              checkColor="text-rose-600"
              highlightHeader="Diverse loan options"
              highlights={[
                "Smooth pair launch",
                "High liquidity provision",
                "Trustless trading experience for traders",
                "All pairs available at your investors fingertips",
              ]}
            />
            <StepSection
              header="Choose How You Want to Pay Off Your Loan"
              subHeader="Seamless Launches for Maximum Impact"
              pioneerId="0166"
              isReverse={true}
              gradient="from-slate-400 via-amber-500 to-zinc-400"
              checkColor="text-amber-600"
              highlightHeader="Your LP. Your Choice."
              highlights={[
                "Multiple repayment options",
                "Have your LP work for you",
                "Countless connected protocols to manage your liquidity",
                "Or don't pay it off at all!",
              ]}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden py-12 sm:py-24">
        <SectionHeader
          pioneerId="0269"
          lineColor="to-pink-600"
          gradientColor="from-fuchsia-400 via-pink-500 to-rose-400"
          subHeader="Invest"
          header="The future of DeFi is actually decentralized."
          description="Our innovative DeFi solutions, from our AMM DEX Xchange and lending pool to our unique utility NFTs, offer a range of investment opportunities. By investing in the X7 Finance ecosystem, you're not just investing in a single project, but in a suite of DeFi solutions with great potential."
        />
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
            <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
              <div className="order-last md:order-1">
                <h2 className="sm:text-7xl text-4xl font-bold tracking-tight text-black dark:text-white lg:pl-9">
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
                  src="/images/home/astronaut.gif"
                  alt="Xchange screenshot"
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
                    <h5 className="mt-2 mb-1 text-black dark:text-white text-[22px] font-semibold tracking-tighter">
                      {incentive.name}
                    </h5>

                    <p className="mt-2 text-sm dark:text-zinc-500 text-zinc-400">
                      {incentive.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section
        id="long-live-decentralization"
        className="container pt-8 md:pt-12 lg:pt-24 bg-gradient-to-b to-black mb-20"
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

const features = [
  {
    name: "High Liquidity",
    description:
      "Our unique lending protocol ensure high liquidity for a seamless trading experience.",
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

function SectionHeader(props: any) {
  const {
    pioneerId,
    subHeader,
    header,
    description,
    lineColor,
    gradientColor,
    hasSubSection,
  } = props

  return (
    <div
      className={cn(
        "mx-auto max-w-2xl text-center",
        !hasSubSection ? `mb-16` : ``
      )}
    >
      <div className="mb-6">
        <span
          className={cn(
            lineColor,
            "w-[1px] mx-auto block h-[100px] bg-gradient-to-b from-black"
          )}
        />
        <Image
          height={200}
          width={200}
          className="h-auto w-12 mx-auto overflow-hidden rounded-full shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
          src={`https://img.x7.finance/pioneers/${pioneerId}.png`}
          alt="Random Pioneer Image"
        />
      </div>
      <p
        className={cn(
          gradientColor,
          `inline font-bold bg-gradient-to-r bg-clip-text font-display text-xl sm:text-3xl my-3 uppercase text-transparent`
        )}
      >
        {subHeader}
      </p>
      <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl dark:text-white text-black">
        {header}
      </h2>

      <p className="mt-6 text-xl leading-8 text-zinc-400 dark:text-zinc-500">
        {description}
      </p>
    </div>
  )
}

const incentives = [
  {
    name: "Diverse Opportunities",
    imageSrc: "https://img.x7.finance/pioneers/0123.png",
    description:
      "X7 Finance provides a range of investment avenues including participating in trading ERC-20 tokens on Xchange, to contributing to our lending pool to earn potential returns, or purchasing our unique Utility NFTs for exclusive benefits, and holding our native tokens like X7 DAO for governance rights, all while emphasizing the importance of individual research and risk assessment.",
  },
  {
    name: "DAO Governance",
    imageSrc: "https://img.x7.finance/pioneers/0236.png",
    description:
      "X7 DAO is a revolutionary democratic governance model that empowers token holders with decision-making authority, shaping the future of the X7 Finance ecosystem and playing a pivotal role in the evolution of decentralized finance",
  },
  {
    name: "Innovative Community",
    imageSrc: "https://img.x7.finance/pioneers/0111.png",
    description:
      "Be part of an ecosystem that's at the forefront of DeFi innovation.",
  },
]

function StepSection(props: any) {
  const {
    header,
    subHeader,
    highlightHeader,
    highlights,
    pioneerId,
    gradient,
    checkColor,
    isReverse,
  } = props

  return (
    <>
      <span
        className={
          "w-[1px] mx-auto block h-[100px] bg-gradient-to-b from-black to-zinc-600 relative top-10"
        }
      />
      <span className="w-[11px] h-[11px] rounded-full my-1 circle-shadow mx-auto block top-10 relative" />
      <div
        className={cn(
          isReverse ? `lg:flex-row-reverse` : ``,
          `mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-200 dark:ring-zinc-800 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none`
        )}
      >
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {header}
          </h3>
          <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {subHeader}
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4
              className={cn(
                gradient,
                `flex-none bg-gradient-to-r bg-clip-text font-display text-sm font-semibold leading-6 text-transparent`
              )}
            >
              {highlightHeader}
            </h4>
            <div className="h-px flex-auto bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:grid-cols-2 sm:gap-6"
          >
            {highlights.map((highlight, key) => (
              <li key={key} className="flex gap-x-3">
                <svg
                  className={cn(checkColor, `h-6 w-5 flex-none`)}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="lg:flex lg:flex-col lg:justify-center">
            <Image
              src={`https://img.x7.finance/pioneers/${pioneerId}.png`}
              alt="Random Pioneer Image"
              width={1000}
              height={1000}
              className="object-cover rounded-2xl ring-1 ring-inset ring-zinc-900/5"
            />
          </div>
        </div>
      </div>
    </>
  )
}
