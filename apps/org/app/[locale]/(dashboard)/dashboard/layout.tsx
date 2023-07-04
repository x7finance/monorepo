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
        <div className="sm:py-10 pb-10 flex-1">{children}</div>
      </div>
      <SiteFooter className="border-t dark:border-gray-800 border-gray-200  dark:bg-black bg-white" />
    </div>
  )
}
