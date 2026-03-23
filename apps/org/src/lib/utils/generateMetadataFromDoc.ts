import { env } from "~/env"

export interface MetadataDocType {
  title: string
  seoTitle?: string
  description: string
  section?: string
  slug: string
}

export function generateMetadataFromDoc(doc: MetadataDocType) {
  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/ogi`)

  ogUrl.searchParams.set(
    "heading",
    // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
    doc.seoTitle ?? doc.title ?? "Trust No One. Trust Code. Long Live DeFi."
  )
  ogUrl.searchParams.set("type", doc.section ?? "default")
  ogUrl.searchParams.set("mode", "dark")

  return {
    title: doc.seoTitle ?? doc.title,
    description: doc.description,
    openGraph: {
      title: doc.seoTitle ?? doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(`${doc.slug}`),
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
      title: doc.title,
      description: doc.description,
      images: [ogUrl.toString()],
    },
    alternates: {
      canonical: absoluteUrl(`${doc.slug}`),
    },
  }
}

function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}
