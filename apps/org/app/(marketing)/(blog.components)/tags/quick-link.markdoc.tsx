export function QuickLink({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.zinc.800)]" />
      <div className="relative overflow-hidden rounded-xl p-6">
        <h2 className="font-display mt-4 text-base text-zinc-900 dark:text-white">
          <a href={href}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </a>
        </h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  )
}
