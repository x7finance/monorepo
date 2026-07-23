# Blockchain (Viem / Wagmi)

## Contract Reads

```ts
import { createPublicClient, http } from "viem"
import { base } from "viem/chains"
import { X7LendingPoolV2 } from "@x7/contracts"

const client = createPublicClient({ chain: base, transport: http() })
const liquidity = await client.readContract({
  address: X7LendingPoolV2.address,
  abi: X7LendingPoolV2.abi,
  functionName: "getLiquidity",
})
```

## Wagmi Hooks (Client Components Only)

```ts
"use client"
import { useAccount, useWriteContract } from "wagmi"

export function useDeposit() {
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const deposit = (amount: bigint) => {
    if (!address) throw new Error("Wallet not connected")
    return writeContract({
      address: X7LendingPoolV2.address,
      abi: X7LendingPoolV2.abi,
      functionName: "deposit",
      args: [amount],
    })
  }
  return { deposit, isPending }
}
```

## ABIs

Store in `packages/contracts/src/abi/`, export from `packages/contracts/src/index.ts`.
