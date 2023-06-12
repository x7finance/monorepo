const sharedConfig = require("tailwind-config/tailwind.config.js")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [sharedConfig],
}
