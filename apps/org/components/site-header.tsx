import { X7LongLogo } from "icons"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { MobileNavigation } from "./mobile-navigation"

export function SiteHeader({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header className={className}>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full">
          <Link href="/">
            <X7LongLogo className="dark:text-white w-48 text-black" />
          </Link>
        </div>
      </div>
      <div className="flex-1 lg:flex justify-center items-center m-0 w-full hidden">
        <nav
          aria-label="Navigation header with 7 links"
          data-orientation="horizontal"
          dir="ltr"
          className="w-full justify-center flex relative items-center"
        >
          <div className="relative">
            <ul
              data-orientation="horizontal"
              className="flex gap-2 grid-gap-2 list-none m-0 p-0"
              dir="ltr"
            >
              <li className="flex items-center align-center">
                <a
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-white"
                  href="/docs"
                >
                  Products
                </a>
              </li>
              <li className="flex items-center align-center">
                <a
                  className=" outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href="/docs"
                >
                  Docs
                </a>
              </li>
              <li className="flex items-center align-center">
                <a
                  className=" outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href="/templates"
                >
                  Examples
                </a>
              </li>
              <li className="flex items-center align-center">
                <a
                  className=" outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href="/integrations"
                >
                  Marketplace
                </a>
              </li>
              <li className="flex items-center align-center">
                <a
                  className=" outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href="/customers"
                >
                  Tokens
                </a>
              </li>
              <li className="flex items-center align-center">
                <a
                  className=" outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href="/enterprise"
                >
                  DAO
                </a>
              </li>
              <li className="flex items-center align-center">
                <a
                  className=" outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href="/pricing"
                >
                  Trade
                </a>
              </li>
            </ul>
          </div>
          <div
            className="absolute flex justify-center top-full left-0"
            style={{ perspective: "2000px" }}
          />
        </nav>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="ml-auto">
          <div className="flex items-center text-sm w-full gap-2">
            <Button className="hidden lg:block">
              <svg
                className="w-24"
                viewBox="0 0 642 166"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M168.999 3.79239L48.5871 165.601H0V161.809L95.7658 31.9193H73.9369L47.5308 66.0509L0.704161 5.05652V0H168.999V3.79239Z"
                  fill="currentColor"
                />
                <path
                  d="M120.765 96.0808L95.0633 130.528L120.413 165.608H169V161.816L120.765 96.0808Z"
                  fill="currentColor"
                />
                <path
                  d="M218.72 118.832C221.931 118.832 224.656 118.309 226.896 117.264C229.211 116.144 231.077 114.688 232.496 112.896C233.989 111.029 235.072 108.939 235.744 106.624C236.491 104.235 236.864 101.733 236.864 99.12V97.776H246.272V99.12C246.272 103.077 245.675 106.811 244.48 110.32C243.285 113.755 241.531 116.779 239.216 119.392C236.901 121.931 234.027 123.947 230.592 125.44C227.157 126.859 223.2 127.568 218.72 127.568C210.059 127.568 203.301 124.843 198.448 119.392C193.595 113.941 191.168 105.989 191.168 95.536V78.064C191.168 67.9093 193.595 60.032 198.448 54.432C203.301 48.832 210.059 46.032 218.72 46.032C223.2 46.032 227.157 46.7787 230.592 48.272C234.027 49.6907 236.901 51.7067 239.216 54.32C241.531 56.8587 243.285 59.8827 244.48 63.392C245.675 66.8267 246.272 70.5227 246.272 74.48V75.824H236.864V74.48C236.789 71.9413 236.379 69.4773 235.632 67.088C234.96 64.6987 233.877 62.608 232.384 60.816C230.965 58.9493 229.136 57.4933 226.896 56.448C224.656 55.328 221.931 54.768 218.72 54.768C212.672 54.768 208.117 56.9707 205.056 61.376C202.069 65.7813 200.576 71.568 200.576 78.736V94.864C200.576 102.555 202.069 108.491 205.056 112.672C208.117 116.779 212.672 118.832 218.72 118.832Z"
                  fill="currentColor"
                />
                <path
                  d="M271.954 47.6H281.362V82.32H314.738V47.6H324.146V126H314.738V91.056H281.362V126H271.954V47.6Z"
                  fill="currentColor"
                />
                <path
                  d="M394.628 106.512H361.028L355.316 126H345.236L368.98 47.6H386.676L410.42 126H400.34L394.628 106.512ZM377.156 51.632L363.604 97.776H392.052L378.5 51.632H377.156Z"
                  fill="currentColor"
                />
                <path
                  d="M472.95 121.968H474.294V47.6H483.702V126H464.886L442.262 51.632H440.918V126H431.51V47.6H450.326L472.95 121.968Z"
                  fill="currentColor"
                />
                <path
                  d="M529.88 88.368H564.824V126H556.089V116.592H554.745C553.475 119.877 551.235 122.528 548.024 124.544C544.814 126.56 541.08 127.568 536.824 127.568C528.387 127.568 521.742 124.843 516.888 119.392C512.11 113.941 509.72 105.989 509.72 95.536V78.064C509.72 67.9093 512.147 60.032 517 54.432C521.854 48.832 528.611 46.032 537.272 46.032C541.752 46.032 545.71 46.7787 549.144 48.272C552.579 49.6907 555.454 51.7067 557.768 54.32C560.083 56.8587 561.838 59.8827 563.032 63.392C564.227 66.8267 564.824 70.5227 564.824 74.48V75.824H555.417V74.48C555.417 71.9413 555.043 69.4773 554.297 67.088C553.625 64.6987 552.542 62.608 551.048 60.816C549.63 58.9493 547.763 57.4933 545.448 56.448C543.208 55.328 540.483 54.768 537.272 54.768C531.224 54.768 526.67 56.9707 523.608 61.376C520.622 65.7813 519.128 71.568 519.128 78.736V94.864C519.128 102.555 520.622 108.491 523.608 112.672C526.67 116.779 531.299 118.832 537.496 118.832C543.096 118.832 547.464 117.04 550.6 113.456C553.811 109.872 555.417 104.869 555.417 98.448V97.104H529.88V88.368Z"
                  fill="currentColor"
                />
                <path
                  d="M593.419 47.6H640.907V56.336H602.827V82.32H640.235V91.056H602.827V117.264H641.579V126H593.419V47.6Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
            <MobileNavigation className="lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  )
}
