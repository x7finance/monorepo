import Image from "next/image"
import Link from "next/link"

import { ExternalLinkIcon, Telegram, Twitter } from "@x7/icons"

import { env } from "@/env.mjs"

export function ContractTemplatesGrid() {
  return (
    <ul className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {TEMPLATES.map((t) => (
        <li
          key={t.name}
          className="group relative overflow-hidden rounded-lg border border-zinc-300 transition-all duration-300 hover:border-black dark:border-zinc-700 dark:hover:border-white"
        >
          <Image
            height={500}
            width={500}
            className="aspect-[3/2] w-full object-cover"
            src={t.imageUrl}
            alt=""
          />
          <div className="relative p-4">
            <h3 className="text-lg font-semibold leading-8 tracking-tight text-zinc-900 dark:text-zinc-100">
              <Link className="absolute inset-0 left-4 top-2" href="/blog">
                {t.name}
              </Link>
            </h3>
            <p className="mt-6 line-clamp-2 h-20 text-sm leading-7 text-zinc-400 dark:text-zinc-500">
              {t.description}
            </p>
            <ul className="relative bottom-0 flex w-full items-center gap-x-2">
              <li>
                <span className="top-[-2px] z-10 flex  items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
                  by {t.entity}
                </span>
              </li>
              <li>
                <a
                  href={t.twitterUrl}
                  className="z-10 text-zinc-400 transition-all duration-150 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-100"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5 " aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={t.linkedinUrl}
                  className="z-10 text-zinc-400 transition-all duration-150 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-100"
                >
                  <span className="sr-only">Telegram</span>
                  <Telegram className="h-5 w-5 " aria-hidden="true" />
                </a>
              </li>
              {t.externalLink && (
                <li className="relative ml-auto">
                  <Link
                    className="text-zinc-400 transition-all duration-150 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-100"
                    href={t.externalLink}
                  >
                    <span className="sr-only">External Link</span>
                    <ExternalLinkIcon className="h-5 w-5 " />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  )
}

const TEMPLATES = [
  {
    name: "Reflection Token",
    description: "Reflections are distributed to holders based on their share.",
    entity: "Mike Murpher",
    imageUrl: `${env.NEXT_PUBLIC_ASSETS_URL}/images/templates/reflections-contract.png`,
    twitterUrl: "",
    linkedinUrl: "#",
    externalLink: "",
  },
  {
    name: "Standard Tax Token",
    description: "Use this template to create a token with a standard tax.",
    entity: "Safemoon Team",
    imageUrl: `${env.NEXT_PUBLIC_ASSETS_URL}/images/templates/standard-tax-contract.png`,
    twitterUrl: "#",
    linkedinUrl: "#",
    externalLink: "",
  },
  {
    name: "Self Renouncing Token",
    description: "A popular token template that renounces ownership on launch.",
    entity: "anonymous",
    imageUrl: `${env.NEXT_PUBLIC_ASSETS_URL}/images/templates/renouncing-contract.png`,
    twitterUrl: "#",
    linkedinUrl: "#",
    externalLink: "",
  },
]
