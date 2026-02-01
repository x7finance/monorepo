import type { MetadataDocType } from "~/lib/utils/generateMetadataFromDoc"

import Markdoc from "@markdoc/markdoc"
import { notFound } from "next/navigation"
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react"

import { Splash } from "@x7/ui/splash"
import { generateDocsSlugs } from "~/lib/utils/generateDocsSlugs"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { DocsBase } from "../../_components/base"
import { components } from "../../_utils/config.markdoc"
import { getMarkdownContent } from "../../_utils/markdoc-parse"

export async function generateStaticParams() {
  return generateDocsSlugs()
}

export async function generateMetadata({ params }: { params: any }) {
  const doc = await getMarkdownContent(params)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!doc) {
    return {}
  }

  return generateMetadataFromDoc(doc as MetadataDocType)
}

async function DocsContent({ params }: { params: any }) {
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

export default function DocsPage({ params }: { params: any }) {
  return (
    <Suspense fallback={<Splash />}>
      <DocsContent params={params} />
    </Suspense>
  )
}
