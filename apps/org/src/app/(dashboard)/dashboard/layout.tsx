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
        <main className="dashboard-container">
          <div className="flex-1 pb-10 sm:py-10">{children}</div>
        </main>
        <SiteFooter className="border-border border-t bg-white dark:bg-black" />
      </div>
    </AppProviders>
  )
}
