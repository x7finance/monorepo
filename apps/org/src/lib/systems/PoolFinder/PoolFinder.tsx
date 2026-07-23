/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/unbound-method */
import type { FC, ReactElement, ReactNode } from "react"
import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  useReducer,
} from "react"

import { ComponentsWrapper } from "./ComponentsWrapper"
import type {
  ComponentsWrapperProps,
  PoolExistenceStateAction,
  PoolStateUnion,
  XchangeV2PoolFinderProps,
} from "./types"
import { XchangeV2Pool } from "./XchangeV2Pool"

enum XchangeV2PoolState {
  LOADING = "Loading",
  NOT_EXISTS = "Not Exists",
  EXISTS = "Exists",
  INVALID = "Invalid",
}

interface Props {
  components: ReactElement<ComponentsWrapperProps<XchangeV2PoolFinderProps>>
  children({ pool }: { pool: PoolStateUnion }): ReactNode
}

export interface PoolFinderState {
  pool: PoolStateUnion
}

const reducer = (_state: PoolFinderState, action: PoolExistenceStateAction) => {
  switch (action.type) {
    case "update": {
      return {
        pool: action.payload.state,
      }
    }
  }
}

const Controller: FC<Props> = ({ components, children }) => {
  const [state, dispatch] = useReducer(reducer, {
    pool: [XchangeV2PoolState.LOADING, null],
  })

  const childrenComponents = useMemo(() => {
    return cloneElement(
      components,
      components.props,
      Children.map(components.props.children, (component, index) => {
        if (isValidElement(component) && component.props.enabled) {
          return cloneElement(component, {
            dispatch,
            index,
          })
        }
      })
    )
  }, [components])

  return (
    <>
      {children(state)}
      {childrenComponents}
    </>
  )
}

export const PoolFinder: typeof Controller & {
  Components: typeof ComponentsWrapper
  XchangeV2Pool: typeof XchangeV2Pool
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  XchangeV2Pool,
})
