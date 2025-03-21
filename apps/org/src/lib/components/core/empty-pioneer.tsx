import Image from "next/image";

import { getRandomPioneerNumber } from "@x7/utils";

export function EmptyPioneer({
  message,
  secondaryMessage,
}: {
  message: string;
  secondaryMessage?: string;
}) {
  return (
    <div className="my-12 text-center">
      <div className="mb-4 flex items-center justify-center">
        <Image
          alt="Random Pioneer Image"
          height={100}
          width={100}
          src={`https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png`}
          className="h-20 w-20 flex-none rounded-full ring-[2px] ring-zinc-400/20"
        />
      </div>
      <p className="font-heading text-xl font-medium text-muted-foreground">
        {message}
      </p>
      <p className="mt-2 text-zinc-400 dark:text-zinc-600">
        {secondaryMessage ?? "Trust No One, Trust Code."}
      </p>
    </div>
  );
}
