"use server"

import { PinataSDK } from "pinata-web3"

import { LogCodes, getLogger, ServiceNames } from "@x7/utils"
import { env } from "~/env.mjs"

const log = getLogger({ serviceName: ServiceNames.XCHANGE })

const pinata = new PinataSDK({
  pinataJwt: env.PINATA_JWT,
  pinataGateway: env.NEXT_PUBLIC_GATEWAY_URL,
})

export const uploadFileToIpfs = async (file: File) => {
  const added = await pinata.upload.file(file)
  return added.IpfsHash
}

export const uploadJsonToIpfs = async (json: object) => {
  const added = await pinata.upload.json(json)
  return added.IpfsHash
}

export const uploadMetadataToIPFS = async (
  name: string,
  description: string,
  imageFile: File
) => {
  try {
    const imageCID = await uploadFileToIpfs(imageFile)
    const imageUrl = `ipfs://${imageCID}`

    const metadata = {
      name,
      description,
      image: imageUrl,
    }

    const metadataCID = await uploadJsonToIpfs(metadata)
    const metadataUrl = `ipfs://${metadataCID}`

    return metadataUrl
  } catch (error) {
    log.error(LogCodes.IPFS_UPLOAD_FAIL, "IPFS upload failed", {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

// export const convertIpfsUrlToGatewayUrl = (url: string) => {
//   return url.replace("ipfs://", `https://${PINATA_GATEWAY}/ipfs/`);
// };
