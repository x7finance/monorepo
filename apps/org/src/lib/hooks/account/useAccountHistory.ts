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

  // Call every scanner-API hook unconditionally (rules of hooks); each returns
  // a [key, setKey] tuple from localStorage. Select the key for the active chain.
  const [etherscanKey] = EtherscanApi()
  const [bscscanKey] = BscscanApi()
  const [polygonKey] = PolygonScanApi()
  const [arbitrumKey] = ArbitrumScanApi()
  const [optimismKey] = OptimismScanApi()

  const scannerApiKey = getScannerApiKey(id, {
    [ChainId.ETHEREUM]: etherscanKey,
    [ChainId.BSC]: bscscanKey,
    [ChainId.POLYGON]: polygonKey,
    [ChainId.ARBITRUM]: arbitrumKey,
    [ChainId.OPTIMISM]: optimismKey,
  })

  if (scannerApiKey !== "") {
    return getScannerTransactionHistory(address, chainInfo, scannerApiKey)
  }

  // TODO: implement proper retrieval using new RPC object
  return getTransactionHistory(address, id, env.NEXT_PUBLIC_ALCHEMY_ID)
}

function getScannerApiKey(
  id: ChainId,
  keys: Partial<Record<ChainId, string>>
): string {
  return keys[id] ?? ""
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
  address: `0x${string}` | undefined,
  chainInfo: any,
  scannerApiKey: string
) {
  const apiUrl = `${chainInfo?.api}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${scannerApiKey}`
  return {
    url: apiUrl,
    queryString: "",
  }
}
