import Link from "next/link"

import { buttonVariants } from "@x7/ui/button"
import { cn } from "@x7/utils"

interface HeaderProps {
  title: string
  subHeader?: string
  secondaryButton?: {
    text: string
    href: string
  }
  primaryButton?: {
    text: string
    href: string
  }
}

export function DashboardTitle(props: HeaderProps) {
  const { title, subHeader, secondaryButton, primaryButton } = props

  return (
    <div className="border-b border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-black">
      <div className="px-6 md:flex md:items-center md:justify-between md:space-x-5">
        <div className="flex items-start space-x-5">
          <div className="pt-1.5">
            <h1 className="text-3xl font-medium tracking-tighter text-black dark:text-white">
              {title}
            </h1>
            {subHeader && (
              <p className="text-sm font-medium text-zinc-500 sm:pr-12">
                {subHeader}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          {secondaryButton?.href && (
            <Link
              href={secondaryButton.href}
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "inline-flex"
              )}
            >
              {secondaryButton.text}
            </Link>
          )}

          {primaryButton?.href && (
            <Link
              href={primaryButton.href}
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "inline-flex"
              )}
            >
              {primaryButton.text}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
