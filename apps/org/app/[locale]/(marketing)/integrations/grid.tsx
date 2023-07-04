import Link from "next/link"
import { ExternalLinkIcon, Telegram, Twitter } from "@x7/icons"

import { env } from "@/env.mjs"

export function IntegrationsGrid() {
  return (
    <ul
      role="list"
      className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
    >
      {INTEGRATIONS.map((t) => (
        <li
          key={t.name}
          className="border relative dark:border-zinc-700 border-zinc-300 rounded-lg overflow-hidden group dark:hover:border-white hover:border-black transition-all duration-300"
        >
          <img
            className="aspect-[3/2] w-full object-cover"
            src={t.imageUrl}
            alt=""
          />
          <div className="p-4 relative">
            <h3 className="font-semibold text-lg leading-8 tracking-tight text-zinc-900 dark:text-zinc-100">
              <Link className="inset-0 absolute left-4 top-2" href="/blog">
                {t.name}
              </Link>
            </h3>
            <p className="text-sm mt-6 leading-7 text-zinc-400 dark:text-zinc-500 h-20 line-clamp-2">
              {t.description}
            </p>
            <ul
              role="list"
              className="flex gap-x-2 items-center relative w-full bottom-0"
            >
              <li>
                <span className="text-zinc-400 text-sm dark:text-zinc-600  top-[-2px] z-10 flex justify-center items-center">
                  by {t.entity}
                </span>
              </li>
              <li>
                <a
                  href={t.twitterUrl}
                  className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-100 z-10 transition-all duration-150"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5 " aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={t.linkedinUrl}
                  className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-100 z-10 transition-all duration-150"
                >
                  <span className="sr-only">Telegram</span>
                  <Telegram className="h-5 w-5 " aria-hidden="true" />
                </a>
              </li>
              {t.externalLink && (
                <li className="ml-auto relative">
                  <Link
                    className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-100 transition-all duration-150"
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

const INTEGRATIONS = [
  {
    name: "Reflection Token",
    description: "Reflections are distributed to holders based on their share.",
    entity: "Mike Murpher",
    imageUrl: `${env.NEXT_PUBLIC_ASSETS_URL}/images/templates/reflections-contract.png`,
    twitterUrl: "",
    linkedinUrl: "#",
    externalLink:
      "https://bscscan.com/token/0x42981d0bfbaf196529376ee702f2a9eb9092fcb5#code",
  },
  {
    name: "Standard Tax Token",
    description: "Use this template to create a token with a standard tax.",
    entity: "Safemoon Team",
    imageUrl: `${env.NEXT_PUBLIC_ASSETS_URL}/images/templates/standard-tax-contract.png`,
    twitterUrl: "#",
    linkedinUrl: "#",
    externalLink:
      "https://etherscan.io/token/0xf524f2d3f8e492bbcb618bce36e911eb55e8b368#code",
  },
  {
    name: "Self Renouncing Token",
    description: "A popular token template that renounces ownership on launch.",
    entity: "anonymous",
    imageUrl: `${env.NEXT_PUBLIC_ASSETS_URL}/images/templates/renouncing-contract.png`,
    twitterUrl: "#",
    linkedinUrl: "#",
    externalLink:
      "https://etherscan.io/token/0xf524f2d3f8e492bbcb618bce36e911eb55e8b368#code",
  },
]
