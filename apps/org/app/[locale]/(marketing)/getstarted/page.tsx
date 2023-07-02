import { cn } from "utils"

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DocsLinks, MarketingLinks } from "@/lib/types/links"
import { Assistance } from "@/components/assistance"
import { GradientTypes } from "@/components/gradients"
import { PioneerDrop } from "@/components/pioneer-drop"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/[locale]/(marketing)/components/heading"

const metadata = {
  title: "Get Started",
  description:
    "Embark on Your DeFi Journey with X7 Finance: A comprehensive platform tailored for investors and project launchers. Delve into our innovative DeFi solutions, including our Automated Market Making (AMM) Decentralized Exchange (DEX), Lending Pool, and Initial Liquidity Loans. Explore our democratic DAO governance model and learn how to participate. Whether you're an investor seeking opportunities or a project launcher aiming for success, X7 Finance is your portal to the future of decentralized finance.",
  slug: MarketingLinks.GetStarted,
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function GettingStartedPage() {
  return (
    <div>
      <Heading id={"getstarted"} title={"How do you plan on using Xchange?"} />
      <SiteContentContainer>
        <div className="">
          <div className="mx-auto max-w-4xl">
            <dl className="col-span-2 grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-10 text-base leading-7 text-zinc-600 lg:gap-y-16">
              {roles.map((role) => (
                <div key={role.name} className="relative">
                  <Link className="group" href={role.href}>
                    <div
                      className={cn(
                        `mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-600 group-hover:ring-zinc-900 dark:group-hover:ring-zinc-600 duration-300 dark:ring-zinc-800 sm:mt-20 lg:mx-0 flex flex-col lg:max-w-none`
                      )}
                    >
                      <div className="-mt-2 p-2 lg:mt-0">
                        <Image
                          src={`https://img.x7.finance/pioneers/${role?.pioneerId}.png`}
                          alt="Random Pioneer Image"
                          width={600}
                          height={600}
                          className="object-cover rounded-2xl ring-1 ring-inset ring-zinc-900/5"
                        />
                      </div>
                      <div className="my-4 px-4">
                        <h4
                          className={cn(
                            role.gradient,
                            `flex-none group-hover:opacity-90 bg-gradient-to-r bg-clip-text font-display font-semibold sm:group-hover:text-[25px] transform duration-300 leading-6 text-transparent text-sm sm:text-2xl`
                          )}
                        >
                          {role.name}
                          {` `}
                          &#8594;
                        </h4>

                        <p className="dark:text-zinc-400/80 text-zinc-700">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </dl>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none">
              <div className="w-full flex justify-center flex-col items-center">
                <PioneerDrop lineColor="to-lime-600" pioneerId="0054" />
                <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400 text-center mx-auto max-w-4xl">
                  {`X7 Finance and it's fantastic DEX is designed to serve
                  millions of DeFi traders as well as project launchers looking
                  for institutional size liquidity capital to launch their token
                  with.`}
                </p>
              </div>
              <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400 text-center mx-auto max-w-4xl">
                <span className="block mb-4">
                  {`We've drafted comprehensive starting points for traders and
                  projects devs looking to get started with Xchange. As well as
                  detailed documentation for institutions, DAO's and funds
                  looking for information on how to contribute capital to the
                  lending pool.`}
                </span>
              </p>
            </div>
            <dl className="col-span-2 grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-10 text-base leading-7 text-zinc-600 lg:gap-y-16">
              {secondaryRoles.map((role) => (
                <div key={role.name} className="relative">
                  <Link className="group" href={role.href}>
                    <div
                      className={cn(
                        `mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-600 group-hover:ring-zinc-900 dark:group-hover:ring-zinc-600 duration-300 dark:ring-zinc-800 sm:mt-20 lg:mx-0 flex flex-col lg:max-w-none`
                      )}
                    >
                      <div className="my-4 px-4">
                        <h4
                          className={cn(
                            role.gradient,
                            `flex-none group-hover:opacity-90 bg-gradient-to-r bg-clip-text font-display font-semibold sm:group-hover:text-[25px] transform duration-300 leading-6 text-transparent text-sm sm:text-2xl`
                          )}
                        >
                          <Image
                            src={`https://img.x7.finance/pioneers/${role?.pioneerId}.png`}
                            alt="Random Pioneer Image"
                            width={42}
                            height={42}
                            className="object-cover inline mr-2 rounded-full ring-1 ring-inset ring-zinc-900/5"
                          />
                          {role.name}
                          {` `}
                          &#8594;
                        </h4>

                        <p className="dark:text-zinc-400/80 text-zinc-700">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </dl>
          </div>
          <Assistance />
        </div>
      </SiteContentContainer>
    </div>
  )
}

const roles = [
  {
    name: "Trader",
    pioneerId: "0188",
    href: DocsLinks.TradeGuide,
    gradient: GradientTypes.bank,
    description:
      "I am here to trade tokens on the DEX and value a privacy focused, censor-ship free DEX.",
  },
  {
    name: "Project Launcher",
    href: DocsLinks.LaunchGuide,
    gradient: GradientTypes.sunset,
    pioneerId: "0291",
    description:
      "I want to understand the benefits of launching my token on XChange and how to do so.",
  },
]

const secondaryRoles = [
  {
    name: "Project Engineer",
    href: DocsLinks.IntegrationGuide,
    gradient: GradientTypes.steel,
    pioneerId: "0907",
    description:
      "I am here to learn how to integrate my project with X7 Finance and the XChange DEX.",
  },
  {
    name: "Capital Allocator",
    href: DocsLinks.LendingGuide,
    gradient: GradientTypes.rosey,
    pioneerId: "0649",
    description:
      "I am here to learn how to contribute capital to the lending pool and understanding it's benefits.",
  },
]
