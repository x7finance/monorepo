import { BlockchainType, ContractsEnum } from "common"
import { cn, generateChainIdentifier } from "utils"
import { ChainsArray } from "icons"

import { Metadata } from "next"
import Link from "next/link"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { TokenLinksEnum } from "@/lib/types/links"
import { Dropdown } from "@/components/dropdown/contracts"
import { DashboardContainer } from "@/app/(dashboard)/components/dashboard-container"
import { DashboardSubheader } from "@/app/(dashboard)/components/dashboard-subheader"
import { DashboardTitle } from "@/app/(dashboard)/components/dashboard-title"

import { ContractCopy } from "./components/contractCopy"

const intliq = [
  {
    name: "X7R Initital Liquidity Time Lock",
    contract: ContractsEnum.X7RInitialLiquidityTimeLock,
    description: "Time lock contract for initial liquidity for X7R Tokens.",
  },
  {
    name: "X7DAO Initital Liquidity Time Lock",
    contract: ContractsEnum.X7DAOInitialLiquidityTimeLock,
    description: "Time lock contract for initial liquidity for X7DAO Tokens.",
  },
  {
    name: "X7100 Initital Liquidity Time Lock",
    contract: ContractsEnum.X7100InitialLiquidityTimeLock,
    description: "Time lock contract for initial liquidity for X7100 Tokens.",
  },
]

const tokens = [
  {
    name: "X7R",
    contract: ContractsEnum.X7R,
    description: "A deflationary reward token",
  },
  {
    name: "X7DAO",
    contract: ContractsEnum.X7DAO,
    description: "Governance token utilized to govern the X7 ecosystem",
  },
  {
    name: "X7101",
    contract: ContractsEnum.X7101,
    description: "First of the price consistent constellation tokens",
  },
  {
    name: "X7102",
    contract: ContractsEnum.X7102,
    description: "Second of the price consistent constellation tokens",
  },
  {
    name: "X7103",
    contract: ContractsEnum.X7103,
    description: "Third of the price consistent constellation tokens",
  },
  {
    name: "X7104",
    contract: ContractsEnum.X7104,
    description: "Fourth of the price consistent constellation tokens",
  },
  {
    name: "X7105",
    contract: ContractsEnum.X7105,
    description: "Fifth of the price consistent constellation tokens",
  },
]

const utilityTokens = [
  {
    name: "X7D",
    contract: ContractsEnum.X7D,
    description: `When adding funds to the lending pool, X7D is minted - it's value is pegged 1:1 to the native chain currency`,
  },
]

const liquidityHubs = [
  {
    name: "X7R Liquidity Hub",
    contract: ContractsEnum.X7R_LiquidityHub,
    description: "Liquidity hub for X7R - reward token",
  },
  {
    name: "X7DAO Liquidity Hub",
    contract: ContractsEnum.X7DAO_LiquidityHub,
    description: "Liquidity hub for X7DAO - governance token",
  },
  {
    name: "X7100 Liquidity Hub",
    contract: ContractsEnum.X7100_LiquidityHub,
    description: "Liquidity hub for X7100 - constellation tokens",
  },
]

const discountAuthorities = [
  {
    name: "X7R Discount Authority",
    contract: ContractsEnum.X7R_DiscountAuthority,
    description: `Smart contract for X7R fee discounts - granted via X7 utility NFT's`,
  },
  {
    name: "X7DAO Discount Authority",
    contract: ContractsEnum.X7DAO_DiscountAuthority,
    description: "Smart contract for X7DAO fee discounts",
  },
  {
    name: "X7100 Discount Authority",
    contract: ContractsEnum.X7100_DiscountAuthority,
    description: "Smart contract for X7100 series token fee discounts",
  },
]

const splitters = [
  {
    name: "Ecosystem Splitter",
    contract: ContractsEnum.EcosystemSplitter,
    description:
      "Smart contract for balancing revenue across all revenue streams in the X7 ecosystem",
  },
  {
    name: "Treasury Splitter",
    contract: ContractsEnum.TreasurySplitter,
    description: "Smart contract responsible for managing the treasury",
  },
]

const misc = [
  {
    name: "Lending Pool",
    contract: ContractsEnum.X7_LendingPool,
    description:
      "The lending pool where Initial Liquidity Loans funds are provided from",
  },
  {
    name: "Token Burner",
    contract: ContractsEnum.X7100_TokenBurner,
    description: "Smart contract for burning tokens",
  },
  {
    name: "Token Time Lock",
    contract: ContractsEnum.TokenTimeLock,
    description: "ERC-20 Token Time Lock",
  },
]

