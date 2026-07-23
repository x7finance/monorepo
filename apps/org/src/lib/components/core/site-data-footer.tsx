import { Telegram, Twitter, Warpcast } from "@x7/icons"
import { LinkExternal } from "@x7/ui/link"
import { SocialsEnum } from "@x7/utils"

import { MirroredSites } from "./mirrored-sites"
import {
  FooterBlockNumber,
  FooterGwei,
  FooterNativePrice,
  FooterNews,
  FooterSettingsButton,
} from "./site-data-footer-secondary"

export function SiteDataFooter() {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-60 hidden h-[40px] w-full border-t border-zinc-300 bg-zinc-50 md:block dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex h-full justify-between">
        <div className="flex text-left">
          <div className="flex items-center border-r border-zinc-300 px-4 dark:border-zinc-700">
            <div id="live-data-container" className="flex items-center">
              <span
                className="relative flex h-5 w-5 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-600 [animation-duration:2s]" />
                <span className="relative block h-1 w-1 rounded-full bg-emerald-700" />
              </span>
              <span className="mr-3 ml-1 text-xs text-black dark:text-white">
                Live Data
              </span>
              <MirroredSites />
            </div>
          </div>
          <div className="flex items-center px-4">
            <div id="statsNotch" className="relative z-50 flex w-full">
              <div className="relative flex h-8 flex-auto overflow-hidden">
                <ul className="flex items-center justify-center">
                  <li className="mt-0 mr-2 mb-0 text-xs whitespace-nowrap last:mr-0">
                    <div className="" data-state="closed">
                      <div className="flex items-center justify-center gap-x-1">
                        <span className="text-muted-foreground mr-1 text-[10px] uppercase">
                          Block
                        </span>
                        <FooterBlockNumber />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center border-l border-zinc-300 px-4 dark:border-zinc-700">
            <div className="flex items-center">
              <div className="relative flex h-8 flex-auto items-center overflow-hidden">
                <ul className="flex items-center justify-center">
                  {[
                    {
                      label: (
                        <>
                          <Telegram className="ml-auto h-4 w-4 fill-black dark:fill-zinc-400" />
                        </>
                      ),
                      href: SocialsEnum.telegram,
                    },
                    {
                      label: (
                        <>
                          <Twitter className="ml-auto h-4 w-4 fill-black dark:fill-zinc-400" />
                        </>
                      ),
                      href: SocialsEnum.twitter,
                    },
                    {
                      label: (
                        <>
                          <Warpcast className="ml-auto h-4 w-4 fill-black dark:fill-zinc-400" />
                        </>
                      ),
                      href: SocialsEnum.warpcast,
                    },
                  ].map((item) => (
                    <li className="pr-2" key={item.href}>
                      <LinkExternal
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground text-sm"
                      >
                        {item.label}
                      </LinkExternal>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <FooterNews />
        <div className="flex text-right">
          <div className="flex items-center border-r border-zinc-300 px-4 dark:border-zinc-700">
            <div className="flex items-center">
              <div className="relative flex h-8 flex-auto items-center overflow-hidden">
                <ul className="flex items-center justify-center">
                  <FooterNativePrice />
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center border-r border-zinc-300 px-4 dark:border-zinc-700">
            <div className="flex items-center">
              <div className="relative flex h-8 flex-auto overflow-hidden">
                <ul className="flex items-center justify-center">
                  <li className="mt-0 mb-0 flex items-center text-xs whitespace-nowrap last:mr-0 lg:mr-4">
                    <span className="text-muted-foreground mr-1 text-[10px] uppercase">
                      GWEI
                    </span>
                    <div>
                      <div className="w-8 tracking-tight text-black dark:text-white">
                        <FooterGwei />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mr-8 flex items-center hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <div className="flex items-center">
              <FooterSettingsButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
