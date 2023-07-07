/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import type { Config } from "tailwindcss"

// @ts-ignore
import baseConfig from "@x7/tailwind-config"

export default {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  content: [...baseConfig.content, "../../packages/ui/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config
