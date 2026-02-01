import type { IconComponent } from "@x7/ui"
import type { Metadata } from "next"

import { cn } from "@x7/css"
import {
  BookIcon,
  Discord,
  Dune,
  Github,
  Medium,
  Megaphone,
  Reddit,
  SnapshotLogo,
  Telegram,
  Twitter,
  Warpcast,
  X7Logo,
  YouTube,
} from "@x7/icons"
import { LinkExternal } from "@x7/ui/link"
import { SocialsEnum } from "@x7/utils"
import { SiteContentContainer } from "~/lib/components/core/site-content-container"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"
import { MarketingLinks } from "~/types/links"

import { Heading } from "../_components/heading"

const metadata = {
  title: "Community",
  description:
    "Experience the Power of Community at X7 Finance: Our vibrant community is the heart of our DeFi ecosystem. Comprising of passionate crypto enthusiasts, innovative thinkers, and dedicated investors, the X7 Finance community actively contributes to our democratic DAO governance, shares insights, and supports each other in navigating the DeFi landscape. Join us and be part of a community that's shaping the future of decentralized finance.",
  slug: "/community",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function CommunityPage() {
  return (
    <div>
      <Heading
        id={"community"}
        title={"Community"}
        subHeader="One of the best communities in all of DeFi, come say hello"
      />
      <SiteContentContainer>
        <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
          {socials.map((social) => (
            <Social key={social.href} social={social} />
          ))}
        </div>
      </SiteContentContainer>
    </div>
  )
}

function Social({
  social,
}: {
  social: {
    href: string
    icon: IconComponent
    external?: boolean
    name: string
    description: string
    fill?: string
  }
}) {
  return (
    <div
      key={social.href}
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <div className="absolute inset-0 rounded-2xl ring-1 ring-zinc-900/7.5 ring-inset group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pt-12 pb-4">
        <SocialIcon fill={social.fill} icon={social.icon} />
        <h3 className="mt-4 text-sm leading-7 font-semibold text-zinc-900 dark:text-white">
          <LinkExternal
            target={social.external === false ? "" : "_blank"}
            referrerPolicy={"no-referrer"}
            href={social.href}
          >
            <span className="absolute inset-0 rounded-2xl" />
            {social.name}
          </LinkExternal>
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {social.description}
        </p>
      </div>
    </div>
  )
}

function SocialIcon({
  icon: Icon,
  fill,
}: {
  icon: IconComponent
  fill?: string
}) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-violet-300/10 dark:group-hover:ring-white">
      <Icon
        className={cn(
          fill ??
            `fill-zinc-700/10 stroke-zinc-700 dark:fill-white/10 dark:stroke-zinc-400`,
          `h-7 w-7 transition-colors duration-300 group-hover:stroke-zinc-900 dark:group-hover:fill-white dark:group-hover:stroke-white`
        )}
      />
    </div>
  )
}

const socials = [
  {
    href: SocialsEnum.telegram,
    fill: "text-[#0088cc] dark:stroke-white/40",
    name: "Telegram",
    description:
      "The main X7 Finance Telegram channel. Join our active, bold and fearless DeFi community!",
    icon: Telegram,
  },
  {
    href: SocialsEnum.twitter,
    name: "X/Twitter",
    fill: "text-[#1da1f2]",
    description:
      "Follow us on X/Twitter and stay up to date with posts about X7 Finance ecosystem including the latest updates, giveaways, and more.",
    icon: Twitter,
  },
  {
    href: SocialsEnum.discord,
    name: "Discord",
    fill: "text-[#7289da]",
    description:
      "Join us on Discord for a more focused experience by topic. We have a dedicated channel for each topic of discussion.",
    icon: Discord,
  },
  {
    href: SocialsEnum.warpcast,
    name: "Warpcast",
    fill: "text-[#4d2496]",
    description:
      "Follow us on Warpcast - A sufficiently decentralized social network.",
    icon: Warpcast,
  },
  {
    href: SocialsEnum.youtube,
    name: "YouTube",
    fill: "text-[#ff0000]",
    description:
      "Check out our videos and some of our longer-form talks and content on YouTube. Subscribe to our channel to get notified when new videos are available.",
    icon: YouTube,
  },
  {
    href: SocialsEnum.reddit,
    name: "Reddit",
    fill: "text-[#FF5700]",
    description: "Reddit - Dive into X7 Finance!",
    icon: Reddit,
  },
  {
    href: SocialsEnum.github,
    name: "GitHub",
    fill: "fill-[#f4bd03]",
    description: "X7 Finance is open sourced, contribute here!",
    icon: Github,
  },
  {
    href: MarketingLinks.Blog,
    name: "Blog",
    description:
      "The X7 Blog is where you can find longer form content about the X7 Protocol, including history of the protocol, in-depth reviews, and more.",
    icon: BookIcon,
  },
  {
    href: SocialsEnum.medium,
    name: "Medium",
    description: "Explore insightful articles on X7's Medium account.",
    icon: Medium,
  },
  {
    href: SocialsEnum.dune,
    name: "Dune Dashboard",
    fill: "text-[#f4bd03]",
    description: "Track X7 Finance data via Dune - by @Mike_X7F",
    icon: Dune,
  },
  {
    href: SocialsEnum.snapshot,
    name: "Snapshot.org",
    fill: "text-[#f4bd03]",
    description:
      "Have your say on changes to the X7 Ecosystem, hold $X7DAO tokens to vote, or cast advisory proposals if you hold 500k $X7DAO tokens.",
    icon: SnapshotLogo,
  },
  {
    href: SocialsEnum.announcements,
    name: "X7 Telegram Announcements",
    description:
      "A channel for official announcements from the X7 DAO team. Subscribe to get notified when new updates are available.",
    icon: Megaphone,
  },
  {
    href: SocialsEnum.xchangealerts,
    fill: "fill-black dark:fill-white",
    name: "Xchange Alerts",
    description:
      "Xchange's dedicated TG channel, get alerts for all new pairs and loans across all chains!",
    icon: X7Logo,
  },
  {
    href: SocialsEnum.daochat,
    name: "DAO Chat",
    fill: "text-[#0088cc] dark:stroke-white/40",
    description:
      "An exclusive gated Telegram group for holders of X7DAO tokens, Talk about your ideas for proposals",
    icon: Telegram,
  },
]
