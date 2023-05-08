import path from "path"

import React from "react"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import {
  DocsPageProps,
  SOURCE_DIR,
  getMarkdownContent,
} from "../../(docs.components)/markdoc-parse"
import { DocsBase } from "../../../docs/(docs.components)/base"
import { components } from "../../config.markdoc"

export async function generateStaticParams() {
  const markdownPaths = await glob(path.join(SOURCE_DIR, "**/*.md"))

  return markdownPaths.map((postPath) => {
    return {
      slug: path.basename(postPath, path.extname(postPath)),
    }
  })
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { content, title, tags, tableOfContents, date } =
    await getMarkdownContent(params)

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
