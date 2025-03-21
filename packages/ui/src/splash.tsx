import type { FC, ReactNode } from "react";
import React from "react";

import { X7Logo } from "@x7/icons";

const Splash: FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="absolute left-[calc(50%-20px)] top-[calc(50%-20px)]">
        <div className="absolute h-[50px] w-[50px] animate-pulse">
          <X7Logo className="h-20 w-20 fill-emerald-300 stroke-emerald-600 stroke-1 text-white" />
        </div>
      </div>
    </div>
  );
};

const SplashController: FC<{ children: ReactNode; show?: boolean }> = ({
  children,
  show = false,
}) => {
  return <>{show ? <Splash /> : children}</>;
};

export { Splash, SplashController };
