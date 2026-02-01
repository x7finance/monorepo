/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/no-unused-vars */
"use client"

import type { ChainId } from "@x7/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { parseEther } from "viem"
import { useAccount, useChainId } from "wagmi"
import { z } from "zod"

import { AlertCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@x7/icons"
import { X7ContractsEnum } from "@x7/sdk"
import { Alert, AlertDescription } from "@x7/ui/alert"
import { Button } from "@x7/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@x7/ui/form"
import { Input } from "@x7/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@x7/ui/radix-collapsible"
import { Textarea } from "@x7/ui/textarea"
import { LogCodes } from "@x7/utils"
import { uploadMetadataToIPFS } from "~/lib/utils/ifps"
import { log } from "~/lib/utils/log"

import { useDeployToken } from "../_hooks/useDeployToken"

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    ticker: z
      .string()
      .min(1, "Ticker is required")
      .max(10, "Ticker must be 10 characters or less")
      .toUpperCase(),
    description: z.string().min(1, "Description is required"),
    twitterLink: z.string().url().optional().or(z.literal("")),
    telegramLink: z.string().url().optional().or(z.literal("")),
    websiteLink: z.string().url().optional().or(z.literal("")),
    tokenURI: z.string().optional(),
    supply: z.coerce
      .number({
        invalid_type_error: "Total supply must be a valid number",
      })
      .min(1, "Total supply must be at least 1")
      .default(0),

    buyTax: z.coerce
      .number({
        invalid_type_error: "Buy tax must be a valid number",
      })
      .max(20, "Buy tax cannot exceed 20%")
      .default(0),

    sellTax: z.coerce
      .number({
        invalid_type_error: "Sell tax must be a valid number",
      })
      .max(20, "Sell tax cannot exceed 20%")
      .default(0),

    taxWallet: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true
          return /^0x[a-fA-F0-9]{40}$/.test(value)
        },
        {
          message: "Invalid address",
        }
      ),

    teamTokens: z.coerce
      .number({
        invalid_type_error: "Team Percentage must be a valid number",
      })
      .min(0, "Team percent cannot be negative")
      .max(50, "Team percent cannot exceed 50%")
      .default(0),
  })
  .superRefine((data, ctx) => {
    if ((data.buyTax > 0 || data.sellTax > 0) && !data.taxWallet) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["taxWallet"],
        message:
          "Tax wallet is required when buy tax or sell tax is greater than 0",
      })
    }
  })

type CreateCoinForm = z.infer<typeof formSchema>

