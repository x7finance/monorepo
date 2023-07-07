"use client"

import MuxPlayer from "@mux/mux-player-react"

export function HeaderVideoComponent() {
  return (
    <MuxPlayer
      loop
      muted
      autoPlay
      className="lg:[h-1000px] mux-block absolute inset-0 -top-20 h-screen rotate-180 animate-fade-in object-cover md:h-[900px]"
      streamType="on-demand"
      style={{ aspectRatio: 2048 / 858 }}
      playbackId="iJJr8Np00C2phRjK0001cZ22hzsJv4Y8yj0046nx8O02dDgI"
    />
  )
}
