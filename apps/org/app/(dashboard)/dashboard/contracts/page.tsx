import { BlockchainType, ContractsEnum } from "common"
import { generateChainIdentifier } from "utils"
import { ChainsArray } from "icons"

import { Metadata } from "next"
import Link from "next/link"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { TokenLinksEnum } from "@/lib/types/links"
import { Dropdown } from "@/components/dropdown/contracts"
import { Table } from "@/components/table"
import { ContractCopy } from "@/components/ui-client/contractCopy"
import { DashboardContainer } from "@/app/(dashboard)/components/dashboard-container"
import { DashboardSubheader } from "@/app/(dashboard)/components/dashboard-subheader"
import { DashboardTitle } from "@/app/(dashboard)/components/dashboard-title"

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
          <div className="-mx-4 mt-10 md:mx-2">
            <Table
              data={tokens}
              columns={[
                {
                  header: "Token",
                  accessor: "token",
                  responsive: false,
                  width: "100",
                  cellRenderer: (t) => (
                    <>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 w-full">
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
                        <div className="inline-block float-right lg:hidden">
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
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {t.description}
                        </span>
                        <span className="flex">
                          <ContractCopy
                            name={"Contract"}
                            contract={t.contract}
                          />
                        </span>
                      </div>
                    </>
                  ),
                },

                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Chart",
                  accessor: "chart",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
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
                    </>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </>
                  ),
                },
                {
                  header: "Trade",
                  accessor: "trade",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <div className="float-right pr-4">
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
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="utility"
              title="Utility Tokens"
              description="Tokens which are utilized to fund and borrow liquidity within the X7 ecosystem"
            />
            <Table
              data={utilityTokens}
              columns={[
                {
                  header: "Token",
                  accessor: "token",
                  responsive: false,
                  width: "100",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        {t.name}
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="xchange"
                            contract={t.contract}
                            label={"Mint X7D"}
                            name={
                              <span className="whitespace-nowrap">
                                Mint X7D
                              </span>
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </>
                  ),
                },
                {
                  header: "",
                  accessor: "trade",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <div className="flex justify-center w-full">
                        <Dropdown
                          type="xchange"
                          contract={t.contract}
                          label={"Mint X7D"}
                          name={
                            <span className="whitespace-nowrap">Mint X7D</span>
                          }
                        />
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="liquidity"
              title="Liquidity Hubs"
              description="Manages liquidity for a token within the X7 Finance ecosystem"
            />
            <Table
              data={liquidityHubs}
              columns={[
                {
                  header: "Hub",
                  accessor: "token",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        <span>{t.name}</span>
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="discount"
              title="Discount Authorities"
              description="Ensures discounts provided by X7 Utility NFT's are valid and applied appropriately."
            />
            <Table
              data={discountAuthorities}
              columns={[
                {
                  header: "Authorities",
                  accessor: "token",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        <span>{t.name}</span>
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="splitter"
              title="Ecosystem Splitters"
              description="Moves a portion of the fees to different smart contracts within the X7 Ecosystem"
            />
            <Table
              data={splitters}
              columns={[
                {
                  header: "Hub",
                  accessor: "token",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        <span>{t.name}</span>
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="xchange"
              title="Xchange Smart Contracts"
              description="Key contracts that allow tokens to be traded on Xchange"
            />
            <Table
              data={xchange}
              columns={[
                {
                  header: "Hub",
                  accessor: "token",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        <span>{t.name}</span>
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="misc"
              title="Miscellaneous Smart Contracts"
            />
            <Table
              data={misc}
              columns={[
                {
                  header: "Hub",
                  accessor: "token",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        <span>{t.name}</span>
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="intliq"
              title="Initial Liquiidty Time Lock Contracts"
              description="Responsbile for handling token liquidity prior to token launch"
            />
            <Table
              data={intliq}
              columns={[
                {
                  header: "Hub",
                  accessor: "token",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="font-medium flex text-zinc-900 dark:text-zinc-100 relative">
                        <span>{t.name}</span>
                        <div className="inline-block ml-auto lg:hidden">
                          <Dropdown
                            type="scan"
                            contract={t.contract}
                            label={
                              "Scan this contract on the blockchain scanner"
                            }
                            name={"Scan"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
                        <span>{t.description}</span>
                        <ContractCopy contract={t.contract} />
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Description",
                  accessor: "description",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      <span>{t.description}</span>
                      <ContractCopy contract={t.contract} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <Dropdown
                        type="scan"
                        contract={t.contract}
                        label={"Scan this contract on the blockchain scanner"}
                        name={"Scan"}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </DashboardContainer>
      </div>
    </>
  )
}
