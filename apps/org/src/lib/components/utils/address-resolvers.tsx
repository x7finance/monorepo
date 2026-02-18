import type { ReactNode } from "react"
import { useEnsName } from "wagmi"

import { ChainId } from "@x7/utils"

export type AddressToEnsProps = Parameters<typeof useEnsName>[0] & {
  children:
    | ReactNode
    | ReactNode[]
    | ((payload: ReturnType<typeof useEnsName>) => React.JSX.Element)
}

export const AddressToEnsResolver = ({
  children,
  chainId = ChainId.ETHEREUM,
  ...props
}: AddressToEnsProps): React.JSX.Element => {
  const result = useEnsName({ ...props, chainId })

  if (typeof children === "function") {
    return children(result)
  }

  return <>{children}</>
}
