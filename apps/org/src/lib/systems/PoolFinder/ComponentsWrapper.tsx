import type { FC } from "react"

import type { ComponentsWrapperProps, XchangeV2PoolFinderProps } from "./types"

export const ComponentsWrapper: FC<
  ComponentsWrapperProps<XchangeV2PoolFinderProps>
> = ({ children }) => {
  return <>{children}</>
}
