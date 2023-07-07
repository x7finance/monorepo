import { AppHeader } from "@/site-components/app-header"
import { SiteFooter } from "@/site-components/site-footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-[#fafafa] dark:bg-[#111111]">
      <AppHeader />
      <div className="dashboard-container">
        <div className="flex-1 pb-10 sm:py-10">{children}</div>
      </div>
      <SiteFooter className="border-t border-gray-200 bg-white  dark:border-gray-800 dark:bg-black" />
    </div>
  )
}
