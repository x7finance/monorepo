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
          <p className="text-sm font-bold uppercase text-indigo-600">
            {eyebrow}
          </p>
        )}
        <h1
          id={id}
          className="dark:text-hero-header-regular text-hero-header-light mt-1 pb-2 text-4xl font-bold italic tracking-tight sm:text-6xl"
        >
          {title}
        </h1>
        {subHeader && (
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {subHeader}
          </p>
        )}
      </div>
    </div>
  )
}
