import type { ComponentsWrapperProps, XchangeV2PoolFinderProps } from "./types"
import type { FC } from "react"

export const ComponentsWrapper: FC<
  ComponentsWrapperProps<XchangeV2PoolFinderProps>
> = ({ children }) => {
  return <>{children}</>
}
