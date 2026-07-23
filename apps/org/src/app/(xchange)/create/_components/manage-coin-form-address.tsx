import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { Abi } from "viem"
import { useChainId, useReadContracts } from "wagmi"
import * as z from "zod"

import { XChangeFactoryABI, XchangeTokenAbi } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import { Button } from "@x7/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card"
import { ContractCopy } from "@x7/ui/contract-copy"
import { Form, FormControl, FormItem, FormMessage } from "@x7/ui/form"
import { Input } from "@x7/ui/input"
import { LinkExternal } from "@x7/ui/link"
import type { ChainId } from "@x7/utils"
import { generateChainIdentifier } from "@x7/utils"
import { ChainsArray } from "~/lib/components/utils/contracts-dropdown"

import { useUpdateToken } from "../_hooks/useUpdateToken"

const formSchema = z.object({
  buyTax: z.coerce
    .number()
    .min(0, "Buy tax cannot be negative")
    .max(20, "Buy tax cannot exceed 20%"),
  sellTax: z.coerce
    .number()
    .min(0, "Sell tax cannot be negative")
    .max(20, "Sell tax cannot exceed 20%"),
  threshold: z.coerce
    .number()
    .min(0, "Threshold cannot be negative")
    .max(10000, "Threshold cannot exceed 10000 (100%)"),
  taxWallet: z
    .string()
    .optional()
    .refine((value) => !value || /^0x[a-fA-F0-9]{40}$/.test(value), {
      message: "Invalid wallet address",
    }),
})

const getScannerLink = (chainId: ChainId): string | undefined => {
  const chain = ChainsArray.find((c) => c.id === chainId)
  return chain ? chain.scannerLink : undefined
}

