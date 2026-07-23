import type { Metadata } from "next"

import { LinkExternal, LinkInternal } from "@x7/ui/link"
import { SocialsEnum } from "@x7/utils"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"
import { DocsLinks, XchangeLinks } from "~/types/links"

const metadata = {
  title: "X7 Finance: Open Source DeFi Infrastructure",
  description:
    "X7 Finance: Building open-source decentralized financial infrastructure with trustless smart contracts, AMM DEX, and innovative Liquidity Loans.",
  slug: "/about",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section - More text-based, focused on open source */}
      <section className="border-b border-zinc-200 py-16 md:py-24 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center space-x-2">
              <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                X7 Finance
              </span>
              <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700"></div>
            </div>

            <h1 className="mb-6 font-mono text-3xl font-bold tracking-tight md:text-5xl">
              Open Source DeFi Infrastructure for the Decentralized Future
            </h1>

            <div className="mt-4 mb-8 font-mono text-sm text-zinc-500">
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                trust code, not institutions
              </code>
            </div>

            <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
              X7 Finance develops decentralized financial infrastructure
              designed to operate without intermediaries, censorship, or
              centralized control. Our ethos is rooted in developing
              open-source, transparent code that enables permissionless access
              to capital for everyone.
            </p>

            <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400">
              We believe in building public goods that strengthen decentralized
              networks and empower individuals through minimalist, efficient,
              and battle-tested code.
            </p>

            <div className="flex flex-wrap gap-4 font-mono">
              <LinkInternal
                href={DocsLinks.Index}
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-transparent px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Documentation →
              </LinkInternal>
              <LinkExternal
                href="https://github.com/x7finance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-transparent px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                GitHub →
              </LinkExternal>
            </div>
          </div>
        </div>
      </section>

      {/* Current Products - More text-based */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center space-x-2">
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                Current Infrastructure
              </span>
            </div>

            <h2 className="mb-8 font-mono text-2xl font-bold md:text-3xl">
              Production-Ready DeFi Components
            </h2>

            {/* Xchange */}
            <div className="mb-16 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
              <h3 className="mb-4 font-mono text-xl font-bold">Xchange DEX</h3>
              <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                A high-performance, privacy-focused AMM DEX built on
                EVM-compatible chains. Xchange provides trustless trading with
                optimal routing across deep liquidity pools while prioritizing
                user privacy and security.
              </p>
              <pre
                tabIndex={0}
                className="mb-6 overflow-x-auto rounded-md bg-zinc-100 p-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-zinc-800/50 dark:text-zinc-300"
              >
                <code>{`// Key features
const XchangeFeatures = {
  highLiquidity: "Deep pools for minimal slippage",
  privacyFocused: "No tracking or data storage",
  trustless: "Fully on-chain execution",
  routing: "Intelligent cross-DEX routing"
};`}</code>
              </pre>
              <LinkInternal
                prefetch={true}
                href="/swap"
                className="inline-flex h-8 items-center justify-center font-mono text-sm text-zinc-900 hover:underline dark:text-zinc-100"
              >
                Trade on Xchange →
              </LinkInternal>
            </div>

            {/* Liquidity Loans */}
            <div className="border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
              <h3 className="mb-4 font-mono text-xl font-bold">
                Innovative Leveraged Liquidity Loans (ILL)
              </h3>
              <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                ILL is our permissionless under-collateralized loan protocol
                that provides initial seed capital to DeFi projects. This solves
                the bootstrap problem for new tokens by enabling founders to
                launch with substantial liquidity while preserving their startup
                capital.
              </p>
              <pre
                tabIndex={0}
                className="mb-6 overflow-x-auto rounded-md bg-zinc-100 p-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-zinc-800/50 dark:text-zinc-300"
              >
                <code>{`// Contract interface
interface ILeveragedLoan {
  function initiateLoan(
    uint256 collateralAmount,
    uint256 leverageFactor,
    address tokenAddress
  ) external returns (uint256 loanId);
  
  function repayLoan(uint256 loanId) external;
  function extendLoan(uint256 loanId, uint256 additionalTime) external;
}`}</code>
              </pre>
              <LinkInternal
                prefetch={true}
                href={`${XchangeLinks.Lending}?tab=initiate-loan`}
                className="inline-flex h-8 items-center justify-center font-mono text-sm text-zinc-900 hover:underline dark:text-zinc-100"
              >
                Launch Your Project →
              </LinkInternal>
            </div>
          </div>
        </div>
      </section>

      {/* Future Products - More technical, with TBD emphasis */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 md:py-20 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center space-x-2">
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                Development Roadmap
              </span>
            </div>

            <h2 className="mb-6 font-mono text-2xl font-bold md:text-3xl">
              Future Protocol Components
            </h2>

            <p className="mb-10 text-zinc-600 dark:text-zinc-400">
              The following infrastructure components are currently in research
              and development phases. Our engineers are working on solving
              complex technical challenges to bring these components to
              production.
            </p>

            <pre
              tabIndex={0}
              className="mb-10 overflow-x-auto rounded-md bg-zinc-100 p-4 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-zinc-800/50 dark:text-zinc-300"
            >
              <code>{`// Development status
const roadmapStatus = {
  PLANNING: "Early research and requirements gathering",
  PROTOTYPE: "Proof of concept implementation",
  DEVELOPMENT: "Active development and testing",
  REVIEW: "Security audits and peer review",
  DEPLOYMENT: "Production release preparation"
};`}</code>
            </pre>

            <div className="space-y-10">
              {/* Future Product 1 - Universal Liquidity Loans */}
              <div className="border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
                <div className="mb-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 font-mono text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                  PROTOTYPE
                </div>
                <h3 className="mb-2 font-mono text-lg font-bold">
                  Liquidity Loans on Any DEX
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  An extension of our liquidity loan protocol that enables
                  developers to launch projects on any chain and any protocol,
                  starting with Uniswap. This solution allows founders to
                  utilize the X7 liquidity pool as a capital source for
                  bootstrapping their projects regardless of their preferred DEX
                  or blockchain.
                </p>
                <pre
                  tabIndex={0}
                  className="mt-4 mb-4 overflow-x-auto rounded-md bg-zinc-100 p-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-zinc-800/50 dark:text-zinc-300"
                >
                  <code>{`// Cross-DEX adapter example
interface ICrossDexAdapter {
  function initiateLoanOnDex(
    uint256 collateralAmount,
    uint256 leverageFactor,
    address tokenAddress,
    address dexRouter,
    uint256 chainId
  ) external returns (uint256 loanId);
}`}</code>
                </pre>
              </div>

              {/* Future Product 2 - BASE Chain DAO */}
              <div className="border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
                <div className="mb-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 font-mono text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                  PLANNING
                </div>
                <h3 className="mb-2 font-mono text-lg font-bold">
                  Decentralized DAO Template for BASE Chain
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  A groundbreaking DAO structure specifically optimized for BASE
                  chain that enhances decentralization through a novel
                  multi-tiered governance approach. This template implements a
                  combination of liquid democracy and conviction voting
                  mechanisms while leveraging BASE's low transaction costs to
                  enable more frequent and granular governance actions.
                </p>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  The system includes specialized delegation mechanisms,
                  optimistic governance patterns, and on-chain reputation
                  systems that make DAOs more resistant to capture while
                  remaining efficient in decision-making.
                </p>
              </div>

              {/* Future Product 3 - Open Invitation */}
              <div className="border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
                <div className="mb-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 font-mono text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                  PLANNING
                </div>
                <h3 className="mb-2 font-mono text-lg font-bold">
                  Community-Driven Protocol Extensions
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We believe the most innovative ideas come from the community.
                  X7 DAO is actively seeking passionate developers to propose
                  and build the next generation of DeFi primitives that
                  integrate with our ecosystem. If you have an idea for a novel
                  financial instrument, a security enhancement, or a completely
                  new protocol that aligns with our mission of permissionless
                  capital access, we want to hear from you.
                </p>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Current areas of interest include zero-knowledge applications,
                  oracle-free price discovery mechanisms, and cross-chain
                  composability solutions, but we're open to all proposals that
                  advance decentralized finance.
                </p>
                <div className="mt-4">
                  <LinkExternal
                    href={SocialsEnum.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center justify-center font-mono text-sm text-zinc-900 hover:underline dark:text-zinc-100"
                  >
                    Join our DAO to discuss your idea →
                  </LinkExternal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute Section - New section for developers */}
      <section className="border-t border-b border-zinc-200 py-16 md:py-20 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center space-x-2">
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                Open Source
              </span>
            </div>

            <h2 className="mb-6 font-mono text-2xl font-bold md:text-3xl">
              Contribute to X7 Finance
            </h2>

            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              We're building a community of developers passionate about
              open-source DeFi infrastructure. Whether you're a smart contract
              developer, frontend engineer, or security researcher, there are
              many ways to contribute to the X7 ecosystem.
            </p>

            <div className="mb-8 rounded-md border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="mb-4 font-mono text-lg font-bold">
                X7 DAO Developer Grants
              </h3>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                X7 DAO provides grants to developers building open-source tools
                and infrastructure that align with our mission of permissionless
                capital access. Grants are funded by the DAO treasury and
                awarded based on community governance.
              </p>
              <ul className="mb-6 list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>Smart contract development and audits</li>
                <li>Frontend applications and tools</li>
                <li>Documentation and educational resources</li>
                <li>Analytics and data visualization</li>
                <li>Testing and continuous integration</li>
              </ul>
              <LinkExternal
                href={SocialsEnum.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-zinc-100 px-6 font-mono text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Contact DAO Members on Telegram →
              </LinkExternal>
            </div>

            <pre
              tabIndex={0}
              className="mb-6 overflow-x-auto rounded-md bg-zinc-100 p-4 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-zinc-800/50 dark:text-zinc-300"
            >
              <code>{`// How to contribute
const contributionPath = {
  1: "Fork the repository",
  2: "Create a feature branch",
  3: "Implement your changes",
  4: "Write tests",
  5: "Submit a pull request",
  6: "Engage in code review",
  7: "Merge and deploy"
};`}</code>
            </pre>

            <LinkExternal
              href="https://github.com/x7finance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center justify-center font-mono text-sm text-zinc-900 hover:underline dark:text-zinc-100"
            >
              View our GitHub repositories →
            </LinkExternal>
          </div>
        </div>
      </section>

      {/* About X7 DAO - More technical */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center space-x-2">
              <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className="font-mono text-xs tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
                Governance
              </span>
            </div>

            <h2 className="mb-6 font-mono text-2xl font-bold md:text-3xl">
              X7 DAO
            </h2>

            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              X7 DAO is responsible for engineering and deploying the X7 Finance
              protocol stack. Our mission is to be a DAO focused on elite,
              open-source, decentralized technologies utilizing blockchains.
              While we may consider centralized technologies in support of our
              mission, our primary goal is to make permissionless access to
              capital available for all humans and machines.
            </p>

            <pre
              tabIndex={0}
              className="mb-10 overflow-x-auto rounded-md bg-zinc-100 p-4 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-zinc-800/50 dark:text-zinc-300"
            >
              <code>{`// DAO governance structure
const governanceStructure = {
  token: "X7DAO",
  votingMechanism: "On-chain proposals",
  quorum: "Min 3% of total supply participation",
  executionDelay: "48 hours after passing",
  keyDomains: [
    "Protocol parameters",
    "Treasury management",
    "Technology roadmap",
    "Grant distribution"
  ]
};`}</code>
            </pre>

            <div className="flex flex-wrap gap-4">
              <LinkInternal
                prefetch={true}
                href={XchangeLinks.Vote}
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-zinc-100 px-6 font-mono text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Join X7 DAO
              </LinkInternal>
              <LinkInternal
                prefetch={true}
                href="/docs/whitepaper/tokenomics"
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-transparent px-6 font-mono text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Read Tokenomics Docs
              </LinkInternal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
