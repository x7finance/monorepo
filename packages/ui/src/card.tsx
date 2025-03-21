import * as React from "react";

import { cn } from "@x7/css";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground border-border rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

interface CardTitleProps extends React.ComponentProps<"div"> {
  tag?: "h1" | "h2" | "h3";
}

function CardTitle({ tag = "h3", className, ...props }: CardTitleProps) {
  const HeadingTag = tag;

  const headingClass = cn(
    {
      "text-4xl sm:text-5xl font-bold": tag === "h1",
      "text-3xl font-bold": tag === "h2",
      "text-lg font-semibold": tag === "h3",
      "leading-none font-heading": true,
    },
    className,
  );

  return React.createElement(HeadingTag, {
    "data-slot": "card-title",
    className: headingClass,
    ...props,
  });
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
