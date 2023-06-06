import React from "react"

interface HeadingProps {
  eyebrow?: string
  title: string
  subHeader?: string | JSX.Element
  id: string
}

export const Heading: React.FC<HeadingProps> = ({
  eyebrow,
  title,
  subHeader,
  id,
}) => {
  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && (
          <p className="text-indigo-600 uppercase font-bold text-sm">
            {eyebrow}
          </p>
        )}
        <h1
          id={id}
          className="mt-1 text-4xl font-bold tracking-tight sm:text-6xl dark:text-hero-header text-hero-header-light italic pb-2"
        >
          {title}
        </h1>
        {subHeader && (
          <p className="dark:text-zinc-400 text-zinc-600 mt-6 text-lg leading-8">
            {subHeader}
          </p>
        )}
      </div>
    </div>
  )
}
