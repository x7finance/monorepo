"use client"

import { ClipboardIcon } from "icons"

import { useClipboard } from "use-clipboard-copy"

import { toast } from "@/components/ui/use-toast"

export function ContractCopy(props: { contract: string }) {
  const { contract } = props
  const clipboard = useClipboard({
    onSuccess() {
      return toast({
        title: "Success",
        description: "Contract Copied",
        variant: "success",
      })
    },
  })

  return (
    <span
      onClick={() => {
        clipboard.copy(contract)
      }}
      className="flex items-center cursor-pointer opacity-70 hover:underline dark:opacity-50"
    >
      Contract
      <span className="ml-0.5">
        <ClipboardIcon className="inline-block w-4 h-4 " aria-hidden="true" />
        <span className="sr-only">Copy Contract</span>
      </span>
    </span>
  )
}
