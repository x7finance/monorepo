/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
// import { useWeb3Config } from "~/lib/hooks/useWeb3Config";
import { useAccount } from "wagmi"

import {
  useArbitrumScanApi as ArbitrumScanApi,
  useBscscanApi as BscscanApi,
  useEtherscanApi as EtherscanApi,
  useOptimismScanApi as OptimismScanApi,
  usePolygonScanApi as PolygonScanApi,
} from "@x7/ui"
import { ChainId, getAlchemyUrls } from "@x7/utils"
import { env } from "~/env"

import { getChainInfo } from "../../constants/chainInfo"

export function useAccountHistory() {
  // const { customRpcValue } = useWeb3Config();
  const { address, chain } = useAccount()
  const chainInfo = getChainInfo(chain?.id as ChainId)

  const id = (chain?.id ?? 0) as ChainId

  if (getChainScannerApi(id)[0] !== "") {
    return getScannerTransactionHistory(id, address, chainInfo)
  }

  // TODO: implement proper retrieval using new RPC object
  return getTransactionHistory(address, id, env.NEXT_PUBLIC_ALCHEMY_ID)
}

function getTransactionHistory(
  address: `0x${string}` | undefined,
  id: ChainId,
  apiKey: string
) {
  const alchemyUrl = `${getAlchemyUrls(id)}${apiKey}`

  const requestPayload = {
    id: { id },
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        toAddress: address,
        withMetadata: false,
        excludeZeroValue: true,
        maxCount: "0x3e8", // Maximum number of transfers to return
        category: ["erc20"],
      },
    ],
  }
  const queryString = JSON.stringify({
    id: id,
    jsonrpc: requestPayload.jsonrpc,
    method: requestPayload.method,
    params: requestPayload.params,
  })

  return {
    url: alchemyUrl,
    queryString: queryString,
  }
}

function getScannerTransactionHistory(
  id: ChainId,
  address: `0x${string}` | undefined,
  chainInfo: any
) {
  const apiUrl = `${
    chainInfo?.api
  }?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${getChainScannerApi(
    id
  )}`
  return {
    url: apiUrl,
    queryString: "",
  }
}

function getChainScannerApi(id: ChainId) {
  switch (id) {
    case ChainId.ETHEREUM:
      return EtherscanApi()
    case ChainId.BSC:
      return BscscanApi()
    case ChainId.POLYGON:
      return PolygonScanApi()
    case ChainId.ARBITRUM:
      return ArbitrumScanApi()
    case ChainId.OPTIMISM:
      return OptimismScanApi()
    default:
      return ""
  }
}
