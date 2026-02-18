import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { Abi } from "viem"
import { useAccount, useReadContracts } from "wagmi"
import { z } from "zod"

import { XchangeTokenAbi } from "@x7/contracts"
import { Button } from "@x7/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@x7/ui/form"
import { Input } from "@x7/ui/input"

const formSchema = z.object({
  contractAddress: z
    .string()
    .optional()
    .refine((value) => !value || /^0x[a-fA-F0-9]{40}$/.test(value), {
      message: "Invalid contract address",
    }),
})

export function ManageCoinFormSearch({
  onSuccess,
}: {
  onSuccess: (contractAddress: `0x${string}`) => void
}) {
  const { address } = useAccount()
  const [ownerError, setOwnerError] = useState<boolean>(false)

  const searchForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: "",
    },
  })

  const contractAddress = searchForm.watch(
    "contractAddress",
    ""
  ) as `0x${string}`

  const {
    data: ownerData,
    isError,
    isLoading,
  } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: XchangeTokenAbi as Abi,
        functionName: "owner",
      },
    ],
  })

  useEffect(() => {
    if (isError) setOwnerError(true)
  }, [isError])

  function onSubmit(_data: { contractAddress?: string }) {
    if (!_data.contractAddress) {
      toast.error("Contract address is required")
      return
    }

    if (isLoading) {
      toast("Checking ownership, please wait...")
      return
    }

    if (ownerError || !ownerData?.[0]?.result) {
      toast.error("Failed to verify ownership or contract does not exist.")
      return
    }

    const contractOwner = ownerData[0].result
    if (contractOwner === address) {
      onSuccess(contractAddress)
      toast.success("Ownership verified. Loading contract details...")
    } else {
      toast.error("You are not the owner of this contract.")
    }
  }

  return (
    <Card className="mx-auto mt-8 max-w-lg transition-colors duration-300 hover:border-emerald-500 focus:z-20">
      <CardHeader>
        <CardTitle>Manage Coin</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground mt-6 mb-12 max-w-full text-center text-sm">
              Connect the wallet used to deploy your coin, enter the contract
              address, and gain access to manage key settings such as taxes,
              contract renouncement, and more.
            </p>
          </div>
          <Form key={contractAddress} {...searchForm}>
            <form
              onSubmit={searchForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={searchForm.control}
                name="contractAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter contract address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                size="lg"
                loading={isLoading}
              >
                {isLoading ? "Checking..." : "Search"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
