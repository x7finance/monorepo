import { getLatestDoc } from "~/app/(docs)/_utils/getlatestdoc";

export function QuickLink({
  title,
  description,
  href,
  latest,
}: {
  title: string;
  description: string;
  href: string;
  latest: string;
}) {
  const finalHref = href || (latest ? getLatestDoc(latest) : "/#");
  return (
    <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,var(--color-sky-50)),var(--quick-links-hover-bg,var(--color-sky-50)))_padding-box,linear-gradient(to_top,var(--color-indigo-400),var(--color-cyan-400),var(--color-sky-500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:var(--color-zinc-800)]" />
      <div className="relative overflow-hidden rounded-xl px-6 py-8">
        <h2 className="font-display text-base font-medium tracking-tight text-zinc-900 dark:text-white">
          <a href={finalHref}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </a>
        </h2>
        <p className="mt-1 text-sm text-secondary-foreground">{description}</p>
      </div>
    </div>
  );
}
