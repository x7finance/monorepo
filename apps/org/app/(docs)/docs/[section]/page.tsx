import path from "path"

import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import { DocsBase } from "../(docs.components)/base"
import { generateMetadataFromDoc } from "../(docs.components)/generateMetadataFromDoc"
import {
  DocsPageProps,
  getMarkdownContent,
  SOURCE_DIR,
} from "../(docs.components)/markdoc-parse"
import { components } from "../config.markdoc"

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
  const { content, title, tags, tableOfContents, date } =
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
      slug={`/${params?.section}/${params?.slug}`}
      tableOfContents={tableOfContents}
    >
      {Markdoc.renderers.react(content, React, { components })}
    </DocsBase>
  )
}
