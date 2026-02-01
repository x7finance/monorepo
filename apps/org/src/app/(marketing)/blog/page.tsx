import path from "path";
import React, { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { glob } from "glob";

import { LinkInternal } from "@x7/ui/link";
import { Splash } from "@x7/ui/splash";

import { env } from "~/env.mjs";
import { SiteContentContainer } from "~/lib/components/core/site-content-container";
import { Assistance } from "~/lib/components/utils/assistance";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { MarketingLinks } from "~/types/links";
import type { MarkdownContent } from "./_utils/markdoc-parse";
import { getMarkdownContent, SOURCE_FILES } from "./_utils/markdoc-parse";

const metadata = {
  title: "X7 Blog",
  description:
    "The X7 Blog is a place for the X7 community to learn about the latest developments, updates, and announcements from the X7 Finance team. Stay up to date with the latest news and developments from X7 Finance.",
  slug: MarketingLinks.Blog,
  section: "default",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

async function getPreviewPostsMetadata() {
  const markdownPaths = await glob(path.join(SOURCE_FILES, "**", "*.md"));

  const postsPromises = markdownPaths.map(async (postPath) => {
    const relativePath = path
      .relative(path.join(SOURCE_FILES), postPath)
      .replace(/\.md$/, "");

    return await getMarkdownContent({
      slug: [relativePath],
      section: "posts",
      omitProperties: ["content"],
    });
  });

  const postsMetadata: Partial<MarkdownContent>[] =
    await Promise.all(postsPromises);

  // Sort the articles from newest to oldest based on the `date` property
  const sortedPostsMetadata: Partial<MarkdownContent>[] = postsMetadata.sort(
    (a, b) => {
      const dateA: Date | undefined = a.date ? new Date(a.date) : undefined;
      const dateB: Date | undefined = b.date ? new Date(b.date) : undefined;

      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      } else if (dateA && !dateB) {
        return -1;
      } else if (!dateA && dateB) {
        return 1;
      } else {
        return 0;
      }
    },
  );

  return sortedPostsMetadata;
}

interface Author {
  name: string;
  image: string;
}

interface BlogPostType {
  id?: string;
  imageUrl?: string;
  title?: string;
  slug?: string;
  datetime?: string;
  date?: string;
  authors: Author[];
}

function AuthorImages({ authors }: { authors: Author[] }) {
  return (
    <div className="isolate flex -space-x-2 overflow-hidden pr-2">
      {authors.map((author, index) => (
        <Image
          key={author.name}
          src={`${env.NEXT_PUBLIC_ASSETS_URL}/${author.image}`}
          alt={`${author.name} avatar image`}
          width={100}
          height={100}
          className={`relative z-${
            3 - index
          } ring-opacity-50 m-0.5 inline-block h-8 w-8 rounded-full bg-white/10 ring-1 ring-white`}
        />
      ))}
    </div>
  );
}

async function BlogPostsList() {
  const builtPosts: BlogPostType[] =
    (await getPreviewPostsMetadata()) as BlogPostType[];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto mt-12 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {builtPosts.map((post: BlogPostType) => (
          <article
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-zinc-900 px-8 pt-80 pb-8 ring-1 ring-zinc-700 sm:pt-48 lg:pt-80"
            key={post.id}
          >
            <Image
              src={`${env.NEXT_PUBLIC_ASSETS_URL}/${post.imageUrl}`}
              alt={`${post.title} header image`}
              width={500}
              height={500}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />

            <div className="absolute inset-0 -z-10 bg-linear-to-t from-zinc-900 via-zinc-900/40" />
            <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-zinc-900/10 ring-inset" />

            <h3 className="mb-3 text-xl leading-6 font-bold text-white">
              <LinkInternal prefetch={true} href={`/blog/public/${post.slug}`}>
                <span className="absolute inset-0" />
                {post.title}
              </LinkInternal>
            </h3>
            <div className="flex flex-col gap-y-1 overflow-hidden text-sm leading-6 text-zinc-300">
              <time dateTime={post.datetime} className="mr-8 block">
                {post.date}
              </time>
              <div className="flex items-center gap-x-4">
                <div className="flex gap-x-0">
                  <AuthorImages authors={post.authors} />
                  <div className="flex items-center justify-center">
                    {post.authors[0]?.name}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="relative -top-16 md:top-0">
      <SiteContentContainer className="max-w-6xl">
        <div className="mx-auto py-6 md:p-8 lg:py-10">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
            <div className="flex-1 space-y-4">
              <h1 className="font-heading inline-block text-4xl tracking-tight lg:text-5xl">
                X7 Blog
              </h1>
              <p className="text-muted-foreground text-xl">
                centralizing the best content on decentralized finance in one
                place.
              </p>
            </div>
          </div>
          <hr className="my-8" />

          <Suspense fallback={<Splash />}>
            <BlogPostsList />
          </Suspense>

          <Assistance title="Looking to get in touch with the DAO?" />
        </div>
      </SiteContentContainer>
    </div>
  );
}
