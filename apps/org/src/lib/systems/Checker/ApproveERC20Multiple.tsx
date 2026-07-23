"use client"

import type { FC } from "react"
import type { Address } from "viem"

import type { ButtonProps } from "@x7/ui/button"
import type { Currency, CurrencyAmount } from "@x7/utils"

import { ApproveERC20 } from "./ApproveERC20"

interface ApproveERC20MultipleProps extends ButtonProps {
  id: string
  amounts: { amount: CurrencyAmount<Currency>; contract: Address }[]
  enabled?: boolean
  index?: number
}

/*
 * Recursive component for multiple ApproveERC20s
 */
const ApproveERC20Multiple: FC<ApproveERC20MultipleProps> = ({
  fullWidth = true,
  size = "lg",
  index,
  id,
  amounts,
  children,
  ...props
}) => {
  // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (amounts === undefined) {
    return <>{children}</>
  }

  const _index = typeof index === "number" ? index : amounts.length - 1

  if (_index < 0) {
    return <>{children}</>
  }

  return (
    <ApproveERC20
      {...props}
      fullWidth={fullWidth}
      size={size}
      id={`${id}-${_index}`}
      amount={amounts[_index]?.amount}
      contract={amounts[_index]?.contract}
    >
      <ApproveERC20Multiple
        {...props}
        index={_index - 1}
        id={id}
        amounts={amounts}
      >
        {children}
      </ApproveERC20Multiple>
    </ApproveERC20>
  )
}

export { ApproveERC20Multiple, type ApproveERC20MultipleProps }
