"use client"

import { useCallback, useEffect, useState } from "react"
import { formatUnits } from "viem"
import { useAccount, useBalance, useDisconnect } from "wagmi"

import { cn } from "@x7/css"
import {
  BellIcon,
  CheckCircleIcon,
  CogIcon,
  CopyIcon,
  PowerIcon,
  SparklesIcon,
  XIcon,
} from "@x7/icons"
import { Button, buttonVariants } from "@x7/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip"
import { formatAddress } from "@x7/utils"
import { DefaultSettings } from "~/app/(xchange)/_components/wallet/settings"
import { WalletTabbedContent } from "~/app/(xchange)/_components/wallet/wallet-tabbed-content"
import { useMainnetEnsName } from "~/lib/hooks/account/useMainnetEnsName"
import { useWeb3Config } from "~/lib/providers/web3"
import { useSlideOverStore } from "~/lib/stores/slide-over"

export function WalletSlide() {
  const { address } = useAccount()

  const { wagmiConfig } = useWeb3Config()
  const { data: balanceData } = useBalance({ address })
  const ensName = useMainnetEnsName(address)

  const { disconnect } = useDisconnect()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeSlide, setActiveSlide] = useState<string | null>(null)
  const setIsSlideOverOpen = useSlideOverStore(
    (state) => state.setIsSlideOverOpen
  )

  const copyAddressAction = useCallback(() => {
    if (address) {
      void navigator.clipboard.writeText(address)
      setCopiedAddress(true)
    }
  }, [address])

  const close = useCallback(() => {
    setShowSettings(false)
  }, [])

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [copiedAddress])

  const handleSettingsClick = useCallback(() => {
    setShowSettings(true)
    setActiveSlide("settings")
  }, [])

  const handleNotificationsClick = useCallback(() => {
    setShowSettings(true)
    setActiveSlide("notifications")
  }, [])

  const handleFeaturesClick = useCallback(() => {
    setShowSettings(true)
    setActiveSlide("features")
  }, [])

  const handleDisconnectClick = useCallback(() => {
    setConfirmDisconnect(true)
  }, [])

  const handleConfirmDisconnect = useCallback(async () => {
    await new Promise((resolve) => {
      // @ts-expect-error: todo look at, likely not right
      disconnect(wagmiConfig)
      setIsSlideOverOpen(false)
      resolve(0)
    })
  }, [disconnect, wagmiConfig, setIsSlideOverOpen])

  if (!address) {
    return null
  }

  const accountName = ensName ? formatENS(ensName) : formatAddress(address)
  const ethBalance = balanceData?.value
    ? formatUnits(balanceData.value, balanceData.decimals)
    : undefined
  const displayBalance = ethBalance
    ? abbreviateETHBalance(parseFloat(ethBalance))
    : undefined

  return (
    <div>
      <div className="">
        <div className="mb-5 flex items-center justify-between">
          <div className="mr-2 inline-flex w-3/4">
            <div className="focus:ring-ring inline-flex items-center rounded-xs border border-blue-500/60 bg-blue-700/20 px-2 pr-1 font-semibold text-blue-600 uppercase transition-colors duration-500 hover:bg-blue-600/90 hover:text-blue-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden dark:text-blue-100/90">
              <h2 className="text-[11px] whitespace-nowrap">{accountName}</h2>
              <div className="ml-1">
                <Button
                  name="copy-address"
                  onClick={copyAddressAction}
                  className="w-[20px]! min-w-[20px] bg-transparent pr-0 transition-none"
                  size="xs"
                  variant="ghost"
                >
                  {copiedAddress ? (
                    <CheckCircleIcon className="h-3 w-3" />
                  ) : (
                    <CopyIcon className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {!confirmDisconnect && (
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={handleSettingsClick}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        size: "xs",
                      }),
                      "cursor-pointer"
                    )}
                  >
                    <CogIcon className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            )}
            {!confirmDisconnect && (
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={handleNotificationsClick}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        size: "xs",
                      }),
                      "cursor-pointer"
                    )}
                  >
                    <BellIcon className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            )}
            {!confirmDisconnect && (
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={handleFeaturesClick}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        size: "xs",
                      }),
                      "cursor-pointer"
                    )}
                  >
                    <SparklesIcon className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Features</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={
                    confirmDisconnect
                      ? handleConfirmDisconnect
                      : handleDisconnectClick
                  }
                  className={cn(
                    buttonVariants({
                      variant: confirmDisconnect ? "default" : "secondary",
                      size: "xs",
                    }),
                    "cursor-pointer"
                  )}
                >
                  {!confirmDisconnect && <PowerIcon className="h-4 w-4" />}
                  {confirmDisconnect && (
                    <span className="ml-1">Disconnect</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {confirmDisconnect ? "Confirm Disconnect" : "Disconnect"}
              </TooltipContent>
            </Tooltip>

            {confirmDisconnect && (
              <div className="ml-1">
                <Button
                  variant={"secondary"}
                  onClick={() => setConfirmDisconnect(false)}
                  size="xs"
                  icon={XIcon}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8 flex flex-col justify-start gap-2">
        {balanceData && (
          <div className="text-3xl font-bold">
            {displayBalance} {balanceData.symbol}
          </div>
        )}
      </div>
      <WalletTabbedContent />
      <DefaultSettings
        overlayOpen={showSettings}
        closeCallback={close}
        slide={activeSlide}
      />
    </div>
  )
}

function formatENS(name: string): string {
  const parts = name.split(".")
  const last = parts.pop()
  if (parts.join(".").length > 24) {
    return `${parts.join(".").substring(0, 24)}...`
  }
  return `${parts.join(".")}.${last}`
}

/**
 * Adapted from https://github.com/domharrington/js-number-abbreviate
 */
const units = ["k", "m", "b", "t"]

export function toPrecision(number: number, precision = 1) {
  return number
    .toString()
    .replace(new RegExp(`(.+\\.\\d{${precision}})\\d+`), "$1")
    .replace(/(\.[1-9]*)0+$/, "$1")
    .replace(/\.$/, "")
}

export function abbreviateETHBalance(number: number): string {
  if (number < 1) return toPrecision(number, 3)
  if (number < 10 ** 2) return toPrecision(number, 2)
  if (number < 10 ** 4)
    return new Intl.NumberFormat().format(parseFloat(toPrecision(number, 1)))

  const decimalsDivisor = 10 ** 1 // 1 decimal place

  let result = String(number)

  for (let i = units.length - 1; i >= 0; i--) {
    const size = 10 ** ((i + 1) * 3)

    if (size <= number) {
      // biome-ignore lint/style/noParameterAssign: TODO
      number = (number * decimalsDivisor) / size / decimalsDivisor

      result = toPrecision(number, 1) + units[i]

      break
    }
  }

  return result
}
