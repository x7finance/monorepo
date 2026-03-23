import Markdoc from "@markdoc/markdoc"
import { notFound } from "next/navigation"
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react"

import { Splash } from "@x7/ui/splash"
import { generateDocsSlugs } from "~/lib/utils/generateDocsSlugs"
import type { MetadataDocType } from "~/lib/utils/generateMetadataFromDoc"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { DocsBase } from "../../_components/base"
import { components } from "../../_utils/config.markdoc"
import { getMarkdownContent } from "../../_utils/markdoc-parse"

export async function generateStaticParams() {
  return generateDocsSlugs()
}

async function getDocMetadata(resolvedParams: { slug?: string[] }) {
  "use cache"
  const doc = await getMarkdownContent(resolvedParams)

  if (!doc) {
    return {}
  }

  return generateMetadataFromDoc(doc as MetadataDocType)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
  return getDocMetadata(resolvedParams)
}

async function DocsContent({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
  const { content, title, tags, tableOfContents, date, slug, section } =
    await getMarkdownContent(resolvedParams)

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

export default function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return (
    <Suspense fallback={<Splash />}>
      <DocsContent params={params} />
    </Suspense>
  )
}
