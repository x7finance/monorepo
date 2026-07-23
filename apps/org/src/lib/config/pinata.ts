/* oxlint-disable @typescript-eslint/require-await */
"use server"

import { PinataSDK } from "pinata-web3"

import { env } from "~/env"

// Create an async function to initialize Pinata
export async function getPinataClient() {
  return new PinataSDK({
    pinataJwt: `${env.PINATA_JWT}`,
    pinataGateway: `${env.NEXT_PUBLIC_GATEWAY_URL}`,
  })
}

export const getPinata = () => getPinataClient()