export function CreateCoinForm() {
  const { address } = useAccount()
  const chainId = useChainId() as ChainId

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isSocialsOpen, setIsSocialsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>()

  const form = useForm<CreateCoinForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ticker: "",
      description: "",
      twitterLink: "",
      telegramLink: "",
      websiteLink: "",
      tokenURI: "",
      supply: 100000000,
      buyTax: 0,
      sellTax: 0,
      taxWallet: address,
      teamTokens: 0,
    },
  })

  useEffect(() => {
    if (address) {
      form.setValue("taxWallet", address)
    }
  }, [address, form])

  const deployParams = useMemo(() => {
    const name = form.watch("name")
    const symbol = form.watch("ticker")
    const description = form.watch("description")
    const twitterLink = form.watch("twitterLink") ?? ""
    const telegramLink = form.watch("telegramLink") ?? ""
    const websiteLink = form.watch("websiteLink") ?? ""
    const tokenURI = form.watch("tokenURI") ?? ""
    const supply = BigInt(form.watch("supply"))
    const buyTax = form.watch("buyTax")
    const sellTax = form.watch("sellTax")
    const taxWallet = form.watch("taxWallet") ?? address ?? ""
    const teamTokens = form.watch("teamTokens")

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600)

    const params = {
      name,
      symbol,
      supply,
      teamTokens,
      loanTermContract: X7ContractsEnum.X7InitialLiquidityLoanTerm004(chainId),
      loanAmount: parseEther("1.0"),
      loanDurationSeconds: BigInt(604800),
      deadline,
      description,
      twitterLink,
      telegramLink,
      websiteLink,
      tokenURI,
      buyTax,
      sellTax,
      taxWallet,
      enabled: Boolean(name && symbol && description),
    }

    return params
  }, [
    form.watch("name"),
    form.watch("ticker"),
    form.watch("supply"),
    form.watch("teamTokens"),
    form.watch("description"),
    form.watch("twitterLink"),
    form.watch("telegramLink"),
    form.watch("websiteLink"),
    form.watch("tokenURI"),
    form.watch("buyTax"),
    form.watch("sellTax"),
    form.watch("taxWallet"),
    chainId,
  ])

  const { writeContract, isPending, data, error } = useDeployToken(deployParams)

  function onSubmit() {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      if (!data?.request) {
        toast.error("There was an error with your request")
        return
      }

      writeContract(data.request)
    } catch (error) {
      log.error(LogCodes.TX_FAIL, "Failed to deploy token", {
        error: error instanceof Error ? error.message : String(error),
      })
      toast.error(
        error instanceof Error ? error.message : "Failed to deploy token"
      )
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const file = e.target.files[0]

        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        const tokenURI = await uploadMetadataToIPFS(
          form.getValues("name"),
          form.getValues("description"),
          file
        )

        const cleanedTokenURI = tokenURI?.replace("ipfs://", "")
        form.setValue("tokenURI", cleanedTokenURI)
      } catch (error) {
        toast.error("Failed to process image file")
        log.error(
          LogCodes.IPFS_UPLOAD_FAIL,
          "Failed to process image file for IPFS upload",
          {
            error: error instanceof Error ? error.message : String(error),
          }
        )
      }
    }
  }

  useEffect(() => {
    const formErrors = form.formState.errors
    if (Object.keys(formErrors).length > 0) {
      log.debug(LogCodes.UI_FORM_VALIDATION, "Form validation errors", {
        errors: Object.keys(formErrors),
      })
      Object.entries(formErrors).forEach(([field, error]) => {
        if (error.message) {
          toast.error(`${field}: ${error.message}`)
        }
      })
    }
  }, [form.formState.errors])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Card className="mx-auto mt-8 max-w-lg transition-colors duration-300 hover:border-emerald-500 focus:z-20">
      <CardHeader>
        <CardTitle>Create Coin</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bitcoin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="BTC" {...field} />
                  </FormControl>
                  <FormDescription>
                    The trading symbol for your coin (e.g., BTC, ETH)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your coin..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenURI"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Coin Logo</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="border-border hover:border-primary/50 flex min-h-[80px] w-full items-center justify-center rounded-md border-2 border-dashed p-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="file:bg-primary file:text-primary-foreground file:hover:bg-primary/90 h-14 border-0 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2"
                          {...field}
                        />
                      </div>
                      {previewUrl && (
                        <div className="border-border relative h-32 w-32 overflow-hidden rounded-md border">
                          <Image
                            src={previewUrl}
                            alt="Coin logo preview"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a square logo image (recommended: 256x256px)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Collapsible
              open={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
              className="space-y-4"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-between"
                >
                  <span>
                    {isAdvancedOpen ? "Hide" : "Show"} advanced options
                  </span>
                  {isAdvancedOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="supply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Supply</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy Tax</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sell Tax</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxWallet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Wallet</FormLabel>
                      <FormControl>
                        <Input placeholder="0x" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        The percentange of tokens that will be held outside of
                        the liquidity loan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={isSocialsOpen}
              onOpenChange={setIsSocialsOpen}
              className="space-y-4"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-between"
                >
                  <span>{isSocialsOpen ? "Hide" : "Show"} socials links</span>
                  {isSocialsOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="twitterLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telegramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://t.me/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websiteLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Alert variant="yellow" className="mb-6">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Taxes and tax wallet can be changed after deployment, as well as
                renounicing ownership.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              size="lg"
              loading={isPending}
              disabled={isPending || !address}
            >
              {isPending ? "Deploying..." : "Create Coin"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
