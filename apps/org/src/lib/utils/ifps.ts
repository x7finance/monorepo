"use server";

import { PinataSDK } from "pinata-web3";

import { env } from "~/env.mjs";

const pinata = new PinataSDK({
  pinataJwt: env.PINATA_JWT,
  pinataGateway: env.NEXT_PUBLIC_GATEWAY_URL,
});

export const uploadFileToIpfs = async (file: File) => {
  const added = await pinata.upload.file(file);
  return added.IpfsHash;
};

export const uploadJsonToIpfs = async (json: object) => {
  const added = await pinata.upload.json(json);
  return added.IpfsHash;
};

export const uploadMetadataToIPFS = async (
  name: string,
  description: string,
  imageFile: File,
) => {
  try {
    const imageCID = await uploadFileToIpfs(imageFile);
    const imageUrl = `ipfs://${imageCID}`;

    const metadata = {
      name,
      description,
      image: imageUrl,
    };

    const metadataCID = await uploadJsonToIpfs(metadata);
    const metadataUrl = `ipfs://${metadataCID}`;

    return metadataUrl;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return null;
  }
};

// export const convertIpfsUrlToGatewayUrl = (url: string) => {
//   return url.replace("ipfs://", `https://${PINATA_GATEWAY}/ipfs/`);
// };
