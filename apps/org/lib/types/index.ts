export const DocsTypes = {
  onchains: "onchains",
  whitepaper: "whitepaper",
  faq: "faq",
  integration: "integration",
  guides: "guides",
} as const

export type DocType = (typeof DocsTypes)[keyof typeof DocsTypes]
