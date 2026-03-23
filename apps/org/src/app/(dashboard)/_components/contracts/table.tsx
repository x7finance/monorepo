/* oxlint-disable @typescript-eslint/no-unsafe-assignment */

import { cn } from "@x7/css"
import { X7ContractsEnum } from "@x7/sdk"
import { buttonVariants } from "@x7/ui/button"
import { ContractCopy } from "@x7/ui/contract-copy"
import { LinkExternal, LinkInternal } from "@x7/ui/link"
import { StaticTable } from "@x7/ui/static-table"
import type { ChainId } from "@x7/utils"
import { generateChainIdentifier } from "@x7/utils"
import { ChainsArray } from "~/lib/components/utils/contracts-dropdown"

import { DashboardContainer } from "../../_components/dashboard-container"
import { DashboardSubheader } from "../../_components/dashboard-subheader"

import { Configuration } from "./configuration"

interface ContractsTableProps {
  chainId: ChainId
}

const getScannerLink = (chainId: ChainId): string | undefined => {
  const chain = ChainsArray.find((c) => c.id === chainId)
  return chain ? chain.scannerLink : undefined
}

export function ContractsTable({ chainId }: ContractsTableProps) {
  return (
    <>
      <div className="xl:max-w-none">
        <DashboardContainer>
          <div className="-mx-4 mt-10 md:mx-2">
            <StaticTable
              data={tokens(chainId)}
              columns={[
                {
                  header: "Token",
                  accessor: "token",
                  responsive: false,
                  width: "100",
                  cellRenderer: (t) => (
                    <>
                      <div className="w-full font-medium text-zinc-900 dark:text-zinc-100">
                        {t.name}
                        <div className="relative top-1 ml-2 inline-block lg:hidden">
                          <div className="flex items-center space-x-2">
                            <div className="flex shrink-0 space-x-1">
                              <LinkExternal
                                href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                                  chainId
                                )}/pair-explorer/${t.contract}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-80 hover:opacity-100"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="float-right inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/swap?token0=NATIVE&token1=${t.contract}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "default",
                                size: "xs",
                              })
                            )}
                          >
                            Trade
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {t.description}
                        </span>
                        <span className="flex">
                          <ContractCopy
                            contract={t.contract}
                            chainId={chainId}
                          />
                          <Configuration
                            contract={t.contract}
                            chainId={chainId}
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
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
                        <div className="flex shrink-0 space-x-1">
                          <LinkExternal
                            href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                              chainId
                            )}/pair-explorer/${t.contract}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Chart
                          </LinkExternal>
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
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/token/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
                  ),
                },
                {
                  header: "Trade",
                  accessor: "trade",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <div className="float-right">
                        <LinkInternal
                          prefetch={true}
                          href={`/swap?token0=NATIVE&token1=${t.contract}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({
                              variant: "default",
                              size: "xs",
                            })
                          )}
                        >
                          Trade
                        </LinkInternal>
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
            <StaticTable
              data={utilityTokens(chainId)}
              columns={[
                {
                  header: "Token",
                  accessor: "token",
                  responsive: false,
                  width: "100",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        {t.name}
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/docs/breakdowns/contracts/${t.breakdown}`}
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Learn More
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
                  ),
                },
                {
                  header: "Action",
                  accessor: "trade",
                  responsive: true,
                  cellRenderer: (t) => (
                    <>
                      <div className="flex w-full justify-center">
                        <LinkInternal
                          prefetch={true}
                          href={`/swap?token0=NATIVE&token1=${t.contract}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({
                              variant: "default",
                              size: "xs",
                            })
                          )}
                        >
                          Mint
                        </LinkInternal>
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
            <StaticTable
              data={liquidityHubs(chainId)}
              columns={[
                {
                  header: "Hub",
                  accessor: "hub",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        <span>{t.name}</span>
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/docs/breakdowns/contracts/${t.breakdown}`}
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Learn More
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </div>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
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
            <StaticTable
              data={discountAuthorities(chainId)}
              columns={[
                {
                  header: "Authorities",
                  accessor: "authorities",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        <span>{t.name}</span>
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/docs/breakdowns/contracts/${t.breakdown}`}
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Learn More
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </div>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
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
            <StaticTable
              data={splitters(chainId)}
              columns={[
                {
                  header: "Splitter",
                  accessor: "splitter",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        <span>{t.name}</span>
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/docs/breakdowns/contracts/${t.breakdown}`}
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Learn More
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </div>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
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
            <StaticTable
              data={xchange(chainId)}
              columns={[
                {
                  header: "Contract",
                  accessor: "contract",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        <span>{t.name}</span>
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkExternal
                            href={`${getScannerLink(chainId)}/${t.contract}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className={cn(
                              buttonVariants({
                                variant: "default",
                                size: "xs",
                              })
                            )}
                          >
                            Scan
                          </LinkExternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </div>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
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
            <StaticTable
              data={misc(chainId)}
              columns={[
                {
                  header: "Contract",
                  accessor: "contract",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        <span>{t.name}</span>
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/docs/breakdowns/contracts/${t.breakdown}`}
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Learn More
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
                    </div>
                  ),
                },
                {
                  header: "Docs",
                  accessor: "docs",
                  responsive: true,
                  cellRenderer: (t) => (
                    <LinkInternal
                      prefetch={true}
                      href={`/docs/breakdowns/contracts/${t.breakdown}`}
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "xs",
                        })
                      )}
                    >
                      Learn more
                    </LinkInternal>
                  ),
                },
              ]}
            />
          </div>
          <div className="-mx-4 mt-10 md:mx-2">
            <DashboardSubheader
              id="nft"
              title="X7 NFTs"
              description="utility NFTs that provide discount"
            />
            <StaticTable
              data={nft(chainId)}
              columns={[
                {
                  header: "Contract",
                  accessor: "contract",
                  responsive: false,
                  width: "300",
                  cellRenderer: (t) => (
                    <div>
                      <div className="relative flex font-medium text-zinc-900 dark:text-zinc-100">
                        <span>{t.name}</span>
                        <div className="ml-auto inline-block lg:hidden">
                          <LinkInternal
                            prefetch={true}
                            href={`/docs/breakdowns/contracts/${t.breakdown}`}
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "xs",
                              })
                            )}
                          >
                            Learn More
                          </LinkInternal>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {t.description}
                        </span>
                        <ContractCopy contract={t.contract} chainId={chainId} />
                        <Configuration
                          contract={t.contract}
                          chainId={chainId}
                        />
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
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {t.description}
                      </span>
                      <ContractCopy contract={t.contract} chainId={chainId} />
                      <Configuration contract={t.contract} chainId={chainId} />
                    </div>
                  ),
                },
                {
                  header: "Scan",
                  accessor: "scan",
                  responsive: true,
                  cellRenderer: (t) => (
                    <div className="float-right pr-4">
                      <LinkExternal
                        href={`${getScannerLink(chainId)}/address/${t.contract}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "xs",
                          })
                        )}
                      >
                        Scan
                      </LinkExternal>
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

function tokens(chainId: ChainId) {
  return [
    {
      name: "X7R",
      contract: X7ContractsEnum.X7R(chainId),
      description: "A deflationary reward token",
      breakdown: "x7r",
    },
    {
      name: "X7DAO",
      contract: X7ContractsEnum.X7DAO(chainId),
      description: "Governance token utilized to govern the X7 ecosystem",
      breakdown: "x7daotokencontract",
    },
    {
      name: "X7101",
      contract: X7ContractsEnum.X7101(chainId),
      description: "First of the price consistent constellation tokens",
      breakdown: "x7100tokencontract",
    },
    {
      name: "X7102",
      contract: X7ContractsEnum.X7102(chainId),
      description: "Second of the price consistent constellation tokens",
      breakdown: "x7100tokencontract",
    },
    {
      name: "X7103",
      contract: X7ContractsEnum.X7103(chainId),
      description: "Third of the price consistent constellation tokens",
      breakdown: "x7100tokencontract",
    },
    {
      name: "X7104",
      contract: X7ContractsEnum.X7104(chainId),
      description: "Fourth of the price consistent constellation tokens",
      breakdown: "x7100tokencontract",
    },
    {
      name: "X7105",
      contract: X7ContractsEnum.X7105(chainId),
      description: "Fifth of the price consistent constellation tokens",
      breakdown: "x7100tokencontract",
    },
  ]
}

function utilityTokens(chainId: ChainId) {
  return [
    {
      name: "X7D",
      contract: X7ContractsEnum.X7D(chainId),
      description: `When adding funds to the lending pool, X7D is minted - it's value is pegged 1:1 to the native chain currency`,
      breakdown: "x7d",
    },
  ]
}

