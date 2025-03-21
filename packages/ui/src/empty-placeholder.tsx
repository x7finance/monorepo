import type { HTMLAttributes } from "react";

import { cn } from "@x7/css";

type EmptyPlaceholderProps = HTMLAttributes<HTMLDivElement>;

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

type EmptyPlacholderTitleProps = HTMLAttributes<HTMLHeadingElement>;

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlacholderTitleProps) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

type EmptyPlacholderDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlacholderDescriptionProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground mt-2 mb-8 text-center text-sm leading-6 font-normal",
        className,
      )}
      {...props}
    />
  );
};
