"use client"

import { Fragment } from "react"
import { Highlight, themes } from "prism-react-renderer"

// @ts-expect-error todo: fix this
import { CopyButton } from "@x7/ui/copy-buttons"
import { cn } from "@x7/utils"

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
