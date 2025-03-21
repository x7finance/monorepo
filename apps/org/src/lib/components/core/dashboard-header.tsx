import { cn } from "@x7/css";
import { X7Logo } from "@x7/icons";
import { LinkInternal } from "@x7/ui/link";

import { Search } from "../utils/search-dialog";
import { ConnectionComponent } from "../utils/web3-connect-button";
import { DashboardTabNavigation } from "./dashboard-tab-nav";
import { MobileNavigation } from "./mobile-navigation";

export function DashboardHeader() {
  return (
    <>
      <nav className="sticky z-10 h-14 w-full">
        <div className="fixed bg-white px-3 py-3 lg:px-5 lg:pl-3 dark:bg-black">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "fixed inset-x-0 top-0 flex h-14 items-center justify-between gap-4 bg-white px-4 transition sm:justify-normal md:justify-between lg:left-20 lg:z-30 lg:gap-12 dark:bg-black",
              )}
            >
              <div className="flex lg:hidden">
                <LogoMarkLink />
              </div>
              <Search />
              <div className="flex h-full items-center gap-0 md:gap-5">
                <ConnectionComponent />
                <div className="mr-2 flex sm:hidden">
                  <div className="mx-1">
                    <Search isMobile={true} />
                  </div>
                </div>
                <MobileNavigation className="flex sm:hidden" />
              </div>
            </div>
            <LogoMarkLink />
          </div>
        </div>
      </nav>

      <div className="z-8 w-full bg-white sm:fixed dark:bg-black">
        <DashboardTabNavigation />
      </div>
    </>
  );
}

function LogoMarkLink() {
  return (
    <div className="flex items-center">
      <div className="ml-3 flex items-center">
        <LinkInternal prefetch={true} href="/">
          <X7Logo className="mr-3 h-8 fill-black dark:fill-white" />
        </LinkInternal>
      </div>
    </div>
  );
}
