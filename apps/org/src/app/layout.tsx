import { Inter } from "next/font/google"
import calSansFont from "next/font/local"

import { cn } from "@x7/css"
import { SITE_METADATA } from "~/lib/config/metadata"
import "~/styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"

const calSans = calSansFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})
const inter = Inter({ subsets: ["latin"] })

export const metadata = SITE_METADATA

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={"en"}
      suppressHydrationWarning={true}
      className="scroll-smooth"
      style={{ colorScheme: "light" }}
    >
      <body
        className={cn(
          "bg-background min-h-screen antialiased",
          calSans.variable,
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  )
}
