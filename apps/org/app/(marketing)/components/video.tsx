"use client"

import MuxPlayer from "@mux/mux-player-react"

export function HeaderVideoComponent() {
  return (
    <MuxPlayer
      loop
      muted
      autoPlay
      className="absolute inset-0 object-cover h-screen md:h-[900px] lg:[h-1000px] -top-20 rotate-180"
      streamType="on-demand"
      playbackId="iJJr8Np00C2phRjK0001cZ22hzsJv4Y8yj0046nx8O02dDgI"
    />
  )

  // return (
  //   <>
  //     <video
  //       autoPlay
  //       loop
  //       muted
  //       className="absolute inset-0 object-cover h-3/4 -top-20 rotate-180"
  //     >
  //       <source
  //         src="https://stream.mux.com/iJJr8Np00C2phRjK0001cZ22hzsJv4Y8yj0046nx8O02dDgI.m3u8"
  //         type="application/x-mpegURL"
  //       />
  //     </video>
  //   </>
  // )
}
