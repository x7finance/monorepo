import { cookies } from "next/headers"
import { Suspense, type ReactNode } from "react"
import { cookieToInitialState } from "wagmi"

import { X7Logo, Xchange } from "@x7/icons"
import { LinkInternal } from "@x7/ui/link"
import { Splash } from "@x7/ui/splash"
import { SiteDataFooter } from "~/lib/components/core/site-data-footer"
import { baseConfig } from "~/lib/config/web3"
import { AppProviders } from "~/lib/providers/app"

import { ClawLendBanner } from "./_components/clawlend-banner"
import { BackgroundColorHue } from "./_components/layout-bg-hue"
import { MainNav } from "./_components/main-nav"

async function XchangeContent({ children }: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    baseConfig,
    (await cookies()).get("cookie")?.value
  )

  return (
    <AppProviders initialState={initialState}>
      <div className="h-full">
        <div className="flex min-h-dvh flex-col">
          <div className="fixed top-0 right-0 left-0 z-100">
            <ClawLendBanner />
          </div>
          <nav className="fixed top-12 right-0 left-0 z-100 flex h-12 items-center border-b border-zinc-300 bg-zinc-50 px-4 sm:h-16 md:px-8 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mr-4 items-center lg:mr-8">
              <LinkInternal prefetch={true} href="/">
                <Xchange className="fill-foreground mr-0 hidden h-6 w-auto md:flex" />
                <X7Logo className="fill-foreground h-6 w-auto md:hidden" />
              </LinkInternal>
            </div>
            <MainNav />
          </nav>

          <main className="flex-1">
            <div className="relative ml-0 flex flex-auto flex-col 2xl:flex 2xl:items-center">
              <div className="mt-28 mb-8 w-full sm:mt-32">
                <BackgroundColorHue />
                {children}
              </div>
            </div>
          </main>

          <SiteDataFooter />
        </div>
      </div>
    </AppProviders>
  )
}

export default function XchangeLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Splash />}>
      <XchangeContent>{children}</XchangeContent>
    </Suspense>
  )
}
