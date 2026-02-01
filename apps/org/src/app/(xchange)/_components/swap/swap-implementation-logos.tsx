/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import type { FC } from "react";

import { cn } from "@x7/css";
import { Aerodrome, PancakeSwap, SushiSwap, Uniswap, Xchange } from "@x7/icons";
import { Implementation, Protocol } from "@x7/utils";

interface ImplementationIconProps {
  implementation: Implementation | Protocol.MIXED;
  className?: string;
  classNameOverrides?: Partial<Record<Implementation | Protocol.MIXED, string>>;
}

const defaultClasses = {
  [Implementation.AERODROME]: "text-white/70",
  [Implementation.UNISWAP]: "text-pink-500",
  [Implementation.PANCAKESWAP]: "text-zinc-400",
  [Implementation.XCHANGE]: "dark:text-white",
  [Implementation.SUSHISWAP]: "",
};

export const ImplementationIcon: FC<ImplementationIconProps> = ({
  implementation,
  className,
  classNameOverrides = {},
}) => {
  const getIcon = () => {
    const defaultClass =
      defaultClasses[implementation as keyof typeof defaultClasses] || "";
    // @ts-expect-error: todo fix
    const overrideClass = classNameOverrides[implementation] ?? "";
    const combinedClass = cn("w-auto", defaultClass, overrideClass, className);

    switch (implementation) {
      case Implementation.AERODROME:
        return <Aerodrome className={combinedClass} />;
      case Implementation.UNISWAP:
        return <Uniswap className={combinedClass} />;
      case Implementation.PANCAKESWAP:
        return <PancakeSwap className={combinedClass} />;
      case Implementation.XCHANGE:
        return <Xchange className={combinedClass} />;
      case Implementation.SUSHISWAP:
        return <SushiSwap className={combinedClass} />;
      case Protocol.MIXED:
        return <span className={combinedClass}>Mixed Pools</span>;
      // Uncomment if needed
      // case Implementation.OXL:
      //   return <Image width={100} height={15} src="/images/0xl.png" alt="Oxl" className={combinedClass} />;
      default:
        return null;
    }
  };

  return getIcon();
};
