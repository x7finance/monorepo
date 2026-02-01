import Image from "next/image"

import { CircleLoading } from "@x7/ui/circle-loading"
import { getRandomPioneerNumber } from "@x7/utils"

export function LoadingPioneer() {
  return (
    <div className="my-12 text-center">
      <div className="relative mb-4 flex items-center justify-center">
        <Image
          alt={`Random Pioneer Image`}
          height={100}
          width={100}
          src={`https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png`}
          className="h-20 w-20 flex-none rounded-full ring-[2px] ring-zinc-400/20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <CircleLoading size={40} />
        </div>
      </div>
    </div>
  )
}
