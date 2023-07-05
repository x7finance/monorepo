import type { Metadata } from "next"
import Image from "next/image"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { PlusCircleIcon } from "@x7/icons"
// @ts-expect-error todo: fix this
import { Button } from "@x7/ui/button"
// @ts-expect-error todo: fix this
import { ScrollArea, ScrollBar } from "@x7/ui/scroll-area"
// @ts-expect-error todo: fix this
import { Separator } from "@x7/ui/separator"
// @ts-expect-error todo: fix this
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@x7/ui/tabs"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "../(marketing.components)/heading"
import { AlbumArtwork } from "./album-artwork"
import { listenNowAlbums, madeForYouAlbums, playlists } from "./data/playlists"
import { Sidebar } from "./sidebar"

const metadata = {
  title: "Integrations",
  description: "Integ",
  slug: "/integrations",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function IntegrationsPage() {
  return (
    <div>
      <Heading
        id={"integrations"}
        title={"Find an Integration"}
        subHeader="Integrate your project with the popular blockchain products and services"
      />
      <SiteContentContainer>
        <div className="mt-4 min-h-[1200px] border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <>
            <div className="md:hidden">
              <Image
                src="/examples/music-light.png"
                width={1280}
                height={1114}
                alt="Music"
                className="block dark:hidden"
              />
              <Image
                src="/examples/music-dark.png"
                width={1280}
                height={1114}
                alt="Music"
                className="hidden dark:block"
              />
            </div>
            <div className="hidden md:block">
              <div className="border-t">
                <div className="bg-background">
                  <div className="grid lg:grid-cols-5">
                    <Sidebar
                      playlists={playlists}
                      className="hidden lg:block"
                    />
                    <div className="col-span-3 lg:col-span-4 lg:border-l">
                      <div className="h-full px-4 py-6 lg:px-8">
                        <Tabs defaultValue="music" className="h-full space-y-6">
                          <div className="space-between flex items-center">
                            <TabsList>
                              <TabsTrigger value="music" className="relative">
                                Music
                              </TabsTrigger>
                              <TabsTrigger value="podcasts">
                                Podcasts
                              </TabsTrigger>
                              <TabsTrigger value="live" disabled>
                                Live
                              </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto mr-4">
                              <Button>
                                <PlusCircleIcon className="mr-2 h-4 w-4" />
                                Add music
                              </Button>
                            </div>
                          </div>
                          <TabsContent
                            value="music"
                            className="border-none p-0 outline-none"
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                  Listen Now
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                  Top picks for you. Updated daily.
                                </p>
                              </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="relative">
                              <ScrollArea>
                                <div className="flex space-x-4 pb-4">
                                  {listenNowAlbums.map((album) => (
                                    <AlbumArtwork
                                      key={album.name}
                                      album={album}
                                      className="w-[250px]"
                                      aspectRatio="portrait"
                                      width={250}
                                      height={330}
                                    />
                                  ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                              </ScrollArea>
                            </div>
                            <div className="mt-6 space-y-1">
                              <h2 className="text-2xl font-semibold tracking-tight">
                                Made for You
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Your personal playlists. Updated daily.
                              </p>
                            </div>
                            <Separator className="my-4" />
                            <div className="relative">
                              <ScrollArea>
                                <div className="flex space-x-4 pb-4">
                                  {madeForYouAlbums.map((album) => (
                                    <AlbumArtwork
                                      key={album.name}
                                      album={album}
                                      className="w-[150px]"
                                      aspectRatio="square"
                                      width={150}
                                      height={150}
                                    />
                                  ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                              </ScrollArea>
                            </div>
                          </TabsContent>
                          <TabsContent
                            value="podcasts"
                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                  New Episodes
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                  Your favorite podcasts. Updated daily.
                                </p>
                              </div>
                            </div>
                            <Separator className="my-4" />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
          {/* <IntegrationsGrid /> */}
        </div>
      </SiteContentContainer>
    </div>
  )
}
