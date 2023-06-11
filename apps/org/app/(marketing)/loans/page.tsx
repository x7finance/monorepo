import { cn } from "utils"
import { buttonVariants } from "ui-server"
import { CheckCircleIcon, X7Logo } from "icons"

import { Metadata } from "next"
import Link from "next/link"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/(marketing)/components/heading"

const metadata = {
  title: "Loans",
  description:
    "Welcome to X7 Finance's Loans Homepage: Your gateway to innovative DeFi lending solutions. Explore our range of unique loan mechanisms, including the Simple Initial Liquidity Loan, Interest Only Initial Liquidity Loan, and Amortizing Initial Liquidity Loan. Understand how these solutions provide initial liquidity to Automated Market Making (AMM) trading pairs with borrowed capital, enhancing liquidity and market capitalization. Start your journey into the future of decentralized finance lending with X7 Finance.",
  slug: "/loans",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function LoansPage() {
  return (
    <div>
      <Heading
        id={"loans"}
        title={"Initial Liquidity Loans"}
        subHeader="Discover the power of Initial Liquidity Loans at X7 Finance. Our unique lending solutions are designed to provide your project with the liquidity it needs to thrive from day one. With flexible terms and competitive rates, we make it easy for you to launch your token and grow your community."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 lg:max-w-none lg:grid-cols-3">
            {loans.map((plan) => (
              <Loan key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}

const loans = [
  {
    id: "X7ILL001",
    name: "Simple Loan",
    description:
      "Loan Origination Fee is 25% of borrowed capital. There is a 0% loan retention premium",
    button: {
      label: "View Contract",
      href: "https://etherscan.io/token/0x7400165e167479a3c81c8fc8cc3df3d2a92e9017#code",
    },
    features: [
      ["Min Loan", "0.5 ETH"],
      ["Max Loan", "5 ETH"],
      ["Leverage", "4x"],
      ["Repayment periods", "1"],
      ["Premium periods", "0"],
      ["Min Loan Duration", "1"],
      ["Max Loan Duration", "7"],
    ],
    liquidation:
      "Failure to pay the principal by the end of the loan will result in liquidation",
    logomarkClassName: "fill-green-500/40",
  },
  {
    id: "X7ILL002",
    name: "Amortizing Loan",
    subTitle: "with interest",
    description:
      "Loan Retention Premium: 6.25% in premiums due by the end of each quarter of the loan term",
    button: {
      label: "View Contract",
      href: "https://etherscan.io/address/0x740019a6b3a9cf3bd193986a560b05726143b217#code",
    },
    features: [
      ["Min Loan", "0.5 ETH"],
      ["Max Loan", "5 ETH"],
      ["Leverage", "10x"],
      ["Repayment periods", "4"],
      ["Premium periods", "4"],
      ["Min Loan Duration", "1"],
      ["Max Loan Duration", "7"],
    ],
    liquidation:
      "Failure to pay the principal or premium on time will result in full liquidation up to the liability amount",
    logomarkClassName: "fill-fuchsia-500/40",
  },
  {
    id: "X7ILL003",
    name: "Interest Only Loan",
    description:
      "Loan Retention Premium: 6.25% in premiums due by the end of each quarter of the loan term",
    button: {
      label: "View Contract",
      href: "https://etherscan.io/address/0x74001c747b6cc9091ee63bc9424dff633fbac617#code",
    },
    features: [
      ["Min", "0.5 ETH"],
      ["Max", "5 ETH"],
      ["Leverage", "6.66x"],
      ["Repayment periods", "1"],
      ["Premium periods", "4"],
      ["Min Loan Duration", "1"],
      ["Max Loan Duration", "7"],
    ],
    liquidation:
      "Failure to pay the principal or premium on time will result in full liquidation up to the liability amount",
    logomarkClassName: "fill-orange-500/40",
  },
]

function Loan({
  id,
  name,
  liquidation,
  description,
  button,
  features,
  logomarkClassName,
}: any) {
  return (
    <section className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 p-6 shadow-lg">
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 group-hover:ring-zinc-900/10 dark:bg-white/2.5 dark:ring-white/10 dark:hover:shadow-black/5 dark:group-hover:ring-white/20"></div>
      <h3
        className={cn("flex items-center text-sm font-semibold text-zinc-900")}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full  ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25  dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-violet-400">
          <X7Logo
            className={cn(
              "h-5 w-5  stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900  dark:stroke-zinc-400 dark:group-hover:fill-violet-300/10 dark:group-hover:stroke-violet-400",
              logomarkClassName
            )}
          />
        </div>
        <span className="ml-4 leading-7 text-zinc-500">{id}</span>
      </h3>
      <p
        className={cn(
          "relative mt-5 flex text-2xl tracking-tight text-zinc-900 dark:text-zinc-100"
        )}
      >
        {name}
      </p>
      <p className={cn("mt-3 text-sm text-zinc-700 dark:text-zinc-400")}>
        {description}
      </p>
      <div className="order-last mt-6">
        <ul
          role="list"
          className={cn(
            "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
          )}
        >
          {features.map((feature: any) => (
            <li key={feature} className="flex w-full py-2">
              <CheckCircleIcon
                className={cn("h-6 w-6 flex-none text-violet-400")}
              />
              <span className="ml-4 text-zinc-600 dark:text-zinc-400">
                {feature[0]}
              </span>
              <span className="ml-auto ">{feature[1]}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col items-center text-sm ">
          <div className="text-violet-400 dark:text-violet-500">
            Liquidation Conditions
          </div>
          <div className="text-center text-zinc-500 dark:text-zinc-400">
            {liquidation}
          </div>
        </div>
      </div>
      <Link
        href={button?.href}
        className={cn(
          buttonVariants({
            variant: "default",
          }),
          "mt-6"
        )}
        aria-label={`Get started with the ${name} loan`}
      >
        <span className="absolute inset-0 rounded-2xl" />
        {button.label}
      </Link>
    </section>
  )
}
