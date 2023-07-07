import { AppHeader } from "@/site-components/app-header"
import { SiteFooter } from "@/site-components/site-footer"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="bg-[#fafafa] dark:bg-[#111111]">
      <AppHeader />
      <div className="dashboard-container">
        <div className="flex-1">{children}</div>
      </div>
      <SiteFooter className="border-t border-gray-200 bg-white  dark:border-gray-800 dark:bg-black" />
    </div>
  )
}
