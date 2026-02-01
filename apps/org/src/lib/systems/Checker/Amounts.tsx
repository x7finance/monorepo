/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable react-hooks/exhaustive-deps */
"use client"

import type { ButtonProps } from "@x7/ui/button"
import type { ActiveChainId, Amount, Currency } from "@x7/utils"
import type { FC } from "react"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useMemo } from "react"
import { zeroAddress } from "viem"
import { useAccount } from "wagmi"

import { Button } from "@x7/ui/button"
import { Native, ZERO } from "@x7/utils"

import { useBalancesWeb3 } from "../../hooks/balances/useBalancesWeb3"

interface AmountsProps extends ButtonProps {
  chainId: ActiveChainId | undefined
  amounts: (Amount<Native | Currency> | undefined)[]
}

const Amounts: FC<AmountsProps> = ({
  type: _type,
  amounts,
  chainId,
  children,
  fullWidth = true,
  size = "lg",
  ...props
}) => {
  const { address } = useAccount()

  const amountsAreDefined = useMemo(
    () => amounts.every((el) => el?.greaterThan(ZERO)),
    [amounts]
  )

  const currencies = useMemo(
    () =>
      amounts.map((amount) => {
        return amount?.currency
      }),
    [amounts]
  )

  const { data: balances } = useBalancesWeb3({
    currencies,
    chainId,
    account: address,
    enabled: amountsAreDefined,
  })

  const sufficientBalance = useMemo(() => {
    return amounts.every((amount) => {
      if (!amount) return true
      return !balances?.[
        amount.currency.isNative ||
        amount.currency === Native.onChain(chainId!).wrapped
          ? zeroAddress
          : amount.currency.wrapped.address
      ]?.lessThan(amount)
    })
  }, [amounts, balances])

  if (!address) {
    return (
      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) =>
          !mounted || !account || !chain ? (
            <Button
              size={size}
              variant={"primary"}
              id="connectButtonSwap"
              fullWidth={fullWidth}
              onClick={(e) => {
                e.preventDefault()
                openConnectModal()
              }}
              {...props}
            >
              Connect Wallet
            </Button>
          ) : null
        }
      </ConnectButton.Custom>
    )
  }

  if (!amountsAreDefined || !sufficientBalance) {
    return (
      <Button
        id="amount-checker"
        disabled
        variant="outline"
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        {!amountsAreDefined ? "Enter an amount" : "Insufficient balance"}
      </Button>
    )
  }

  return <>{children}</>
}

export { Amounts, type AmountsProps }
