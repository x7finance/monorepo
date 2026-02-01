/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Card } from "@x7/ui/card";

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
        {[...Array(3)].map((_, i) => (
          <Card key={`card-skeleton-${i}`} className="p-4">
            <div className="h-4 w-24 animate-pulse rounded-sm bg-gray-200" />
            <div className="mt-2 h-6 animate-pulse rounded-sm bg-gray-200" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TradingViewSkeleton() {
  return <div className="h-[400px] animate-pulse rounded-lg bg-gray-200" />;
}

export function TradingHistorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-sm bg-gray-200" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={`history-skeleton-${i}`} className="h-12 animate-pulse rounded-sm bg-gray-200" />
        ))}
      </div>
    </div>
  );
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
  );
}
