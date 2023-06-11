const sharedConfig = require("tailwind-config/tailwind.config.js")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [sharedConfig],
}