const xchange = [
  {
    name: "Xchange Factory",
    contract: ContractsEnum.XchangeFactory,
    description:
      "The secret sauce - this contract has yet to be verified to maintain competitive advantage",
  },
  {
    name: "Xchange Router",
    contract: ContractsEnum.XchangeRouter,
    description:
      "Uniswap v2 Fork - this contract includes functionality to remove liquidity in a failsafe manner to permit liquidation of fee liquidity in all cases.",
  },
  {
    name: "Xchange Discount Authority",
    contract: ContractsEnum.XchangeDiscountAuthority,
    description: "Smart Contract for Xchange fee discounts",
  },
  {
    name: "Lending Discount Authority",
    contract: ContractsEnum.LendingDiscountAuthority,
    description: "Smart Contract for calculating lending discounts",
  },
  {
    name: "Lending Pool Reserve",
    contract: ContractsEnum.LendingPoolReserve,
    description:
      "Smart Contract for minting and redeeming X7D and funding the Lending Pool with ETH.",
  },
]

const metadata = {
  title: "Contracts",
  description:
    "Dive into X7 Finance's Smart Contracts Showcase: A comprehensive platform featuring all of X7's innovative DeFi smart contracts. Explore our Automated Market Making (AMM) contracts, lending pool contracts, initial liquidity loan contracts, and more. Understand the mechanics behind our DeFi solutions and how they contribute to a seamless, trustless, and efficient financial ecosystem. Discover the power of decentralized finance with X7 Finance's Smart Contracts Showcase.",
  slug: "/dashboard/contracts",
  section: "dashboard",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function ContractsPage() {
  return (
    <>
      <div className="xl:max-w-none">
        <DashboardTitle
          title="X7 Finance Token Contracts"
          secondaryButton={{
            text: "Tokens Overview",
            href: TokenLinksEnum.Index,
          }}
        />
        <DashboardContainer>
          <>
            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Token
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Chart
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Scan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                          <div className="relative inline-block ml-2 top-1 lg:hidden">
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-shrink-0 space-x-1">
                                {ChainsArray.map((c, id) => (
                                  <Link
                                    href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                                      c?.id
                                    )}/pair-explorer/${t.contract}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={`${t.contract}-${id}-chart`}
                                    className="opacity-80 hover:opacity-100"
                                  >
                                    <span>{c.icon}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-shrink-0 space-x-1">
                            {ChainsArray.map((c, id) => (
                              <Link
                                href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                                  c?.id as BlockchainType
                                )}/pair-explorer/${t.contract}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={`${t.contract}-${id}-chart`}
                                className="opacity-80 hover:opacity-100"
                              >
                                <span>{c.icon}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </td>

                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <Dropdown
                          type="scan"
                          contract={t.contract}
                          label={"Scan this contract on the blockchain scanner"}
                          name={"Scan"}
                        />
                      </td>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="xchange"
                            contract={t.contract}
                            label={"Trade this token on Xchange"}
                            name={
                              <span className="whitespace-nowrap">
                                <span>Trade</span>
                                <span className="hidden xl:ml-1 xl:inline-block">
                                  on Xchange
                                </span>
                              </span>
                            }
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

          <>
            <DashboardSubheader
              id="utility"
              title="Utility Tokens"
              description="Tokens which are utilized to fund and borrow liquidity within the X7 ecosystem"
            />

            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Hub
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {utilityTokens.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

          <>
            <DashboardSubheader
              id="liquidity"
              title="Liquidity Hubs"
              description="Manages liquidity for a token within the X7 Finance ecosystem"
            />
            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Hub
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {liquidityHubs.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

          <>
            <DashboardSubheader
              id="discount"
              title="Discount Authorities"
              description="Ensures discounts provided by X7 Utility NFT's are valid and applied appropriately."
            />
            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Authority
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {discountAuthorities.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

          <>
            <DashboardSubheader
              id="splitter"
              title="Ecosystem Splitters"
              description="Moves a portion of the fees to different smart contracts within the X7 Ecosystem"
            />
            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Splitter
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {splitters.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

          <>
            <DashboardSubheader
              id="xchange"
              title="Xchange Smart Contracts"
              description="Key contracts that allow tokens to be traded on Xchange"
            />
            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Contract
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {xchange.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

          <>
            <DashboardSubheader
              id="misc"
              title="Miscellaneous Smart Contracts"
            />
            <div className="-mx-4 mt-10 ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Contract
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {misc.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-6 right-0 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
          <>
            <DashboardSubheader
              id="intliq"
              title="Initial Liquiidty Time Lock Contracts"
              description="Responsbile for handling token liquidity prior to token launch"
            />
            <div className="-mx-4 mt-10  ring-1 ring-zinc-900/7.5 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-900/7.5 dark:divide-white/10">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Contract
                    </th>

                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Description
                    </th>

                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-6">
                      Scan
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {intliq.map((t, idx) => (
                    <tr key={t.contract}>
                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </div>
                        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                          <span>{t.description}</span>
                          <ContractCopy contract={t.contract} />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute right-0 left-6 -top-px h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          idx === 0
                            ? ""
                            : "border-t border-zinc-900/7.5 dark:border-white/10",
                          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
                        )}
                      >
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </td>

                      <td
                        className={cn(
                          idx === 0 ? "" : "border-t border-transparent",
                          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        )}
                      >
                        <div className="flex justify-center w-full">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                        {idx !== 0 ? (
                          <div className="absolute left-0 right-6 -top-px h-px bg-zinc-900/7.5 dark:bg-white/10" />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        </DashboardContainer>
      </div>
    </>
  )
}
