import Image from "next/image";

import { cn } from "@x7/css";

export function PioneerDrop(props: {
  pioneerId?: string;
  lineColor: string;
  height?: number;
}) {
  const { pioneerId, lineColor, height = 100 } = props;

  return (
    <div className="mb-6">
      <span
        style={{ height }}
        className={cn(
          lineColor,
          `pioneer-line-drop mx-auto block w-[1px] bg-linear-to-b`,
        )}
      />
      {pioneerId && (
        <Image
          height={200}
          width={200}
          className="mx-auto h-auto w-12 overflow-hidden rounded-full shadow-xs ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
          src={`https://assets.x7finance.org/pioneers/${pioneerId}.png`}
          alt="Random Pioneer Image"
        />
      )}
    </div>
  );
}
