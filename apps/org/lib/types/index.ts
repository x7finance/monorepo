export const DocsTypes = {
  onchains: "onchains",
  whitepaper: "whitepaper",
  faq: "faq",
} as const

export type DocType = (typeof DocsTypes)[keyof typeof DocsTypes]
