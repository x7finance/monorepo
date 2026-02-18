/* oxlint-disable @typescript-eslint/no-explicit-any */
"use client"

import type { FC, ReactElement } from "react"
import { useAccount, useSwitchChain } from "wagmi"

import type { ButtonProps } from "@x7/ui/button"
import { Button } from "@x7/ui/button"
import { chainName } from "@x7/utils"

interface NetworkProps extends ButtonProps {
  chainId: number | undefined
}

const Network: FC<NetworkProps> = ({
  chainId,
  fullWidth = true,
  size = "lg",
  children,
  ...rest
}): ReactElement<any, any> | null => {
  const { chain } = useAccount()

  const { switchChain } = useSwitchChain()

  if (!chainId) {
    return null
  }

  const _chainId = Number(chainId)
  if (chain?.id !== _chainId)
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={() => switchChain({ chainId: _chainId })}
        {...rest}
      >
        Switch to {chainName[_chainId]}
      </Button>
    )

  return <>{children}</>
}

export { Network, type NetworkProps }
