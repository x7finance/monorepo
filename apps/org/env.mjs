import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_ASSETS_URL: z.string().min(1),
    NEXT_PUBLIC_DOCSEARCH_APP_ID: z.string().min(1),
    NEXT_PUBLIC_DOCSEARCH_API_KEY: z.string().min(1),
    NEXT_PUBLIC_DOCSEARCH_INDEX_NAME: z.string().min(1),
    NEXT_PUBLIC_ALCHEMY_ID: z.string().min(1),
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ASSETS_URL: process.env.NEXT_PUBLIC_ASSETS_URL,
    NEXT_PUBLIC_DOCSEARCH_APP_ID: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
    NEXT_PUBLIC_DOCSEARCH_API_KEY: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
    NEXT_PUBLIC_DOCSEARCH_INDEX_NAME:
      process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
})
