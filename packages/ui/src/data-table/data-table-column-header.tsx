"use client";

import { useCallback } from "react";
import type { Column } from "@tanstack/react-table";

import { cn } from "@x7/css";
import { ArrowUpDownIcon, ChevronDownIcon, ChevronUpIcon } from "@x7/icons";

import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  description?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  description,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const onClick = useCallback(() => {
    if (column.getIsSorted() === false) {
      // desc
      column.toggleSorting(true);
    }

    if (column.getIsSorted() === "desc") {
      // asc
      column.toggleSorting(false);
    }

    if (column.getIsSorted() === "asc") {
      // clear
      column.clearSorting();
    }
  }, [column]);

  if (!column.getCanSort()) {
    return (
      <div className={cn(className)}>
        {description ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted">{title}</span>
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip>
        ) : (
          <span>{title}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {description ? (
        <Button onClick={onClick} variant="ghost" size="xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted">{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ChevronUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDownIcon className="ml-2 h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip>
        </Button>
      ) : (
        <Button onClick={onClick} variant="ghost" size="xs">
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
