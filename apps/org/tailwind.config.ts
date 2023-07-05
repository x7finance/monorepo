import type { Config } from "tailwindcss"

import baseConfig from "@x7/tailwind-config"

export default {
  content: [
    ...baseConfig.content,
    "./app/**/*.{ts,tsx}",
    "./site-components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config
