interface SubHeaderProps {
  title: string
  description?: string
  id: string
}

export function DashboardSubheader(props: SubHeaderProps) {
  const { title, description, id } = props
  return (
    <div className="border-b border-zinc-900/5 dark:border-white/5 mt-24 pb-1.5">
      <h2
        id={id}
        className="text-xl font-semibold not-prose text-zinc-900 dark:text-zinc-100 mb-1.5"
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm font-medium text-zinc-500">{description}</p>
      )}
    </div>
  )
}
