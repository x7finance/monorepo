import type { Currency } from "@x7/utils"
import type { ReactElement } from "react"

export interface ComponentsWrapperProps<T> {
  children:
    | ReactElement<T>
    | (ReactElement<T> | undefined)[]
    | (ReactElement<T>[] | ReactElement<T> | undefined)[]
    | undefined
}

interface PoolFinderProps {
  token0: Currency | undefined
  token1: Currency | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export interface XchangeV2PoolFinderProps extends PoolFinderProps {
  token0: Currency | undefined
  token1: Currency | undefined
  index?: number
  dispatch?(payload: PoolExistenceStateAction): void
  enabled: boolean
}

export enum XchangeV2PoolState {
  LOADING = "Loading",
  NOT_EXISTS = "Not Exists",
  EXISTS = "Exists",
  INVALID = "Invalid",
}

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export type PoolStateUnion = [XchangeV2PoolState, any]

export enum PoolFinderType {
  Classic = "Classic",
  Stable = "Stable",
  ConcentratedLiquidity = "Concentrated Liquidity",
}

export interface PoolExistenceStateAction {
  type: "update"
  payload: { state: PoolStateUnion; index: number; poolType: PoolFinderType }
}
