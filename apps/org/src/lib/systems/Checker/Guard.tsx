import type { FC } from "react"
import React from "react"

import type { ButtonProps } from "@x7/ui/button"
import { Button } from "@x7/ui/button"

interface GuardProps extends ButtonProps {
  guardWhen: boolean
  guardText: string
}

const Guard: FC<GuardProps> = ({
  guardWhen,
  guardText,
  children,
  fullWidth = true,
  size = "lg",
  ...props
}) => {
  if (guardWhen) {
    return (
      <Button size={size} fullWidth={fullWidth} disabled {...props}>
        {guardText}
      </Button>
    )
  }

  return <>{children}</>
}

export { Guard, type GuardProps }