function liquidityHubs(chainId: ChainId) {
  return [
    {
      name: "X7R Liquidity Hub",
      contract: X7ContractsEnum.X7R_LiquidityHub(chainId),
      description: "Liquidity hub for X7R - reward token",
      breakdown: "x7rliquidityhub",
    },
    {
      name: "X7DAO Liquidity Hub",
      contract: X7ContractsEnum.X7DAO_LiquidityHub(chainId),
      description: "Liquidity hub for X7DAO - governance token",
      breakdown: "x7daoliquidityhub",
    },
    {
      name: "X7100 Liquidity Hub",
      contract: X7ContractsEnum.X7100_LiquidityHub(chainId),
      description: "Liquidity hub for X7100 - constellation tokens",
      breakdown: "x7100liquidityhub",
    },
  ]
}

function discountAuthorities(chainId: ChainId) {
  return [
    {
      name: "X7R Discount Authority",
      contract: X7ContractsEnum.X7R_DiscountAuthority(chainId),
      description: `Smart contract for X7R fee discounts - granted via X7 utility NFT's`,
      breakdown: "x7rdiscountauthority",
    },
    {
      name: "X7DAO Discount Authority",
      contract: X7ContractsEnum.X7DAO_DiscountAuthority(chainId),
      description: "Smart contract for X7DAO fee discounts",
      breakdown: "x7daodiscountauthority",
    },
    {
      name: "X7100 Discount Authority",
      contract: X7ContractsEnum.X7100_DiscountAuthority(chainId),
      description: "Smart contract for X7100 series token fee discounts",
      breakdown: "x7100discountauthority",
    },
    {
      name: "Xchange Discount Authority",
      contract: X7ContractsEnum.XchangeDiscountAuthority(chainId),
      description: "Smart Contract for Xchange fee discounts",
      breakdown: "xchangediscountauthority",
    },
    {
      name: "Lending Discount Authority",
      contract: X7ContractsEnum.LendingDiscountAuthority(chainId),
      description: "Smart Contract for calculating lending discounts",
      breakdown: "x7lendingdiscountauthority",
    },
  ]
}

