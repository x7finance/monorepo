# Blockchain Development Standards

## Viem/Wagmi Patterns

**Client Creation:**
```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({
  chain: base,
  transport: http()
})
```

**Contract Interaction:**
```typescript
const { data } = await client.readContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'balanceOf',
  args: [userAddress]
})
```

## X7 Contract Addresses

**Base Mainnet:**
- X7 Lending Pool: `0x4eE199B7DFED6B96402623BdEcf2B1ae2f3750Dd`
- WETH: `0x4200000000000000000000000000000000000006`
- X7DAO: `0x...`

## ABI Management

- Store ABIs in `packages/contracts/src/abi/`
- Export from `packages/contracts/src/index.ts`
- Use typed ABIs with Viem

## Wallet Connection

Use Wagmi hooks:
```typescript
import { useAccount, useWriteContract } from 'wagmi'

const { address } = useAccount()
const { writeContract } = useWriteContract()
```
