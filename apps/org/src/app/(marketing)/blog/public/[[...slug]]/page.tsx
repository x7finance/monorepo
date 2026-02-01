/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from "react";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";

import { BlogBase } from "~/app/(marketing)/blog/_components/base";
import { components } from "~/app/(marketing)/blog/_utils/config.markdoc";
import { getMarkdownContent } from "~/app/(marketing)/blog/_utils/markdoc-parse";
import { generateBlogPostSlugs } from "~/lib/utils/generateBlogPostSlugs";
import type { MetadataDocType } from "~/lib/utils/generateMetadataFromDoc";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";

export async function generateStaticParams() {
  return await generateBlogPostSlugs();
}

export async function generateMetadata({ params }: { params: any }) {
  const post = await getMarkdownContent(params);

  if (!post) {
    return {};
  }

  return generateMetadataFromDoc(post as MetadataDocType);
}

export default async function BlogPage({ params }: { params: any }) {
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
  } = await getMarkdownContent(params);

  if (!content) {
    notFound();
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
  );
}
