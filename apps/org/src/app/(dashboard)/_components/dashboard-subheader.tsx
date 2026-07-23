interface SubHeaderProps {
  title: string
  description?: string
  id: string
}

export function DashboardSubheader(props: SubHeaderProps) {
  const { title, description, id } = props
  return (
    <div className="mx-4 mt-24 mb-4 border-b border-zinc-900/5 pb-1.5 sm:mb-6 lg:mx-0 dark:border-white/5">
      <h2
        id={id}
        className="not-prose font-heading mb-1.5 text-xl font-semibold text-zinc-900 dark:text-zinc-100"
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
    </div>
  )
}
