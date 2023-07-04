import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@x7/ui"
import { cn } from "@x7/utils"

type SectionStepProps = {
  header: string
  subHeader: string
  highlightHeader: string
  highlights: string[]
  pioneerId: string
  gradient: string
  checkColor: string
  isReverse?: boolean
  showLeadIn?: boolean
  primaryAction?: {
    text: string
    href: string
  }
}

export function SectionStep(props: SectionStepProps) {
  const {
    header,
    subHeader,
    highlightHeader,
    highlights,
    pioneerId,
    gradient,
    checkColor,
    isReverse,
    showLeadIn,
    primaryAction,
  } = props

  return (
    <>
      {showLeadIn && (
        <>
          <span
            className={
              "w-[1px] mx-auto block h-[100px] bg-gradient-to-b pioneer-line-drop to-zinc-600 relative top-10"
            }
          />
          <span className="w-[11px] h-[11px] rounded-full my-1 circle-shadow mx-auto block top-10 relative" />
        </>
      )}

      <div
        className={cn(
          isReverse ? `lg:flex-row-reverse` : ``,
          `mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-200 dark:ring-zinc-800 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none`
        )}
      >
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {header}
          </h3>
          <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {subHeader}
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4
              className={cn(
                gradient,
                `flex-none bg-gradient-to-r bg-clip-text font-display text-sm font-semibold leading-6 text-transparent`
              )}
            >
              {highlightHeader}
            </h4>
            <div className="h-px flex-auto bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:grid-cols-2 sm:gap-6"
          >
            {highlights.map((highlight, key) => (
              <li key={key} className="flex gap-x-3">
                <svg
                  className={cn(checkColor, `h-6 w-5 flex-none`)}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                {highlight}
              </li>
            ))}
          </ul>
          {primaryAction?.href && (
            <div className="flex justify-center mt-6">
              <Link
                href={primaryAction.href}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                  }),
                  "inline-flex"
                )}
              >
                {primaryAction.text}
              </Link>
            </div>
          )}
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="lg:flex lg:flex-col lg:justify-center">
            <Image
              src={`https://img.x7.finance/pioneers/${pioneerId}.png`}
              alt="Random Pioneer Image"
              width={1000}
              height={1000}
              className="object-cover rounded-2xl ring-1 ring-inset ring-zinc-900/5"
            />
          </div>
        </div>
      </div>
    </>
  )
}
