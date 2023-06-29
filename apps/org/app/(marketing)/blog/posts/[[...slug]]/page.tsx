import path from "path"

import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { BlogBase } from "@/app/(marketing)/(blog.components)/base"
import { components } from "@/app/(marketing)/(blog.utils)/config.markdoc"
import {
  getMarkdownContent,
  ParamsProps,
  SOURCE_FILES,
} from "@/app/(marketing)/(blog.utils)/markdoc-parse"

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

    return { slug }
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

export default async function BlogPage({ params }) {
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
