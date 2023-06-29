import { Twitter } from "icons"

import Image from "next/image"
import Link from "next/link"

import { env } from "@/env.mjs"
import { BlogType } from "@/lib/types"

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
        <div className="flex-auto w-full min-w-0 px-4 sm:pb-16 overflow-auto max-w-none lg:pl-8 lg:pr-0 xl:px-16">
          <Link
            className="absolute -top-14 text-sm dark:text-zinc-400 dark:hover:text-zinc-200 text-zinc-600 hover:text-zinc-800"
            href="/blog"
          >
            ← Back to Blog
          </Link>
          <Prose as="div" className="max-w-[1200px]">
            <>
              {title && (
                <header className="space-y-1 mb-9 md:mx-auto lg:mx-0">
                  {!!tags?.length && (
                    <div className="flex flex-wrap items-center space-x-2 mb-6">
                      {tags.map((tag: string, key: number) => {
                        return (
                          <div
                            key={`${tag}-${key}`}
                            className="shadow-sm bg-gradient-to-r from-yellow-600/30 to-red-600/30 rounded-3xl py-1 px-4 inline-block"
                          >
                            <span className="dark:text-zinc-300 text-zinc-600 font-semibold">
                              {tag}
                            </span>
                          </div>
                        )
                      })}
                      {date && (
                        <h2 className="text-[14px] tracking-tight mt-0 mb-0 font-display text-zinc-500">
                          {date}
                        </h2>
                      )}
                    </div>
                  )}
                  {title && (
                    <h1 className="text-5xl font-bold font-heading">{title}</h1>
                  )}
                </header>
              )}
              {summary && (
                <div className="text-2xl tracking-tighter text-zinc-500 leading-8 md:mx-auto lg:mx-0">
                  {summary}
                </div>
              )}
            </>
          </Prose>

          <div className="grid grid-cols-4 w-full mx-auto max-w-[1200px]">
            <ul
              role="list"
              className="xl:hidden border-b border-zinc-800 w-full mx-auto max-w-2xl lg:max-w-full py-8 col-span-4 grid grid-cols-2 lg:grid-cols-3"
            >
              {authors?.map((a) => (
                <li key={`${a?.id}-author`} className="py-4 w-full">
                  <div className="flex items-center">
                    <Image
                      src={`${env.NEXT_PUBLIC_ASSETS_URL}${a.image}`}
                      alt=""
                      height={80}
                      width={80}
                      className="h-12 w-12 mr-3 flex-none rounded-full ring-1 dark:ring-white/30 ring-black/30"
                    />
                    <div className="flex flex-col">
                      <h3 className="flex-auto truncate text-sm font-semibold leading-6 dark:text-white text-black">
                        {a.name}
                      </h3>
                      <div className="flex-none text-xs dark:text-zinc-500 dark:hover:text-zinc-300 text-zinc-600 hover:text-black">
                        <Link
                          href={`https://twitter.com/${a.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <span className="mr-1">
                            <Twitter className="w-4 h-4 text-[#1d9bf0]" />
                          </span>
                          @{a.twitter}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="xl:pr-0 pb-20 xl:border-r dark:border-zinc-200/20 border-zinc-800/20 col-span-10 xl:col-span-3">
              <Prose>{children}</Prose>
            </div>

            <aside className="hidden xl:block xl:col-span-1">
              <header className="flex items-center justify-between px-4 pb-4 sm:px-6 sm:pb-6 pt-16 lg:px-8">
                <h2 className="text-base leading-7 text-zinc-600 dark:text-zinc-400 ">
                  Posted by
                </h2>
              </header>
              <ul role="list" className="">
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
                        className="h-12 w-12 flex-none rounded-full ring-1 dark:ring-white/30 ring-black/30"
                      />
                      <div className="flex flex-col">
                        <h3 className="flex-auto truncate text-sm font-semibold leading-6 dark:text-white text-black">
                          {a.name}
                        </h3>
                        <div className="flex-none text-xs dark:text-zinc-500 dark:hover:text-zinc-300 text-zinc-600 hover:text-black">
                          <Link
                            href={`https://twitter.com/${a.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <span className="mr-1">
                              <Twitter className="w-4 h-4 text-[#1d9bf0]" />
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
          className="text-sm xl:ml-16 dark:text-zinc-400 dark:hover:text-zinc-200 text-zinc-600 hover:text-zinc-800"
          href="/blog"
        >
          ← Back to Blog
        </Link>
      </div>
    </>
  )
}
