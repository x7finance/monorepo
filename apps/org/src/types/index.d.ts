/* oxlint-disable @typescript-eslint/no-explicit-any */
export interface SiteConfig {
  name: string
  description: string
  url: string
  links: {
    twitter: string
    github: string
  }
}

declare module "big.js"

export interface SectionType {
  id: string
  title: string
  children: SectionType[]
}

export interface UtilityNftType {
  contract: `0x${string}`
  slug: string
  name: string
  price: string
  description: string
  objective: string
  benefits: string[]
  maxMint: number
  denomination?: Partial<Record<ChainId, string>>
  exchanges: Partial<Record<ChainId, string>>
}

declare module "*.png" {
  const value: any
  export default value
}