export function ManageCoinFormAddress({
  contractAddress,
}: {
  contractAddress: `0x${string}`
}) {
  const chainId = useChainId() as ChainId
  const [buyTax, setBuyTax] = useState<number>(0)
  const [sellTax, setSellTax] = useState<number>(0)
  const [taxWallet, setTaxWallet] = useState<`0x${string}`>(
    "0x" as `0x${string}`
  )
  const [tokenName, setTokenName] = useState<string>("")
  const [tokenBalance, setTokenBalance] = useState<number>(0)
  const [tokenDecimals, setTokenDecimals] = useState<number>(0)
  const [tokenSupply, setTokenSupply] = useState<number>(0)
  const [tokenThreshold, setTokenThreshold] = useState<number>(0)
  const [pairAddress, setPairAddress] = useState<`0x${string}`>(
    "0x" as `0x${string}`
  )

  const tokenBalanceReadable = (tokenBalance / 10 ** tokenDecimals).toFixed(2)
  const tokenPercentage = (tokenBalance / tokenSupply) * 100

  const manageForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { buyTax: 0, sellTax: 0, taxWallet: "0x", threshold: 0 },
    mode: "onSubmit",
  })

  const { data: contractData, isLoading: _isLoading } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "buyTax",
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "sellTax",
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "taxWallet",
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "name",
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "balanceOf",
        args: [contractAddress],
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "totalSupply",
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "decimals",
      },
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "processFeesThreshold",
      },
      {
        address: X7ContractsEnum.XchangeFactory,
        abi: XChangeFactoryABI as Abi,
        functionName: "getPair",
        args: [contractAddress, "0x4200000000000000000000000000000000000006"],
      },
    ],
  })

  useEffect(() => {
    if (contractData) {
      setBuyTax(Number(contractData[0].result) || 0)
      setSellTax(Number(contractData[1].result) || 0)
      setTaxWallet(contractData[2].result as `0x${string}`)
      setTokenName(contractData[3].result as string)
      setTokenBalance(Number(contractData[4].result) || 0)
      setTokenSupply(Number(contractData[5].result) || 0)
      setTokenDecimals(Number(contractData[6].result) || 0)
      setTokenThreshold(Number(contractData[7].result) || 0)
      setPairAddress(contractData[8].result as `0x${string}`)
      manageForm.setValue("buyTax", buyTax)
      manageForm.setValue("sellTax", sellTax)
      manageForm.setValue("taxWallet", taxWallet)
      manageForm.setValue("threshold", tokenThreshold)
    }
  }, [buyTax, contractData, manageForm, sellTax, taxWallet, tokenThreshold])

  const { executeContract, isPending } = useUpdateToken(contractAddress)

  return (
    <Card className="mx-auto mt-8 max-w-lg transition-colors duration-300 hover:border-emerald-500 focus:z-20">
      <CardHeader>
        <CardTitle className="flex flex-col items-center gap-4 text-center">
          <span>Manage {tokenName} settings</span>
          <ContractCopy contract={contractAddress} />
          <div className="flex justify-center gap-4">
            <LinkExternal
              href={`${getScannerLink(chainId)}/token/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
              >
                Coin Contract
              </Button>
            </LinkExternal>

            <LinkExternal
              href={`${getScannerLink(chainId)}/token/${pairAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
              >
                Pair Contract
              </Button>
            </LinkExternal>

            <LinkExternal
              href={`https://www.dextools.io/app/en/${generateChainIdentifier(chainId)}/pair-explorer/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
              >
                Chart
              </Button>
            </LinkExternal>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...manageForm}>
          <hr className="mb-6 w-full border-gray-300" />
          <form className="flex flex-col items-center space-y-6 text-center">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              <FormItem className="flex w-full flex-col items-center text-center">
                <p className="text-sm font-semibold">Buy Tax</p>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full text-center"
                    {...manageForm.register("buyTax", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
                <Button
                  type="button"
                  className="mt-2"
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    const isValid = await manageForm.trigger("buyTax")
                    if (!isValid) {
                      toast.error(manageForm.formState.errors.buyTax?.message)
                      return
                    }
                    await executeContract("setBuyTax", [
                      manageForm.getValues("buyTax"),
                    ])
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Set Buy Tax"}
                </Button>
              </FormItem>

              <FormItem className="flex w-full flex-col items-center text-center">
                <p className="text-sm font-semibold">Sell Tax</p>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full text-center"
                    {...manageForm.register("sellTax", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
                <Button
                  type="button"
                  className="mt-2"
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    const isValid = await manageForm.trigger("sellTax")
                    if (!isValid) {
                      toast.error(manageForm.formState.errors.sellTax?.message)
                      return
                    }
                    await executeContract("setSellTax", [
                      manageForm.getValues("sellTax"),
                    ])
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Set Sell Tax"}
                </Button>
              </FormItem>
            </div>

            <hr className="w-full border-gray-300" />

            <FormItem className="flex w-full flex-col items-center text-center">
              <p className="text-sm">Tax Wallet</p>
              <FormControl>
                <Input
                  type="text"
                  className="w-full text-center"
                  {...manageForm.register("taxWallet")}
                />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                className="mt-2"
                variant="primary"
                size="sm"
                onClick={async () => {
                  const isValid = await manageForm.trigger("taxWallet")
                  if (!isValid) {
                    toast.error(manageForm.formState.errors.taxWallet?.message)
                    return
                  }
                  await executeContract("setTaxWallet", [
                    manageForm.getValues("taxWallet"),
                  ])
                }}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Set Tax Wallet"}
              </Button>
            </FormItem>

            <hr className="w-full border-gray-300" />

            <div className="flex w-full flex-col items-center text-center text-sm">
              <span>Contract Token Balance:</span>
              <span>{tokenBalanceReadable}</span>
              <span>
                {tokenPercentage < 0.001
                  ? "< 0.001%"
                  : `(${tokenPercentage.toFixed(3)}%)`}
              </span>
            </div>

            <div className="mt-2 flex w-full justify-center">
              <Button
                type="button"
                className="mt-2"
                variant="primary"
                size="sm"
                onClick={async () => {
                  await executeContract("processFees")
                }}
                disabled={isPending || tokenPercentage < 0.001}
              >
                {isPending ? "Processing..." : "Process Fees"}
              </Button>
            </div>

            <hr className="w-full border-gray-300" />

            <div className="mt-2 flex w-full justify-center">
              <Button
                type="button"
                className="mt-2"
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await executeContract("renounceOwnership")
                }}
                disabled={isPending}
              >
                {isPending ? "Renouncing..." : "Renounce Contract"}
              </Button>
            </div>

            <p className="text-muted-foreground mt-6 text-center text-sm">
              <strong>Note:</strong> Once renounced, no further changes can be
              made to the contract. However, the <strong>Process Fees</strong>{" "}
              function can still be called directly on the contract by anyone,
              even after renouncement.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
