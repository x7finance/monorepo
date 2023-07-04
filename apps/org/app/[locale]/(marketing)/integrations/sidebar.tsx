import { Button } from "@x7/ui"
import { cn } from "@x7/utils"

import { ScrollArea } from "@/components/ui-client/scroll-area"

import { Playlist } from "./data/playlists"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[]
}

export function Sidebar({ className, playlists }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              Listen Now
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Browse
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Radio
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Playlists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Songs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Made for You
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Artists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Albums
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
