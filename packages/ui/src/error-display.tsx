"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@x7/css";

const iconContainerVariants = cva(
  "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        error: "bg-red-500/10",
        warning: "bg-amber-500/10",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);

const iconVariants = cva("h-8 w-8", {
  variants: {
    variant: {
      error: "text-red-500",
      warning: "text-amber-500",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

type ErrorDisplayVariant = VariantProps<typeof iconContainerVariants>;

interface ErrorDisplayProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ErrorDisplayVariant["variant"];
}

export function ErrorDisplay({
  className,
  children,
  ...props
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center px-4",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-md text-center">{children}</div>
    </div>
  );
}

interface ErrorDisplayIconProps extends ErrorDisplayVariant {
  icon: React.ComponentType<{ className?: string }>;
}

ErrorDisplay.Icon = function ErrorDisplayIcon({
  icon: Icon,
  variant = "error",
}: ErrorDisplayIconProps) {
  return (
    <div className={iconContainerVariants({ variant })}>
      <Icon className={iconVariants({ variant })} />
    </div>
  );
};

type ErrorDisplayTitleProps = HTMLAttributes<HTMLHeadingElement>;

ErrorDisplay.Title = function ErrorDisplayTitle({
  className,
  ...props
}: ErrorDisplayTitleProps) {
  return (
    <h2
      className={cn(
        "mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100",
        className,
      )}
      {...props}
    />
  );
};

interface ErrorDisplayMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  error?: Error;
  fallback?: string;
}

ErrorDisplay.Message = function ErrorDisplayMessage({
  className,
  error,
  fallback = "An unexpected error occurred.",
  children,
  ...props
}: ErrorDisplayMessageProps) {
  return (
    <p
      className={cn(
        "mb-6 text-sm text-zinc-600 dark:text-zinc-400",
        className,
      )}
      {...props}
    >
      {children ?? error?.message ?? fallback}
    </p>
  );
};

interface ErrorDisplayDigestProps extends HTMLAttributes<HTMLParagraphElement> {
  digest?: string;
}

ErrorDisplay.Digest = function ErrorDisplayDigest({
  className,
  digest,
  ...props
}: ErrorDisplayDigestProps) {
  if (!digest) return null;

  return (
    <p
      className={cn("mb-4 font-mono text-xs text-zinc-500", className)}
      {...props}
    >
      Error ID: {digest}
    </p>
  );
};

interface ErrorDisplayActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

ErrorDisplay.Actions = function ErrorDisplayActions({
  className,
  children,
  ...props
}: ErrorDisplayActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
