import path from "path"

import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"

import { BlogBase } from "../../(blog.components)/base"
import { components } from "../../(blog.utils)/config.markdoc"
import {
  getMarkdownContent,
  ParamsProps,
  SOURCE_FILES,
} from "../../(blog.utils)/markdoc-parse"

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
  const doc = await getMarkdownContent(params)

  if (!doc) {
    return {}
  }

  return generateMetadataFromDoc(doc)
}

export default async function BlogsPage({ params }) {
  const { content, title, tags, date, slug, section, summary } =
    await getMarkdownContent(params)

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
    >
      {Markdoc.renderers.react(content, React, { components })}
    </BlogBase>
  )
}
