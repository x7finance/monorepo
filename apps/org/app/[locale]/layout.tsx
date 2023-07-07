import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
// import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"

// import { useLocale } from "next-intl"

import "@/styles/globals.css"

import { ThemeProvider } from "@/site-components/theme-provider"

import { Toaster } from "@x7/ui/toaster"
import { cn } from "@x7/utils"

import { SITE_METADATA } from "@/config/metadata"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

export const metadata = SITE_METADATA

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  return (
    <html lang={params?.locale}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
