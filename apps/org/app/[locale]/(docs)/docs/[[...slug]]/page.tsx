import path from "path"
import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DocsBase } from "../../_components/base"
import { components } from "../../_utils/config.markdoc"
import type { ParamsProps } from "../../_utils/markdoc-parse"
import { getMarkdownContent, SOURCE_FILES } from "../../_utils/markdoc-parse"

export async function generateStaticParams() {
  const markdownPaths = await glob(path.join(SOURCE_FILES, "**/*.md"))

  return markdownPaths.map((postPath) => {
    const startIndex = postPath.indexOf("/docs/") + "/docs/".length
    const endIndex = postPath.lastIndexOf(".md")
    const sourceFilePath = postPath.substring(startIndex, endIndex)

    const slug = sourceFilePath
      .split("/")
      .filter(
        (slugPart, index, array) =>
          slugPart !== "" &&
          !(slugPart === "index" && index === array.length - 1)
      )

    return { slug, locale: "en" }
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

export default async function DocsPage({ params }: { params: ParamsProps }) {
  const { content, title, tags, tableOfContents, date, slug, section } =
    await getMarkdownContent(params)

  if (!content) {
    notFound()
  }

  return (
    <DocsBase
      docsType={section}
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
