import { cn, getRandomPioneerNumber } from "utils"

import Image from "next/image"
import Link from "next/link"

import { GradientTypes } from "@/components/gradients"

import { PioneerDrop } from "./pioneer-drop"
import { buttonVariants } from "./ui/button"

interface ConstructionProps {
  description?: string
}

export function UnderConstruction(props: ConstructionProps) {
  const { description } = props

  return (
    <div className="isolate min-h-screen relative z-0 -top-20">
      <div className="flow-root pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative">
            <div className="mt-16  pb-12 lg:mt-20 lg:pb-20">
              <div className="relative z-0">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="relative lg:grid lg:grid-cols-7">
                    <div className="mx-auto max-w-md lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none hidden lg:flex">
                      <div className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg lg:rounded-none lg:rounded-l-lg">
                        <div className="flex flex-1 flex-col">
                          <Image
                            height={400}
                            width={400}
                            className="h-auto w-full overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                            src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                            alt="Random Pioneer Image"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 lg:mx-0 lg:mt-0 lg:max-w-none">
                      <PioneerDrop lineColor={"to-purple-900"} />
                      <div className="relative z-[1] rounded-lg shadow-xl">
                        <div
                          className="pointer-events-none absolute inset-0 rounded-lg border-2 border-indigo-600 border-opacity-60"
                          aria-hidden="true"
                        />
                        <div className="absolute inset-x-0 top-0 translate-y-px transform">
                          <div className="flex -translate-y-1/2 transform justify-center">
                            <span
                              className={cn(
                                GradientTypes.grape,
                                `inline-flex rounded-full font-mono bg-gradient-to-b  px-4 py-1 text-base font-semibold text-white`
                              )}
                            >
                              Under Construction
                            </span>
                          </div>
                        </div>
                        <Image
                          height={400}
                          width={400}
                          className="h-auto w-full overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                          src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                          alt="Random Pioneer Image"
                        />
                        <div className="rounded-b-lg border-t-2 border-zinc-800 px-6 pb-8 pt-6 sm:px-10 ">
                          <div>
                            <p className="text-center mt-2 mb-4 text-zinc-700 dark:text-zinc-400">
                              {description
                                ? description
                                : `Pioneers are hard at work to provide the best
                              information and experience for users looking to
                              utilize the most powerful and decentralized DEX on
                              the market today.`}
                            </p>
                          </div>
                          <Link
                            href="/"
                            className={cn(
                              buttonVariants({
                                variant: "default",
                                size: "lg",
                              }),
                              "mt-2 sm:mt-0 w-full"
                            )}
                          >
                            Back Home
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto mt-10 max-w-md hidden lg:flex lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 lg:m-0 lg:max-w-none">
                      <div className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg lg:rounded-none lg:rounded-r-lg">
                        <div className="flex flex-1 flex-col">
                          <Image
                            height={400}
                            width={400}
                            className="h-auto w-full overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                            src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                            alt="Random Pioneer Image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
