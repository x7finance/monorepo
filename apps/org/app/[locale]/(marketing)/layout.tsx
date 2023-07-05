import { SiteFooter } from "@/site-components/site-footer"
import { SiteHeader } from "@/site-components/site-header"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout(props: MarketingLayoutProps) {
  return (
    <div>
      <div className="header-tb-gradient dark:header-tb-black sticky top-0 z-10 flex w-full max-w-full justify-center">
        <SiteHeader className="mt-5 flex w-[1200px] items-center px-6 pb-3 text-white dark:text-white lg:pb-0" />
      </div>
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <main className="flex-1 py-24">{props?.children}</main>
      </div>
      <SiteFooter className="border-t border-gray-200 bg-[#fafafa]  dark:border-gray-800 dark:bg-[#111111]" />
    </div>
  )
}
