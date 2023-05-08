"use client"

import { ConnectKitButton } from "connectkit"
import { shortenHex } from "utils"

import { Button } from "./ui/button"

export function ConnectionComponent() {
  return (
    <div className="fixed top-0 right-0 z-20 sm:p-2.5">
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          return isConnected ? (
            <>
              <Button variant={"outline"} onClick={show} size={"sm"}>
                {ensName ?? `${shortenHex(address ?? ``, 4)}`}
              </Button>
            </>
          ) : (
            <Button onClick={show} size={"sm"}>
              <span className="sr-only">
                {isConnecting ? "Connecting..." : `Connect Wallet`}
              </span>
              <span className="whitespace-nowrap">
                {isConnecting ? "Connecting..." : `Connect Wallet`}
              </span>
            </Button>
          )
        }}
      </ConnectKitButton.Custom>
    </div>
  )
}
