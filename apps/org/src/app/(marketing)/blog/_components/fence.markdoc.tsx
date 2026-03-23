"use client"

import type { Language } from "prism-react-renderer"
import { Highlight, themes } from "prism-react-renderer"
import { Fragment } from "react"

import { cn } from "@x7/css"
import { CopyButton } from "@x7/ui/copy-button"

export function Fence({
  children,
  language,
}: {
  children: string
  language: Language
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
            "not-prose relative w-full overflow-auto rounded-lg bg-zinc-800 p-4"
          )}
          style={style}
        >
          <div className="absolute right-2 top-2">
            <CopyButton
              size={4}
              showText
              title="Code"
              content={children.trimEnd()}
            />
          </div>
          <code>
            {tokens.map((line, lineIndex) => (
              // oxlint-disable-next-line eslint-plugin-react(no-array-index-key) -- Syntax tokens have no stable identity
              <Fragment key={`line-${lineIndex}`}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    // oxlint-disable-next-line eslint-plugin-react(no-array-index-key) -- Syntax tokens have no stable identity
                    <span
                      key={`token-${lineIndex}-${tokenIndex}`}
                      {...getTokenProps({ token })}
                    />
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
