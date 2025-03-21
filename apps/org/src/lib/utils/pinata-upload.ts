/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { env } from "~/env.mjs";

const PINATA_AIP_KEY = env.NEXT_PUBLIC_PINATA_AIP_KEY;
const PINATA_SECRECT_KEY = env.NEXT_PUBLIC_PINATA_SECRECT_KEY;

export async function uploadPicture(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      body: formData,
      headers: {
        pinata_api_key: PINATA_AIP_KEY,
        pinata_secret_api_key: PINATA_SECRECT_KEY,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  const ImgHash = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

  return ImgHash;
}
