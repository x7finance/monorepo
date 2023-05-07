import { cn } from 'utils';

export function Prose({ as: Component = 'div', className, ...props }: any) {
  return (
    <Component
      className={cn(
        className,
        'prose prose-slate max-w-none break-words text-slate-500 dark:prose-invert dark:text-slate-300',
        // headings
        'prose-headings:font-display prose-headings:scroll-mt-28 prose-headings:font-normal prose-h2:text-3xl prose-h2:font-bold prose-h3:font-semibold prose-h3:tracking-tight lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
        // links
        'prose-a:font-semibold dark:prose-a:text-purple-400',
        // link underline
        'prose-a:no-underline prose-a:shadow-[inset_0_-3px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px]',
        // pre
        'prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10',
        // hr
        'dark:prose-hr:border-slate-800'
      )}
      {...props}
    />
  );
}
