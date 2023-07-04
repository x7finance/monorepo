import { useEffect, useState } from "react"
import { BlockchainType } from "@x7/common"
import { toast } from "@x7/ui"
import { generateChainBase } from "@x7/utils"
import { useContractWrite, useWaitForTransaction } from "wagmi"

type UseContractWriteArgs = Parameters<typeof useContractWrite>

const renderStatusWithHeader = (
  message: string,
  data: any,
  chainId: number
) => {
  return (
    <div>
      <div>{message}</div>
      {data && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${generateChainBase(chainId)}/tx/${data}`}
          className="cursor-pointer font-bold underline"
        >
          Tx Link
        </a>
      )}
    </div>
  )
}

// const toastConfirm = "tx_confirm"
// const toastProcessing = "tx_processing"
// const toastSuccess = "tx_success"
// const toastError = "tx_error"

export function useContractTx(
  chainId: BlockchainType | number | undefined,
  args: UseContractWriteArgs
): any {
  const [isFinished, setIsFinished] = useState(false)

  const result = useContractWrite(...args)

  const transaction = useWaitForTransaction({ hash: result.data?.hash })

  const isLoading = transaction.status === "loading" || result.isLoading

  const isError = transaction.status === "error" || result.isError

  const isSuccess = transaction.status === "success"

  // @ts-ignore
  useEffect(() => {
    if (isLoading && !result.data?.hash) {
      return toast({
        title: "Confirm",
        description: renderStatusWithHeader(
          "Confirm transaction in wallet",
          result.data?.hash,
          chainId as BlockchainType
        ),
        variant: "information",
      })
    } else if (isLoading && result.data?.hash) {
      return toast({
        title: "Processing",
        description: renderStatusWithHeader(
          "Transaction is being processed on chain...",
          result.data?.hash,
          chainId as BlockchainType
        ),
        variant: "pending",
      })
    } else if (isSuccess) {
      return toast({
        title: "Success",
        description: renderStatusWithHeader(
          "Transaction successful",
          result.data?.hash,
          chainId as BlockchainType
        ),
        variant: "success",
      })
    } else if (isError && !isFinished) {
      // @ts-ignore
      const message = generateErrorMessage(result.error?.code)
      setIsFinished(true)
      return toast({
        title: "Error",
        description: renderStatusWithHeader(
          message,
          result.data?.hash,
          chainId as BlockchainType
        ),
        variant: "destructive",
      })
    }
  }, [isError, isLoading, chainId, transaction])

  return {
    ...result,
    isLoading,
    isError,
    isSuccess,
    write: result.write,
  }
}

function generateErrorMessage(errorCode: number) {
  switch (errorCode) {
    case -32700:
      return "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
    case -32600:
      return "The JSON sent is not a valid Request object."
    case -32601:
      return "The method does not exist / is not available."
    case -32602:
      return "Invalid method parameter(s)."
    case -32603:
      return "Internal JSON-RPC error."
    case -32000:
      return "Invalid input."
    case -32001:
      return "Resource not found."
    case -32002:
      return "Resource unavailable."
    case -32003:
      return "Transaction rejected."
    case -32004:
      return "Method not supported."
    case -32005:
      return "Request limit exceeded."
    case 4001:
      return "User rejected the request."
    case 4100:
      return "The requested account and/or method has not been authorized by the user."
    case 4200:
      return "The requested method is not supported by this Ethereum provider."
    case 4900:
      return "The provider is disconnected from all chains."
    case 4901:
      return "The provider is disconnected from the specified chain."
    default:
      return "Transaction failed"
  }
}
