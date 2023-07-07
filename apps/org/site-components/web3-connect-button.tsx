"use client"

import { ConnectKitButton } from "connectkit"

import { Button } from "@x7/ui/button"
import { shortenHex } from "@x7/utils"

export function ConnectionComponent() {
  return (
    <div className="fixed right-28 top-2.5 z-10 sm:right-0 sm:top-0 sm:p-2.5">
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          return isConnected ? (
            <>
              <Button variant={"outline"} onClick={show} size={"sm"}>
                {ensName ?? `${shortenHex(address ?? ``, 4)}`}
              </Button>
            </>
          ) : (
            <Button loading={isConnecting} onClick={show} size={"sm"}>
              <span className="sr-only">Connect Wallet</span>
              <span className="whitespace-nowrap">Connect Wallet</span>
            </Button>
          )
        }}
      </ConnectKitButton.Custom>
    </div>
  )
}
