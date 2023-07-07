"use client"

import { Fragment } from "react"
import type { Language, Token } from "prism-react-renderer"
import { Highlight, themes } from "prism-react-renderer"

import { CopyButton } from "@x7/ui/copy-button"
import { cn } from "@x7/utils"

interface FenceProps {
  children: string
  language: Language
}

export function Fence({ children, language }: FenceProps) {
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
          <CopyButton
            title="Code"
            buttonPositionClass="top-2 right-2 absolute"
            content={children.trimEnd()}
          />
          <code>
            {tokens.map((line: Token[], lineIndex: number) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token: Token, tokenIndex: number) => (
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
