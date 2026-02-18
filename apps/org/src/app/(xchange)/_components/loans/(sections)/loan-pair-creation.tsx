/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { isAddress, zeroAddress } from "viem"
import { useAccount, useChainId } from "wagmi"

import { CheckCircleIcon } from "@x7/icons"
import { generateChainEtherTokenEnum, X7ContractsEnum } from "@x7/sdk"
import { Button } from "@x7/ui/button"
import type { ChainId, Currency } from "@x7/utils"
import { DEAD_ADDRESS } from "@x7/utils"
import { useCreatePair } from "~/lib/hooks/pairs/useCreatePair"
import { useGetPair } from "~/lib/hooks/pairs/useGetPair"
import { useGetReserves } from "~/lib/hooks/pairs/useGetReserves"

interface LoanPairCreationProps {
  collateralToken: Currency
}

export function LoanPairCreation({ collateralToken }: LoanPairCreationProps) {
  const { isConnected } = useAccount()
  const chainId = useChainId() as ChainId
  const address =
    collateralToken && "address" in collateralToken
      ? collateralToken.address
      : DEAD_ADDRESS

  const chainEtherToken = generateChainEtherTokenEnum(chainId)
  const factoryAddress = X7ContractsEnum.XchangeFactory ?? DEAD_ADDRESS

  const { getPair } = useGetPair(
    chainId,
    factoryAddress,
    address,
    chainEtherToken ?? DEAD_ADDRESS
  )

  const { getReserves } = useGetReserves(chainId, getPair)

  const { writeContract, data, isPending } = useCreatePair({
    tokenA: address,
    tokenB: chainEtherToken,
    factoryAddress,
  })

  const handleCreatePair = () => {
    if (address) {
      // @ts-expect-error: todo fix
      writeContract(data?.request)
    }
  }

  if (
    !isAddress(getPair) ||
    getPair === DEAD_ADDRESS ||
    getPair === zeroAddress ||
    getPair === undefined
  ) {
    return (
      <Button
        loading={isPending}
        disabled={!isConnected}
        variant={"default"}
        fullWidth
        onClick={handleCreatePair}
      >
        Create Pair
      </Button>
    )
  }

  if (!getReserves || getReserves[0] > 0n || getReserves[1] > 0n) {
    return (
      <div className="flex items-center space-x-2 rounded-xl border border-emerald-500 bg-emerald-500/20 p-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full">
          <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
        </div>
        <span className="font-semibold text-emerald-600">
          Liquidity already exists on this pair, at this time it&apos;s not
          eligible for a loan.
        </span>
      </div>
    )
  }

  return (
    <Button
      loading={isPending}
      disabled={true}
      variant={"outline"}
      icon={CheckCircleIcon}
      iconPosition="end"
      iconProps={{
        className: "h-3 w-3 relative left-2 text-emerald-500 cursor-default",
      }}
      fullWidth
    >
      Pair Created
    </Button>
  )
}
