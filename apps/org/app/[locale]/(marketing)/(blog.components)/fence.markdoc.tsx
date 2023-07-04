"use client"

import { Fragment } from "react"
import { cn } from "@x7/utils"
import { Highlight, themes } from "prism-react-renderer"

import { CopyButton } from "@/components/ui-client/copy-button"

export function Fence({
  children,
  language,
}: {
  children: string
  language: any
}) {
  return (
    <Highlight
      theme={themes.dracula}
      code={children.trimEnd()}
      language={language}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre
          className={cn(
            className,
            "not-prose bg-zinc-800 rounded-lg p-4 overflow-auto w-full relative"
          )}
          style={style}
        >
          <CopyButton
            title="Code"
            buttonPositionClass="top-2 right-2 absolute"
            content={children.trimEnd()}
          />
          <code>
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {"\n"}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}
