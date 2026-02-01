import { DashboardHeader } from "~/lib/components/core/dashboard-header"
import { SiteFooter } from "~/lib/components/core/site-footer"
import { AppProviders } from "~/lib/providers/app"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppProviders>
      <div className="bg-[#fafafa] dark:bg-[#111111]">
        <DashboardHeader />
        <div className="dashboard-container">
          <div className="flex-1 pb-10 sm:py-10">{children}</div>
        </div>
        <SiteFooter className="border-t border-border bg-white dark:bg-black" />
      </div>
    </AppProviders>
  )
}
