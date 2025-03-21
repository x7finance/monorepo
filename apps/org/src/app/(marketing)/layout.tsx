import { SiteFooter } from "~/lib/components/core/site-footer";
import { SiteHeader } from "~/lib/components/core/site-header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout(props: MarketingLayoutProps) {
  return (
    <div className="relative isolate">
      <div className="backdrop-blur-nav header-tb-gradient dark:header-tb-black sticky top-0 z-10 flex w-full max-w-full justify-center">
        <SiteHeader className="mt-5 flex w-[1200px] items-center px-6 pb-3 text-white lg:pb-0 dark:text-white" />
      </div>
      <div className="relative mx-auto px-2 sm:px-6 lg:px-8">
        <main className="flex-1 pt-12 pb-24">{props.children}</main>
      </div>
      <SiteFooter className="border-muted border-t bg-[#fafafa] dark:bg-[#111111]" />
    </div>
  );
}
