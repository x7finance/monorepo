import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PioneerDrop } from "@/site-components/pioneer-drop"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { ContractsEnum, XCHANGE } from "@x7/common"
import { buttonVariants } from "@x7/ui/button"
import { cn } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"

const metadata = {
  title: "Tokens",
  description:
    "Explore the Core Seven Tokens of X7 Finance: A comprehensive overview of our unique tokens - X7 DAO, X7R, X7101, X7102, X7103, X7104, and X7105. Each token plays a significant role in our DeFi ecosystem, from facilitating transactions and incentivizing participation to empowering holders with governance rights. Understand the tokenomics, benefits, and potential returns of holding these tokens. Experience the diversity and potential of decentralized finance with the core seven tokens of X7 Finance.",
  slug: "/tokens",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function TokensPage() {
  return (
    <div>
      <Heading
        id={"tokens"}
        title={"X7 Tokens"}
        subHeader="X7 Finance has developed seven tokens, each with its own unique role and purpose within the ecosystem. Here's a brief overview of each token and why they are important"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 mx-auto w-96 md:col-span-1">
              <PioneerDrop lineColor="to-blue-500" />
              <div className="relative rounded-lg p-6">
                <div className="absolute inset-0 h-80 w-96 rounded-lg border-t-2 border-transparent">
                  <div
                    className="absolute inset-0 top-1/2 bg-gradient-to-r from-blue-100 to-red-300 dark:from-blue-500 dark:to-red-900"
                    style={{ filter: "blur(20px)" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 dark:from-blue-500 dark:to-purple-500 "
                    style={{ mixBlendMode: "multiply" }}
                  ></div>
                </div>
                <div className="relative -top-12">
                  <div className="flex flex-col items-center">
                    <Image
                      height={200}
                      width={200}
                      className="h-auto w-16"
                      src={
                        "https://x7.finance/images/logos/x7r/X7R_LOGO_black_back_200_x_200_px.png"
                      }
                      alt="X7R image"
                    />

                    <h3 className="mt-6 text-2xl font-bold">X7R</h3>
                    <p className="mt-4 text-center text-sm">
                      {`The X7R token is designed to reward long-term holders
                      through deflationary mechanisms. This encourages users to
                      hold onto their tokens, stabilizing the token's value and
                      promoting a healthy ecosystem.`}
                    </p>
                    <div className="relative top-6 flex items-center gap-y-2 md:gap-x-3 md:gap-y-0">
                      <Link
                        href={`/docs/whitepaper/x7r`}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          })
                        )}
                      >
                        Learn More
                      </Link>
                      <Link
                        href={`${XCHANGE}/#/swap?outputCurrency=${ContractsEnum.X7R}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                          "border-white border-opacity-60 hover:border-opacity-100"
                        )}
                      >
                        Trade
                        {` `}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 mx-auto w-96 md:col-span-1">
              <PioneerDrop lineColor="to-emerald-500" />
              <div className="relative rounded-lg p-6">
                <div className="absolute inset-0 h-80 w-96 rounded-lg border-t-2 border-transparent">
                  <div
                    className="absolute inset-0 top-1/2 bg-gradient-to-r from-blue-100 to-yellow-300 dark:from-blue-500 dark:to-yellow-900"
                    style={{ filter: "blur(20px)" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-200 dark:from-emerald-500 dark:to-green-500"
                    style={{ mixBlendMode: "multiply" }}
                  ></div>
                </div>
                <div className="relative -top-12">
                  <div className="flex flex-col items-center">
                    <Image
                      height={200}
                      width={200}
                      className="h-auto w-16"
                      src={
                        "https://x7.finance/images/logos/x7dao/X7_DAO_LOGO_black_back_200_x_200_px.png"
                      }
                      alt="X7R image"
                    />

                    <h3 className="mt-6 text-2xl font-bold">X7DAO</h3>
                    <p className="mt-4 text-center text-sm">
                      This token is engineered to lead the ecosystem through its
                      governance utility. It allows token holders to participate
                      in the decision-making process, influencing the direction
                      and development of the X7 ecosystem.
                    </p>
                    <div className="relative top-6 flex items-center gap-y-2 md:gap-x-3 md:gap-y-0">
                      <Link
                        href={`/docs/whitepaper/x7dao`}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          })
                        )}
                      >
                        Learn More
                      </Link>
                      <Link
                        href={`${XCHANGE}/#/swap?outputCurrency=${ContractsEnum.X7DAO}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                          "border-white border-opacity-60 hover:border-opacity-100"
                        )}
                      >
                        Trade
                        {` `}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="col-span-2 mx-auto">
                <PioneerDrop height={50} lineColor="to-amber-500" />
                <div className="relative rounded-lg p-6">
                  <div className="absolute inset-0 rounded-lg border-t-2 border-transparent">
                    <div
                      className="absolute inset-0 top-1/2 bg-gradient-to-r from-red-200 to-yellow-100 dark:from-red-900 dark:to-yellow-400"
                      style={{ filter: "blur(20px)" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-orange-200 dark:from-orange-500 dark:to-yellow-500"
                      style={{ mixBlendMode: "multiply" }}
                    ></div>
                  </div>
                  <div className="relative -top-12">
                    <div className="flex flex-col items-center">
                      <Image
                        height={200}
                        width={200}
                        className="h-auto w-16"
                        src={
                          "https://x7.finance/images/logos/x7d/X7D_LOGO_black_back_200_x_200_px.png"
                        }
                        alt="X7R image"
                      />

                      <h3 className="mt-6 text-2xl font-bold">X7D</h3>

                      <p className="relative top-8 text-center text-sm">
                        With insurance of the investor at heart - individuals
                        and institutions will hold these tokens just as they
                        would underwrite treasury bills and other stable assets.
                        Holders of X7D will be able to mint a time-based
                        interest-bearing NFT. X7D is always exchangeable with
                        Ethereum at a 1-to-1 ratio. The X7 Finance protocol will
                        only permit minting of new X7 Deposit tokens when
                        on-chain reserves permit.
                      </p>
                      <div className="relative top-12 flex items-center gap-y-2 md:gap-x-3 md:gap-y-0">
                        <Link
                          href={`/docs/whitepaper/x7deposit`}
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              size: "sm",
                            })
                          )}
                        >
                          Learn More
                        </Link>
                        <Link
                          href={`${XCHANGE}/#/fund`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "sm",
                            }),
                            "border-white border-opacity-60 hover:border-opacity-100"
                          )}
                        >
                          Deposit
                          {` `}
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-4 md:grid-cols-5">
            {quints.map((quint) => (
              <div
                key={quint?.name}
                className="col-span-2 mx-auto md:col-span-1"
              >
                <PioneerDrop height={25} lineColor="to-slate-500" />
                <div className="relative rounded-lg p-6">
                  <div className="absolute inset-0 rounded-lg border-t-2 border-transparent">
                    <div
                      className="absolute inset-0 top-1/2 bg-gradient-to-r from-blue-200 to-amber-300 dark:from-blue-500 dark:to-amber-900"
                      style={{ filter: "blur(20px)" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-slate-200 dark:from-emerald-500 dark:to-slate-500"
                      style={{ mixBlendMode: "multiply" }}
                    ></div>
                  </div>
                  <div className="relative -top-12">
                    <div className="flex flex-col items-center">
                      <Image
                        height={200}
                        width={200}
                        className="h-auto w-16"
                        src={quint?.logo}
                        alt={`${quint?.name} image`}
                      />

                      <h3 className="mt-6 text-2xl font-bold">{quint?.name}</h3>
                      <div className="relative top-8 flex flex-col items-center gap-y-2">
                        <Link
                          href={`/docs/faq/constellations`}
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              size: "sm",
                            })
                          )}
                        >
                          Learn More
                        </Link>
                        <Link
                          href={`${XCHANGE}/#/swap?outputCurrency=${quint?.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "sm",
                            }),
                            "border-white border-opacity-60 hover:border-opacity-100"
                          )}
                        >
                          Trade
                          {` `}
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-5 mx-auto mt-2 max-w-2xl text-center text-sm text-zinc-900 dark:text-zinc-200">
              <h3 className="mx-auto my-6 text-2xl font-bold">
                Constellation Tokens
              </h3>
              <p>
                {`Constellation Tokens (X7101, X7102, X7103, X7104, X7105) act as
                collateralized reserves for the X7 Lending Pool's X7 Deposit
                tokens. They accumulate token value and act as a lender of last
                resort against X7D token issuance. They are designed to be
                eventually price consistent, allowing for arbitrage
                opportunities. This series of tokens are burned on every
                transaction. While continually raising its floor price - it also
                provides further opportunities to mint new X7Deposit tokens.`}
              </p>
            </div>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}

const quints = [
  {
    name: "X7101",
    logo: "https://x7.finance/images/logos/x7101/X7101_LOGO_black_back_200_x_200_px.png",
    description: "",
    link: "",
    token: ContractsEnum.X7101,
  },
  {
    name: "X7102",
    logo: "https://x7.finance/images/logos/x7102/X7102_LOGO_black_back_200_x_200_px.png",
    description: "",
    link: "",
    token: ContractsEnum.X7102,
  },
  {
    name: "X7103",
    logo: "https://x7.finance/images/logos/x7103/X7103_LOGO_black_back_200_x_200_px.png",
    description: "",
    link: "",
    token: ContractsEnum.X7103,
  },
  {
    name: "X7104",
    logo: "https://x7.finance/images/logos/x7104/X7104_LOGO_black_back_200_x_200_px.png",
    description: "",
    link: "",
    token: ContractsEnum.X7104,
  },
  {
    name: "X7105",
    logo: "https://x7.finance/images/logos/x7105/X7105_LOGO_black_back_200_x_200_px.png",
    description: "",
    link: "",
    token: ContractsEnum.X7105,
  },
]
