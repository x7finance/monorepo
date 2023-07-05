import Image from "next/image"
import Link from "next/link"

import { ChevronRightIcon, X7Logo } from "@x7/icons"
import { getRandomPioneerNumber } from "@x7/utils"

import { NOT_FOUND_LINKS } from "@/config/site"

export function NotFoundContent() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-16 sm:pb-24 lg:px-8">
      <Link href="/">
        <X7Logo className="mx-auto h-10 w-auto fill-black dark:fill-white sm:h-16 " />
      </Link>
      <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
        <p className="text-base font-semibold leading-8 text-indigo-600 dark:text-indigo-500">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          You trusted the code, <br />
          {`but this page doesn't exist.`}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-500 sm:mt-6 sm:text-lg sm:leading-8">
          {`Sorry, we couldn't find the page you're looking for.`}
        </p>
      </div>
      <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
        <h2 className="sr-only">Popular pages</h2>
        <ul className="-mt-6 divide-y divide-zinc-900/5 border-b border-zinc-900/5 dark:divide-zinc-100/5 dark:border-zinc-100/5">
          {NOT_FOUND_LINKS.map((link, linkIdx) => (
            <li key={linkIdx} className="relative flex gap-x-6 py-6">
              <div className="flex h-14 w-14 flex-none items-center justify-center">
                <Image
                  height={100}
                  width={100}
                  className="h-auto w-full overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                  src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                  alt="Random Pioneer Image"
                />
              </div>
              <div className="flex-auto">
                <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                  <Link href={link.href}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {link.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-500">
                  {link.description}
                </p>
              </div>
              <div className="flex-none self-center">
                <ChevronRightIcon
                  className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                  aria-hidden="true"
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-500"
          >
            <span aria-hidden="true">&larr;</span>
            {` `}Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
