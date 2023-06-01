interface SubHeaderProps {
  title: string
  description: string
  id: string
}

export function DashboardSubheader(props: SubHeaderProps) {
  const { title, description, id } = props
  return (
    <div>
      <h2
        id={id}
        className="mt-24 mb-10 text-xl font-semibold border-b not-prose border-zinc-900/5 text-slate-900 dark:border-white/5 dark:text-slate-100"
      >
        {title}
      </h2>
    </div>
  )
}
