/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { Card } from "@x7/ui/card"

export function TokenInfoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[200px] animate-pulse rounded-lg bg-gray-200" />

      <div className="flex items-start gap-6">
        <div className="relative -mt-12 h-24 w-24 animate-pulse rounded-full border-4 border-white bg-gray-200" />

        <div className="flex-1 space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-sm bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded-sm bg-gray-200" />
        </div>

        <div className="text-right">
          <div className="h-8 w-32 animate-pulse rounded-sm bg-gray-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded-sm bg-gray-200" />
        </div>
      </div>

      <div className="h-20 animate-pulse rounded-sm bg-gray-200" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["card-a", "card-b", "card-c"].map((cardKey) => (
          <Card key={cardKey} className="p-4">
            <div className="h-4 w-24 animate-pulse rounded-sm bg-gray-200" />
            <div className="mt-2 h-6 animate-pulse rounded-sm bg-gray-200" />
          </Card>
        ))}
      </div>
    </div>
  )
}

export function TradingViewSkeleton() {
  return <div className="h-[400px] animate-pulse rounded-lg bg-gray-200" />
}

export function TradingHistorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-sm bg-gray-200" />
      <div className="space-y-2">
        {["h-1", "h-2", "h-3", "h-4", "h-5"].map((hKey) => (
          <div
            key={hKey}
            className="h-12 animate-pulse rounded-sm bg-gray-200"
          />
        ))}
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-sm bg-gray-200" />
      <div className="h-[500px] animate-pulse rounded-lg bg-gray-200" />
      <div className="flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-sm bg-gray-200" />
        <div className="h-10 w-20 animate-pulse rounded-sm bg-gray-200" />
      </div>
    </div>
  )
}