function splitters(chainId: ChainId) {
  return [
    {
      name: "Ecosystem Splitter",
      contract: X7ContractsEnum.EcosystemSplitter(chainId),
      description:
        "Smart contract for balancing revenue across all revenue streams in the X7 ecosystem",
      breakdown: "x7ecosystemsplitter",
    },
    {
      name: "Treasury Splitter",
      contract: X7ContractsEnum.TreasurySplitter(chainId),
      description: "Smart contract responsible for managing the treasury",
      breakdown: "x7treasurysplitterv3",
    },
    {
      name: "Liquidity Treasury",
      contract: X7ContractsEnum.X7LiquidityTreasury(chainId),
      description: "Smart contract managing liquidation of accured LP tokens",
      breakdown: "x7liquiditytreasury",
    },
  ]
}

function misc(chainId: ChainId) {
  return [
    {
      name: "Token Burner",
      contract: X7ContractsEnum.TokenBurner(chainId),
      description: "Smart contract for burning tokens",
      breakdown: "x7tokenburner",
    },
    {
      name: "Token Time Lock",
      contract: X7ContractsEnum.TokenTimeLock(chainId),
      description: "ERC-20 Token Time Lock",
      breakdown: "x7tokentimelock",
    },
    {
      name: "Lending Pool",
      contract: X7ContractsEnum.X7_LendingPool(chainId),
      description:
        "The lending pool where Liquidity Loans funds are provided from",
      breakdown: "x7lendingpool",
    },
    {
      name: "Lending Pool Reserve",
      contract: X7ContractsEnum.LendingPoolReserve(chainId),
      description:
        "Smart Contract for minting and redeeming X7D and funding the Lending Pool with ETH.",
      breakdown: "x7lendingpoolreserve",
    },
  ]
}

function xchange(chainId: ChainId) {
  return [
    {
      name: "Xchange Factory",
      contract: X7ContractsEnum.XchangeFactory,
      description:
        "The factory contract maintains a number of `trusted` addresses and allows the creation of new Xchange pairs.",
      breakdown: "xchangefactory",
    },
    {
      name: "Xchange Router",
      contract: X7ContractsEnum.XchangeRouter(chainId),
      description:
        "Uniswap v2 Fork - this contract includes functionality to remove liquidity in a failsafe manner to permit liquidation of fee liquidity in all cases.",
      breakdown: "xchangepair",
    },
  ]
}

function nft(chainId: ChainId) {
  return [
    {
      name: "Borrow Maxi NFT",
      contract: X7ContractsEnum.BorrowingMaxi(chainId),
      description: "A tradable NFT that gives discount on borrowing",
      breakdown: "dexmaxi",
    },
    {
      name: "Ecosystem Maxi NFT",
      contract: X7ContractsEnum.EcosystemMaxi(chainId),
      description: "A tradable NFT that gives discount on X7 tokens",
      breakdown: "ecosystemmaxi",
    },
    {
      name: "DEX Maxi NFT",
      contract: X7ContractsEnum.DexMaxi(chainId),
      description: "A tradable NFT that gives discount on trading",
      breakdown: "dexmaxi",
    },
    {
      name: "Liqudity Maxi NFT",
      contract: X7ContractsEnum.LiquidityMaxi(chainId),
      description: "A tradable NFT that gives discount on providing liquidity",
      breakdown: "liquidity maxi",
    },
    {
      name: "Magister NFT",
      contract: X7ContractsEnum.Magister(chainId),
      description:
        "A high value tradable NFT that gives unique X7DAO voting privileges",
      breakdown: "magister",
    },
  ]
}
