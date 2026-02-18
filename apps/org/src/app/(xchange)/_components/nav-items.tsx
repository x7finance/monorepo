/* oxlint-disable @typescript-eslint/no-unsafe-enum-comparison */

"use client"

import type { Route } from "next"
import type { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@x7/css"
import { LinkInternal } from "@x7/ui/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuItemWithMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@x7/ui/navigation-menu"
import { getRandomPioneerNumber } from "@x7/utils"
import { XchangeLinks } from "~/types/links"

export const DESKTOP_XCHANGE_NAV = [
  {
    href: XchangeLinks.Swap,
    title: "Swap",
  },
  {
    href: XchangeLinks.Liquidity,
    title: "Liquidity",
  },
  {
    href: XchangeLinks.Lending,
    title: "Lending",
  },
  {
    href: XchangeLinks.Fund,
    title: "Fund",
  },
  {
    href: XchangeLinks.About,
    title: "About",
  },
] satisfies { href: Route; title: string }[]

export function NavItems() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === XchangeLinks.Swap) return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <LinkInternal
              prefetch={true}
              href={XchangeLinks.Swap}
              className={cn(
                navigationMenuTriggerStyle(),
                isActive(XchangeLinks.Swap) && "text-foreground"
              )}
            >
              Swap
            </LinkInternal>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItemWithMenu>
          <NavigationMenuTrigger
            className={cn(
              isActive(XchangeLinks.Liquidity) && "text-foreground"
            )}
          >
            Liquidity
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-0 border-none shadow-none ring-0">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <LinkInternal
                    prefetch={true}
                    className="group border-accent/10 from-muted/50 to-muted hover:border-muted-foreground relative flex h-full w-full flex-col justify-end overflow-hidden rounded-lg border bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-150 select-none focus:shadow-md"
                    href={XchangeLinks.Liquidity}
                  >
                    <div className="absolute inset-0 z-10 bg-linear-to-b from-black/50 to-black"></div>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png')`,
                      }}
                    ></div>
                    <div className="relative z-20">
                      <div className="font-heading mt-4 mb-2 text-lg">
                        X7 Liquidity
                        <span className="ml-1 opacity-0 transition-all group-hover:opacity-50">
                          &rarr;
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Powering the micro-cap blockchain markets - leverage our
                        liquidity to launch your project or earn fees.
                      </p>
                    </div>
                  </LinkInternal>
                </NavigationMenuLink>
              </li>
              <ListItem href={XchangeLinks.Liquidity} title="Pools">
                Explore and manage liquidity pools on X7.
              </ListItem>
              <ListItem
                href={`${XchangeLinks.Liquidity}?tab=add`}
                title="Create Position"
              >
                Create a new liquidity position to earn fees.
              </ListItem>
              <ListItem
                href={"/docs/guides/liquidity-pools"}
                title="Liquidity on X7"
              >
                Overview of how liquidity works within the X7 Finance protocol.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItemWithMenu>
        <NavigationMenuItemWithMenu>
          <NavigationMenuTrigger
            className={cn(isActive(XchangeLinks.Lending) && "text-foreground")}
          >
            Lending
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <LinkInternal
                    prefetch={true}
                    className="group border-accent/10 from-muted/50 to-muted hover:border-muted-foreground relative flex h-full w-full flex-col justify-end overflow-hidden rounded-lg border bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-150 select-none focus:shadow-md"
                    href={XchangeLinks.Lending}
                  >
                    <div className="absolute inset-0 z-10 bg-linear-to-b from-black/50 to-black"></div>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png')`,
                      }}
                    ></div>
                    <div className="relative z-20">
                      <div className="font-heading mt-4 mb-2 text-lg">
                        X7 Lending
                        <span className="ml-1 opacity-0 transition-all group-hover:opacity-50">
                          &rarr;
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Decentralized lending platform. Secure loans,
                        competitive rates, and flexible terms on the X7 Finance
                        ecosystem.
                      </p>
                    </div>
                  </LinkInternal>
                </NavigationMenuLink>
              </li>
              <ListItem href={XchangeLinks.Lending} title="Loans">
                View and manage existing loans on X7.
              </ListItem>
              <ListItem
                href={`${XchangeLinks.Lending}?tab=initiate-loan`}
                title="Initiate Loan"
              >
                Fund your LP with our industry leading rates.
              </ListItem>
              <ListItem
                href="/docs/guides/initiate-loan"
                title="Lending on Xchange"
              >
                Learn about how you can bootstrap your LP.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItemWithMenu>
        <NavigationMenuItemWithMenu>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/about" title="X7 Overview">
                Get an introduction to X7 and its ecosystem.
              </ListItem>
              <ListItem href="/tokens" title="Tokens">
                Learn about X7's native tokens and their utilities.
              </ListItem>
              <ListItem href="/docs/whitepaper" title="Protocol">
                Understand the X7 protocol and its innovative features.
              </ListItem>
              <ListItem href="/docs" title="Docs">
                Access comprehensive documentation for X7.
              </ListItem>
              <ListItem href="/dashboard/marketplace" title="NFTs">
                Explore X7's NFT offerings and their benefits.
              </ListItem>
              <ListItem href="/getstarted" title="Get Started">
                A guide to help you begin your journey with X7.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItemWithMenu>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <LinkInternal
          prefetch={true}
          ref={ref}
          href={props.href as LinkProps["href"]}
          className={cn(
            "group hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground block space-y-1 rounded-lg p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">
            <span className="font-heading">{title}</span>
            <span className="ml-1 opacity-0 transition-all group-hover:opacity-50">
              &rarr;
            </span>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </LinkInternal>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
