import { SiteFooter } from "@/site-components/site-footer"
import { SiteHeader } from "@/site-components/site-header"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout(props: MarketingLayoutProps) {
  return (
    <div>
      <div className="sticky top-0 flex justify-center w-full max-w-full z-10 header-tb-gradient dark:header-tb-black">
        <SiteHeader className="flex items-center px-6 pb-3 lg:pb-0 mt-5 w-[1200px] text-white dark:text-white" />
      </div>
      <div className="relative px-4 sm:px-6 lg:px-8 mx-auto">
        <main className="py-24 flex-1">{props?.children}</main>
      </div>
      <SiteFooter className="border-t dark:border-gray-800 border-gray-200  dark:bg-[#111111] bg-[#fafafa]" />
    </div>
  )
}
