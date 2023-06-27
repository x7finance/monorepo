// import { Heading } from "@/components/heading"
import path from "path"

import React from "react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { glob } from "glob"

import { env } from "@/env.mjs"
import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Assistance } from "@/components/assistance"
import { SiteContentContainer } from "@/components/site-content-container"

import {
  getMarkdownContent,
  MarkdownContent,
  SOURCE_FILES,
} from "../(blog.utils)/markdoc-parse"

const metadata = {
  title: "X7 Blog",
  description:
    "The X7 Blog is a place for the X7 community to learn about the latest developments, updates, and announcements from the X7 Finance team. Stay up to date with the latest news and developments from X7 Finance.",
  slug: "/blog",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

async function getPreviewPostsMetadata() {
  const markdownPaths = await glob(path.join(SOURCE_FILES, "**/*.md"))

  const postsPromises = markdownPaths.map(async (postPath) => {
    return await getMarkdownContent({
      slug: [
        `${postPath
          ?.replace(/^app\/\(marketing\)\/\(blog-posts\)\/posts\//, "")
          .replace(/\.md$/, "")}`,
      ],
      section: "posts",
      omitProperties: ["content"],
    })
  })

  const postsMetadata: Partial<MarkdownContent>[] = await Promise.all(
    postsPromises
  )

  // Sort the articles from newest to oldest based on the `date` property
  const sortedPostsMetadata: Partial<MarkdownContent>[] = postsMetadata.sort(
    (a, b) => {
      const dateA: Date | undefined = a.date ? new Date(a.date) : undefined
      const dateB: Date | undefined = b.date ? new Date(b.date) : undefined

      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime()
      } else if (dateA && !dateB) {
        return -1
      } else if (!dateA && dateB) {
        return 1
      } else {
        return 0
      }
    }
  )

  return sortedPostsMetadata
}

interface Author {
  name: string
  imageUrl: string
}

interface BlogPostType {
  id?: string
  imageUrl?: string
  title?: string
  slug?: string
  datetime?: string
  date?: string
  authors?: Author[]
}

export default async function BlogPage() {
  const builtPosts = await getPreviewPostsMetadata()

  return (
    <div>
      <SiteContentContainer className="max-w-6xl">
        <div className="container py-6 lg:py-10">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
            <div className="flex-1 space-y-4">
              <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                X7 Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                centralizing the best content on decentralized finance in one
                place.
              </p>
            </div>
          </div>
          <hr className="my-8" />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mt-12 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {builtPosts.map((post: BlogPostType) => (
                <article
                  className="relative isolate flex flex-col justify-end ring-1 ring-zinc-700 overflow-hidden rounded-2xl bg-zinc-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
                  key={post?.id}
                >
                  <Image
                    src={`${env.NEXT_PUBLIC_ASSETS_URL}/${post?.imageUrl}`}
                    alt={`${post?.title} header image`}
                    width={500}
                    height={500}
                    className="absolute inset-0 -z-10 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-900 via-zinc-900/40" />
                  <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-zinc-900/10" />

                  <h3 className="mb-3 text-xl font-bold leading-6 text-white">
                    <Link href={`${post?.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex flex-col gap-y-1 overflow-hidden text-sm leading-6 text-zinc-300">
                    <time dateTime={post.datetime} className="mr-8 block">
                      {post.date}
                    </time>
                    <div className="flex items-center gap-x-4">
                      <div className="flex gap-x-0">
                        <AuthorImages authors={post?.authors} />
                        <div className="flex justify-center items-center">
                          {post?.authors?.[0]?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <Assistance title="Looking to get in touch with the DAO?" />
        </div>
      </SiteContentContainer>
    </div>
  )
}

function AuthorImages({ authors }) {
  return (
    <div className="isolate flex -space-x-2 overflow-hidden pr-2">
      {authors?.map((author, index) => (
        <Image
          key={index}
          src={`${env.NEXT_PUBLIC_ASSETS_URL}/${author?.image}`}
          alt={`${author?.name} avatar image`}
          width={100}
          height={100}
          className={`relative z-${
            3 - index
          } bg-white/10 inline-block h-8 w-8 rounded-full ring-1 m-0.5 ring-white ring-opacity-50`}
        />
      ))}
    </div>
  )
}
