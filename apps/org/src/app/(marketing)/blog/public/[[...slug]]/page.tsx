import Markdoc from "@markdoc/markdoc"
import { notFound } from "next/navigation"
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import React, { Suspense } from "react"

import { Splash } from "@x7/ui/splash"
import { BlogBase } from "~/app/(marketing)/blog/_components/base"
import { components } from "~/app/(marketing)/blog/_utils/config.markdoc"
import { getMarkdownContent } from "~/app/(marketing)/blog/_utils/markdoc-parse"
import { generateBlogPostSlugs } from "~/lib/utils/generateBlogPostSlugs"
import type { MetadataDocType } from "~/lib/utils/generateMetadataFromDoc"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

export async function generateStaticParams() {
  return await generateBlogPostSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
  const post = await getMarkdownContent(resolvedParams)

  if (!post) {
    return {}
  }

  return generateMetadataFromDoc(post as MetadataDocType)
}

async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const resolvedParams = await params
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
  } = await getMarkdownContent(resolvedParams)

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

export default function BlogPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return (
    <Suspense fallback={<Splash />}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}
