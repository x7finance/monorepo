import path from "path"

import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"

import { DocsBase } from "../(docs.components)/base"
import { components } from "../(docs.utils)/config.markdoc"
import {
  DocsPageProps,
  getMarkdownContent,
  SOURCE_DIR,
} from "../(docs.utils)/markdoc-parse"

export async function generateStaticParams() {
  const markdownPaths = await glob(path.join(SOURCE_DIR, "**/*.md"))

  return markdownPaths.map((postPath) => {
    return {
      slug: path.basename(postPath, path.extname(postPath)),
    }
  })
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const doc = await getMarkdownContent(params)

  if (!doc) {
    return {}
  }

  return generateMetadataFromDoc(doc)
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { content, title, tags, tableOfContents, date, slug } =
    await getMarkdownContent(params)

  if (!content) {
    notFound()
  }

  return (
    <DocsBase
      docsType={params?.section}
      date={date}
      tags={tags}
      title={title}
      slug={slug}
      tableOfContents={tableOfContents}
    >
      {Markdoc.renderers.react(content, React, { components })}
    </DocsBase>
  )
}
