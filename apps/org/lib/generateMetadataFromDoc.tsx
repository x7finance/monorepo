import { env } from "@/env.mjs"

export function generateMetadataFromDoc(doc) {
  const url = process.env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/og`)

  ogUrl.searchParams.set("heading", doc?.seoTitle ?? doc?.title)
  ogUrl.searchParams.set("type", doc?.section)
  ogUrl.searchParams.set("mode", "dark")

  console.log("title: ", doc?.title)
  console.log("description: ", doc?.description)

  return {
    title: doc?.seoTitle ?? doc?.title,
    description: doc?.description,
    openGraph: {
      title: doc?.seoTitle ?? doc?.title,
      description: doc?.description,
      type: "article",
      url: absoluteUrl(`${doc?.slug}`),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: doc.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc?.title,
      description: doc?.description,
      images: [ogUrl.toString()],
    },
  }
}

function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}
