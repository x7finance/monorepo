"use client"

import { ClipboardDocumentIcon } from "icons"

import toast from "react-hot-toast"
import { useClipboard } from "use-clipboard-copy"

export function ContractCopy(props: { contract: string }) {
  const { contract } = props
  const clipboard = useClipboard({
    onSuccess() {
      toast.success(<span>Contract Copied</span>, {
        duration: 3000,
        style: {
          border: `none`,
          background: "#000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#000",
        },
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
        <ClipboardDocumentIcon
          className="inline-block w-4 h-4 "
          aria-hidden="true"
        />
        <span className="sr-only">Copy Contract</span>
      </span>
    </span>
  )
}
