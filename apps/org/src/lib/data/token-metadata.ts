import { SocialsEnum } from "@x7/utils"

interface TokenMetadata {
  address: string
  banner?: string | null
  logo?: string | null
  description?: string
  telegram?: string
  twitter?: string
  website?: string
}

export const tokenMetadata: TokenMetadata[] = [
  {
    address: "0xa65A6d613BCFE5E29ce0dE33D0870f68cA175Be5",
    banner: "/tokens/supsers/supers-banner.jpg",
    logo: "/tokens/supsers/logo-supers.png",
    description: "the S we've all drawn and are now buying on BASE",
    telegram: "https://t.me/supersbaseportal",
    twitter: "https://x.com/supersbase",
    website: "https://x.com/supersbase",
  },
  {
    address: "0x5cbc213691E0B5b7572d86c5127dB845112Cffb9",
    banner: "/tokens/pinky/banner.jpg",
    logo: "/tokens/pinky/logo.avif",
    description:
      "$PINKY is a meme tribute to the legendary domestic shorthair, “Pinky the Cat”. In the early 1990s, Pinky was featured as the “Pet of the Week” on a Placer County, CA Animal Control TV spot. What started out as a an innocent introduction quickly escalated into utter chaos. And a star was born…",
    telegram: "https://t.me/pinkybase",
    twitter: "https://x.com/pinkythecat_",
    website: "https://www.pinkythecat.online/",
  },
  {
    address: "0x0E39c6DCB775a3Bd10125C0d3d29b6d060658F86",
    banner: "/tokens/kiwi/banner.png",
    logo: "/tokens/kiwi/logo.jpg",
    description:
      "💚 Embrace a purrfect adventure! Cats & Kiwis are both symbols of sweetness that captivate instantly! Just the velvety skin of kiwi, cat's fur to be stroked, and what about their vibrant colors? They bring a touch of freshness and joy to our everyday lives!",
    telegram: "https://t.me/KTC_KiwiTheCat",
    twitter: "https://x.com/KTC_KiwiTheCat",
    website: "https://www.kiwithecat.tech/",
  },
  {
    address: "0x70008f18fc58928dce982b0a69c2c21ff80dca54",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7d.png",
  },
  {
    address: "0x7105e64bf67eca3ae9b123f0e5ca2b83b2ef2da0",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7dao.png",
  },
  {
    address: "0x7101a9392eac53b01e7c07ca3baca945a56ee105",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7101.png",
  },
  {
    address: "0x7102dc82ef61bfb0410b1b1bf8ea74575bf0a105",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7102.png",
  },
  {
    address: "0x7103ebdbf1f89be2d53eff9b3cf996c9e775c105",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7103.png",
  },
  {
    address: "0x7104d1f179cc9cc7fb5c79be6da846e3fbc4c105",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7104.png",
  },
  {
    address: "0x7105faa4a26ed1c67b8b2b41bec98f06ee21d105",
    telegram: SocialsEnum.telegram,
    twitter: SocialsEnum.twitter,
    logo: "https://assets.x7finance.org/images/tokens/x7105.png",
  },
]

export function getTokenMetadata(address: string): TokenMetadata | undefined {
  return tokenMetadata.find(
    (metadata) => metadata.address.toLowerCase() === address.toLowerCase()
  )
}
