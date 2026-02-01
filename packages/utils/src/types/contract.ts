import type { Abi, ContractFunctionArgs } from "viem"

export type Contract<TAbi extends Abi = []> = Omit<
  ContractFunctionArgs<TAbi>,
  "functionName" | "args"
>
