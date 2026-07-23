/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useEffect, useMemo, useState } from "react"
import type { Abi } from "viem"
import { formatEther } from "viem"
import { useReadContracts } from "wagmi"

import { X7InitialLiquidityLoanTerm001 } from "@x7/contracts"
import type { ChainId } from "@x7/utils"

interface LoanTermData {
  address: `0x${string}`
  loanSymbol: string
  loanName: string
  minimumLoanAmount: string
  maximumLoanAmount: string
  minimumLoanLengthSeconds: string
  maximumLoanLengthSeconds: string
  originationFeeNumerator: string
  numberOfPremiumPeriods: string
  numberOfRepaymentPeriods: string
}

export function useLoanTermData(
  chainId: ChainId,
  contractAddresses: `0x${string}` | `0x${string}`[]
) {
  const [loanTermData, setLoanTermData] = useState<LoanTermData[]>([])

  const addressesArray = useMemo(
    () =>
      Array.isArray(contractAddresses)
        ? contractAddresses
        : [contractAddresses],
    [contractAddresses]
  )

  const loanContracts = useMemo(
    () =>
      addressesArray.flatMap((address) => [
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "name",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "symbol",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "minimumLoanAmount",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "maximumLoanAmount",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "minimumLoanLengthSeconds",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "maximumLoanLengthSeconds",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "originationFeeNumerator",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "numberOfPremiumPeriods",
          chainId,
        },
        {
          address,
          abi: X7InitialLiquidityLoanTerm001 as Abi,
          functionName: "numberOfRepaymentPeriods",
          chainId,
        },
      ]),
    [addressesArray, chainId]
  )

  const { data: loanTermsData } = useReadContracts({
    contracts: loanContracts,
  })

  useEffect(() => {
    if (!loanTermsData || addressesArray.length === 0) return

    const processedLoanData = addressesArray.map((address, index) => {
      const baseIndex = index * 9

      const getLoanValue = (idx: number) => {
        const result = loanTermsData[baseIndex + idx]?.result
        return result?.toString() || "0"
      }

      return {
        address,
        loanName: loanTermsData[baseIndex]?.result?.toString() || "",
        loanSymbol: getLoanValue(1),
        minimumLoanAmount: formatEther(BigInt(getLoanValue(2))),
        maximumLoanAmount: formatEther(BigInt(getLoanValue(3))),
        minimumLoanLengthSeconds: getLoanValue(4),
        maximumLoanLengthSeconds: getLoanValue(5),
        originationFeeNumerator: getLoanValue(6),
        numberOfPremiumPeriods: getLoanValue(7),
        numberOfRepaymentPeriods: getLoanValue(8),
      }
    })

    setLoanTermData(processedLoanData)
  }, [loanTermsData, addressesArray])

  return { loanTermData }
}
