"use client"

import { cn } from "utils"

import { Fragment } from "react"
import Highlight, { defaultProps, Language } from "prism-react-renderer"

import { CopyButton } from "./copy-button.markdoc"

export function Fence({
  children,
  language,
}: {
  children: string
  language: Language
}) {
  return (
    <Highlight
      {...defaultProps}
      code={children.trimEnd()}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre
          className={cn(
            className,
            "not-prose bg-zinc-800 rounded-lg p-4 overflow-auto w-full relative"
          )}
          style={style}
        >
          <CopyButton code={children.trimEnd()} />
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