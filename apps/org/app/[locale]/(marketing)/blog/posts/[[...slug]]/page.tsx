import path from "path"
import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { BlogBase } from "@/app/[locale]/(marketing)/(blog.components)/base"
import { components } from "@/app/[locale]/(marketing)/(blog.utils)/config.markdoc"
import type { ParamsProps } from "@/app/[locale]/(marketing)/(blog.utils)/markdoc-parse"
import {
  getMarkdownContent,
  SOURCE_FILES,
} from "@/app/[locale]/(marketing)/(blog.utils)/markdoc-parse"

export async function generateStaticParams() {
  const markdownPaths = await glob(path.join(SOURCE_FILES, "**/*.md"))

  return markdownPaths.map((postPath) => {
    const startIndex = postPath.indexOf("/blog/") + "/blog/".length
    const endIndex = postPath.lastIndexOf(".md")
    const sourceFilePath = postPath.substring(startIndex, endIndex)

    const slug = sourceFilePath
      .replace("(blog-posts)", "")
      .split("/")
      .filter((slug) => slug !== "")

    return { slug, locale: "en" }
  })
}

export async function generateMetadata({
  params,
}: {
  params: ParamsProps
}): Promise<Metadata> {
  const post = await getMarkdownContent({
    slug: [`${params.slug}`],
    section: "posts",
  })

  if (!post) {
    return {}
  }

  return generateMetadataFromDoc(post)
}

export default async function BlogPage({ params }: { params: ParamsProps }) {
  const {
    content,
    title,
    tags,
    tableOfContents,
    date,
    slug,
    section,
    summary,
    authors,
  } = await getMarkdownContent(params)

  if (!content) {
    notFound()
  }

  return (
    <BlogBase
      blogsType={section}
      date={date}
      tags={tags}
      title={title}
      slug={slug}
      summary={summary}
      authors={authors}
      tableOfContents={tableOfContents}
    >
      {Markdoc.renderers.react(content, React, { components })}
    </BlogBase>
  )
}
