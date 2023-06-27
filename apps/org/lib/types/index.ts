export const DocsTypes = {
  onchains: "onchains",
  whitepaper: "whitepaper",
  faq: "faq",
  integration: "integration",
  guides: "guides",
  breakdowns: "breakdowns",
} as const

export type DocType = (typeof DocsTypes)[keyof typeof DocsTypes]

export const BlogsTypes = {
  posts: "posts",
} as const

export type BlogType = (typeof BlogsTypes)[keyof typeof BlogsTypes]
