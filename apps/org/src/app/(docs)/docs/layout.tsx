import { DashboardHeader } from "~/lib/components/core/dashboard-header";
import { SiteFooter } from "~/lib/components/core/site-footer";
import { AppProviders } from "~/lib/providers/app";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <AppProviders>
      <div className="bg-[#fafafa] dark:bg-[#111111]">
        <DashboardHeader />
        <div className="dashboard-container">
          <div className="flex-1">{children}</div>
        </div>
        <SiteFooter className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black" />
      </div>
    </AppProviders>
  );
}
