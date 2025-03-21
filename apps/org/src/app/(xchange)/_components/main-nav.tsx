import { cn } from "@x7/css";

import { ConnectionComponent } from "~/lib/components/utils/web3-connect-button";
import { MobileNav } from "./mobile-nav";
import { NavItems } from "./nav-items";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex w-full items-center justify-between", className)}
      {...props}
    >
      <div className="hidden items-center md:flex">
        <NavItems />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="ml-auto">
        <ConnectionComponent />
      </div>
    </nav>
  );
}
