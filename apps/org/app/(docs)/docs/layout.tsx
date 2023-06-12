import { AppHeader } from "@/components/app-header"
import { SiteFooter } from "@/components/site-footer"

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
      <SiteFooter className="border-t dark:border-gray-800 border-gray-200  dark:bg-black bg-white" />
    </div>
  )
}
