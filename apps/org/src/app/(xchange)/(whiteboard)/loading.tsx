import React from "react"

import { Container } from "@x7/ui/container"
import { SkeletonBox } from "@x7/ui/skeleton"

export default function SimpleSwapLoading() {
  return (
    <Container maxWidth="lg" className="">
      <div className="flex flex-col gap-2">
        <div className="mt-2 flex flex-col gap-1 sm:mt-8">
          <SkeletonBox className="h-[53px] w-[140px]" />
        </div>
        <div className="flex gap-3">
          <SkeletonBox className="ml-auto h-[32px] w-[32px]" />
        </div>
        <div className="flex flex-col gap-2">
          <SkeletonBox className="h-[130px] w-full" />
          <SkeletonBox className="h-[130px] w-full" />
          <SkeletonBox className="h-[80px] w-full" />
        </div>
      </div>
    </Container>
  )
}
