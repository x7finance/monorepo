import Image from "next/image"
import Link from "next/link"

import { Twitter } from "@x7/icons"

import { env } from "@/env.mjs"
import type { BlogType } from "@/lib/types"
import { Prose } from "./tags/prose"

interface BlogBaseProps {
  children: React.ReactNode
  title?: string
  date?: string
  tags?: string[]
  tableOfContents?: any
  blogsType?: BlogType
  slug?: string
  summary?: string
  authors?: any[]
}
export function BlogBase(props: BlogBaseProps) {
  const { children, title, date, tags, summary, authors } = props

  return (
    <>
      <div className="relative mx-auto max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="w-full min-w-0 max-w-none flex-auto overflow-auto px-2 sm:pb-16 lg:pl-8 lg:pr-0 xl:px-16">
          <Prose as="div" className="max-w-[1200px]">
            <>
              <div>
                <Link
                  className="left- absolute -top-14 text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 xl:left-28"
                  href="/blog"
                >
                  ← Back to Blog
                </Link>
              </div>
              {title && (
                <header className="mb-6 space-y-1 sm:mb-9 md:mx-auto lg:mx-0">
                  {!!tags?.length && (
                    <div className="mb-6 flex flex-wrap items-center space-x-2">
                      {tags.map((tag: string, key: number) => {
                        return (
                          <div
                            key={`${tag}-${key}`}
                            className="inline-block rounded-3xl bg-gradient-to-r from-yellow-600/30 to-red-600/30 px-4 py-1 shadow-sm"
                          >
                            <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                              {tag}
                            </span>
                          </div>
                        )
                      })}
                      {date && (
                        <h2 className="font-display mb-0 mt-0 text-[14px] font-normal tracking-tight text-zinc-500">
                          {date}
                        </h2>
                      )}
                    </div>
                  )}
                  {title && (
                    <h1 className="font-heading text-3xl font-bold xl:text-5xl">
                      {title}
                    </h1>
                  )}
                </header>
              )}
              {summary && (
                <div className="text-[16px] leading-8 tracking-tighter text-zinc-500 md:mx-auto lg:mx-0 xl:text-2xl">
                  {summary}
                </div>
              )}
            </>
            <div className="block pt-4 xl:hidden">
              <h3 className="text-sm font-normal leading-5 text-zinc-600 dark:text-zinc-400">
                Posted by
              </h3>
            </div>
          </Prose>

          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-4">
            <ul className="col-span-4 mx-auto grid w-full max-w-2xl grid-cols-2 border-b border-zinc-200 dark:border-zinc-800 lg:max-w-full lg:grid-cols-3 xl:hidden">
              {authors?.map((a) => (
                <li key={`${a?.id}-author`} className="w-full py-4">
                  <div className="flex items-center">
                    <Image
                      src={`${env.NEXT_PUBLIC_ASSETS_URL}${a.image}`}
                      alt=""
                      height={80}
                      width={80}
                      className="mr-1.5 h-8 w-8 flex-none rounded-full ring-1 ring-black/30 dark:ring-white/30 sm:mr-3 sm:h-12 sm:w-12"
                    />
                    <div className="flex flex-col">
                      <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-black dark:text-white">
                        {a.name}
                      </h3>
                      <div className="flex-none text-xs text-zinc-600 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-300">
                        <Link
                          href={`https://twitter.com/${a.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <span className="mr-1">
                            <Twitter className="h-4 w-4 text-[#1d9bf0]" />
                          </span>
                          @{a.twitter}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="col-span-10 border-zinc-800/20 pb-20 dark:border-zinc-200/20 xl:col-span-3 xl:border-r xl:pr-0">
              <Prose>{children}</Prose>
            </div>

            <aside className="hidden xl:col-span-1 xl:block">
              <header className="flex items-center justify-between px-4 pb-4 pt-16 sm:px-6 sm:pb-6 lg:px-8">
                <h3 className="text-base leading-7 text-zinc-600 dark:text-zinc-400 ">
                  Posted by
                </h3>
              </header>
              <ul className="">
                {authors?.map((a) => (
                  <li
                    key={`${a?.id}-author`}
                    className="px-4 py-4 sm:px-6 lg:px-8"
                  >
                    <div className="flex items-center gap-x-3">
                      <Image
                        src={`${env.NEXT_PUBLIC_ASSETS_URL}${a.image}`}
                        alt=""
                        height={80}
                        width={80}
                        className="h-12 w-12 flex-none rounded-full ring-1 ring-black/30 dark:ring-white/30"
                      />
                      <div className="flex flex-col">
                        <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-black dark:text-white">
                          {a.name}
                        </h3>
                        <div className="flex-none text-xs text-zinc-600 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-300">
                          <Link
                            href={`https://twitter.com/${a.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <span className="mr-1">
                              <Twitter className="h-4 w-4 text-[#1d9bf0]" />
                            </span>
                            @{a.twitter}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
        <Link
          className="text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 xl:ml-16"
          href="/blog"
        >
          ← Back to Blog
        </Link>
      </div>
    </>
  )
}
