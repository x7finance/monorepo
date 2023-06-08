"use client"

import MuxPlayer from "@mux/mux-player-react"

export function HeaderVideoComponent() {
  return (
    <MuxPlayer
      loop
      muted
      autoPlay
      className="absolute inset-0 object-cover h-screen md:h-[900px] lg:[h-1000px] -top-20 rotate-180 animate-fade-in mux-block"
      streamType="on-demand"
      style={{ aspectRatio: 2048 / 858 }}
      playbackId="iJJr8Np00C2phRjK0001cZ22hzsJv4Y8yj0046nx8O02dDgI"
    />
  )
}
