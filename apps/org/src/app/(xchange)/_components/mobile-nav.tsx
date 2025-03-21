"use client";

import { useState } from "react";
import type { Route } from "next";

import {
  ChevronDownIcon,
  Discord,
  Github,
  Telegram,
  TextIcon,
  Twitter,
  Warpcast,
  X7Logo,
} from "@x7/icons";
import { Collapsible } from "@x7/ui/collapsible";
import { Drawer, DrawerContent, DrawerTrigger } from "@x7/ui/drawer";
import { LinkExternal, LinkInternal } from "@x7/ui/link";
import { SocialsEnum } from "@x7/utils";

import {
  DashboardLinksEnum,
  DocsLinks,
  MarketingLinks,
  NftsLinkEnum,
  TokenLinksEnum,
  XchangeLinks,
} from "~/types/links";

export const MOBILE_XCHANGE_NAV = [
  {
    href: XchangeLinks.Swap,
    title: "Swap",
  },
  {
    href: XchangeLinks.Liquidity,
    img: "/images/pioneers/2.png",
    title: "Liquidity",
  },
  {
    href: XchangeLinks.Lending,
    img: "/images/pioneers/3.png",
    title: "Lending",
  },
  {
    href: XchangeLinks.Fund,
    img: "/images/pioneers/1.png",
    title: "Fund",
  },
  {
    href: "",
    title: "More",
  },
] satisfies {
  href: Route;
  title: string | React.JSX.Element;
  img?: string;
}[];

const navSections = [
  {
    title: "Liquidity",
    items: [
      { label: "All Pools", href: XchangeLinks.Liquidity },
      {
        label: "My Positions",
        href: `${XchangeLinks.Liquidity}?tab=my-open-positions`,
      },
      { label: "Create Position", href: `${XchangeLinks.Liquidity}?tab=add` },
    ],
  },
  {
    title: "Lending",
    items: [
      { label: "All Loans", href: XchangeLinks.Lending },
      {
        label: "My Open Loans",
        href: `${XchangeLinks.Lending}?tab=my-open-loans`,
      },
      {
        label: "Initiate Loan",
        href: `${XchangeLinks.Lending}?tab=initiate-loan`,
      },
      {
        label: "Loan Terms",
        href: `${XchangeLinks.Lending}?tab=loan-terms`,
      },
      {
        label: "Lending Pool",
        href: `${XchangeLinks.Lending}?tab=lending-pool`,
      },
    ],
  },
  {
    title: "Fund",
    items: [{ label: "Fund Lending", href: XchangeLinks.Fund }],
  },
  {
    title: "About",
    items: [
      { label: "About X7", href: XchangeLinks.About },
      { label: "Explore Docs", href: DocsLinks.Index },
      { label: "Lending", href: XchangeLinks.Lending },
      { label: "Utility NFTs", href: NftsLinkEnum.Index },
      { label: "Read Whitepaper", href: DocsLinks.Whitepaper },
      { label: "Blog", href: MarketingLinks.Blog },
      { label: "Dashboard", href: DashboardLinksEnum.Index },
      { label: "X7 Tokens", href: TokenLinksEnum.Index },
    ],
  },
];

export function MobileNav() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeDrawer = () => setIsOpen(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="flex items-center justify-center">
        <TextIcon className="text-muted-foreground h-6 w-6" />
        <ChevronDownIcon className="text-muted-foreground h-3 w-3" />
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="space-y-4 p-4">
          <div>
            <div className="flex w-full items-center justify-between text-lg">
              <X7Logo className="fill-foreground text-foreground h-6 w-6" />
            </div>
            <div className="mt-2 space-y-1">
              <LinkInternal
                prefetch={true}
                href={XchangeLinks.Swap}
                className="text-muted-foreground ml-2 block"
                onClick={closeDrawer}
              >
                Trade
              </LinkInternal>
              <LinkInternal
                prefetch={true}
                href={`${XchangeLinks.Lending}?tab=initiate-loan`}
                className="text-muted-foreground ml-2 block"
                onClick={closeDrawer}
              >
                Initiate Loan
              </LinkInternal>
              <LinkInternal
                prefetch={true}
                href={XchangeLinks.Fund}
                className="text-muted-foreground ml-2 block"
                onClick={closeDrawer}
              >
                Fund Lending
              </LinkInternal>
            </div>
          </div>
          {navSections.map((section) => (
            <div key={section.title}>
              <button
                className="flex w-full items-center justify-between text-lg"
                onClick={() =>
                  setOpenSection(
                    openSection === section.title ? null : section.title,
                  )
                }
              >
                <span className="font-heading">{section.title}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <Collapsible
                open={openSection === section.title}
                className="mt-2 space-y-1"
              >
                {section.items.map((item) => (
                  <LinkInternal
                    prefetch={true}
                    key={item.label}
                    href={item.href}
                    onClick={closeDrawer}
                    className="text-muted-foreground ml-2 block"
                  >
                    {item.label}
                  </LinkInternal>
                ))}
              </Collapsible>
            </div>
          ))}

          <div className="text-muted-foreground mt-4 flex justify-center space-x-4">
            {[
              {
                label: "Telegram",
                href: SocialsEnum.telegram,
                icon: Telegram,
              },
              {
                label: "Twitter X",
                href: SocialsEnum.twitter,
                icon: Twitter,
              },
              {
                label: "Warpcast",
                href: SocialsEnum.warpcast,
                icon: Warpcast,
              },
              { label: "Discord", href: SocialsEnum.discord, icon: Discord },
              { label: "GitHub", href: SocialsEnum.github, icon: Github },
            ].map((item) => (
              <LinkExternal
                key={`${item.href}-sub-nav-socials`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2 font-medium"
              >
                <item.icon className="h-5 w-5" />
              </LinkExternal>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
