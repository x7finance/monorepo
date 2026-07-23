import type { Metadata } from "next"

import { cn } from "@x7/css"
import { CheckCircleIcon, X7Logo } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { LinkInternal } from "@x7/ui/link"
import { SiteContentContainer } from "~/lib/components/core/site-content-container"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink"

import { Heading } from "../_components/heading"

const metadata = {
  title: "Loans",
  description:
    "Welcome to X7 Finance's Loans Homepage: Your gateway to innovative DeFi lending solutions. Explore our range of unique loan mechanisms, including the Simple Liquidity Loan, Interest Only Liquidity Loan, and Amortizing Liquidity Loan. Understand how these solutions provide initial liquidity to Automated Market Making (AMM) trading pairs with borrowed capital, enhancing liquidity and market capitalization. Start your journey into the future of decentralized finance lending with X7 Finance.",
  slug: "/ill",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function LoansPage() {
  return (
    <div>
      <Heading
        id={"loans"}
        title={"Liquidity Loans"}
        subHeader="Discover the power of Liquidity Loans at X7 Finance. Our unique lending solutions are designed to provide your project with the liquidity it needs to thrive from day one. With flexible terms and competitive rates, we make it easy for you to launch your token and grow your community."
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
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

const loans: LoanViewType[] = [
  {
    id: "X7ILL001",
    name: "Simple Loan",
    description:
      "Loan Origination Fee is 25% of borrowed capital. There is a 0% loan retention premium",
    secondaryButton: {
      label: "View Contract",
      href: getExplorerLink(
        1,
        "0x7400165e167479a3c81c8fc8cc3df3d2a92e9017",
        ExplorerDataType.ADDRESS
      ),
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
    logomarkClassName: "fill-emerald-500/40",
  },
  {
    id: "X7ILL002",
    name: "Amortizing Loan",
    description:
      "Loan Retention Premium: 6.25% in premiums due by the end of each quarter of the loan term. Note: The AMM pool will still operate as normal after the lent liquidity is removed.",
    secondaryButton: {
      label: "View Contract",
      href: getExplorerLink(
        1,
        "0x740019a6b3a9cf3bd193986a560b05726143b217",
        ExplorerDataType.ADDRESS
      ),
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
      "Failure to pay the principal or premium on time will result in full liquidation up to the liability amount. Note: The AMM pool will still operate as normal after the lent liquidity is removed.",
    logomarkClassName: "fill-fuchsia-500/40",
  },
  {
    id: "X7ILL003",
    name: "Interest Only Loan",
    description:
      "Loan Retention Premium: 6.25% in premiums due by the end of each quarter of the loan term",
    secondaryButton: {
      label: "View Contract",
      href: getExplorerLink(
        1,
        "0x74001c747b6cc9091ee63bc9424dff633fbac617",
        ExplorerDataType.ADDRESS
      ),
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
      "Failure to pay the principal or premium on time will result in full liquidation up to the liability amount. Note: The AMM pool will still operate as normal after the lent liquidity is removed.",
    logomarkClassName: "fill-orange-500/40",
  },
]

interface LoanViewType {
  id: string
  name: string
  liquidation: string
  description: string
  secondaryButton: {
    label: string
    href: string
  }
  features: [string, string][]
  logomarkClassName: string
}
function LoanHeader({
  id,
  logomarkClassName,
}: Pick<LoanViewType, "id" | "logomarkClassName">) {
  return (
    <h3 className={cn("flex items-center text-sm font-semibold text-zinc-900")}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-violet-400">
        <X7Logo
          className={cn(
            "h-5 w-5 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:stroke-zinc-400 dark:group-hover:fill-violet-300/10 dark:group-hover:stroke-violet-400",
            logomarkClassName
          )}
        />
      </div>
      <span className="ml-4 leading-7 text-zinc-500">{id}</span>
    </h3>
  )
}

function LoanFeatures({ features }: Pick<LoanViewType, "features">) {
  return (
    <ul
      className={cn(
        "-my-2 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300"
      )}
    >
      {features.map((feature: string[]) => (
        <li key={feature[0]?.toString()} className="flex w-full py-2">
          <CheckCircleIcon
            className={cn("h-6 w-6 flex-none text-violet-400")}
          />
          <span className="text-muted-foreground ml-4">{feature[0]}</span>
          <span className="ml-auto">{feature[1]}</span>
        </li>
      ))}
    </ul>
  )
}

function Loan({
  id,
  name,
  liquidation,
  description,
  secondaryButton,
  features,
  logomarkClassName,
}: LoanViewType) {
  return (
    <section className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 p-6 shadow-lg ring-1 ring-zinc-900/7.5 transition-shadow ring-inset group-hover:ring-zinc-900/10 hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:ring-white/10 dark:group-hover:ring-white/20 dark:hover:shadow-black/5">
      <LoanHeader id={id} logomarkClassName={logomarkClassName} />
      <p
        className={cn(
          "relative mt-5 flex text-2xl tracking-tight text-zinc-900 dark:text-zinc-100"
        )}
      >
        {name}
      </p>
      <p className={cn("text-secondary-foreground min-h-[75px] text-sm")}>
        {description}
      </p>
      <div className="order-last mt-6">
        <LoanFeatures features={features} />
        <div className="mt-4 flex flex-col items-center text-sm">
          <div className="text-violet-400 dark:text-violet-500">
            Liquidation Conditions
          </div>
          <div className="text-center text-zinc-500 dark:text-zinc-400">
            {liquidation}
          </div>
        </div>
      </div>
      <LinkInternal
        prefetch={true}
        target="_blank"
        href={"/lending"}
        className={cn(buttonVariants({ variant: "default" }), "mt-6")}
        aria-label={`View Contract for ${name} loan`}
      >
        Initiate Loan
      </LinkInternal>
      <LinkInternal
        prefetch={true}
        href={secondaryButton.href}
        className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
        aria-label={`Get started with the ${name} loan`}
      >
        {secondaryButton.label}
      </LinkInternal>
    </section>
  )
}
