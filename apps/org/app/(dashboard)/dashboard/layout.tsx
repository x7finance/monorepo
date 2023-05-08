import { DashboardHeader } from "@/components/dashboard-header"
import { SiteFooter } from "@/components/site-footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-[#fafafa] dark:bg-[#111111]">
      <DashboardHeader />
      <div className="dashboard-container">
        <div className="py-16 flex-1">{children}</div>
      </div>
      <SiteFooter className="border-t dark:border-gray-800 border-gray-200  dark:bg-black bg-white" />
    </div>
  )
}
