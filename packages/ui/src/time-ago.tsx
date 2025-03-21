"use client";

import React, { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { formatDistanceToNow } from "date-fns";

import { useInterval } from "./hooks/use-interval";

export interface TimeAgoProps
  extends Omit<React.ButtonHTMLAttributes<HTMLSpanElement>, "value"> {
  asChild?: boolean;
  value: Date;
}

const TimeAgo = React.forwardRef<HTMLButtonElement, TimeAgoProps>(
  ({ value, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    const [distance, setDistance] = useState<string>(
      formatDistanceToNow(value, {
        addSuffix: true,
        includeSeconds: true,
      }),
    );

    useInterval(() => {
      setDistance(
        formatDistanceToNow(value, {
          addSuffix: true,
          includeSeconds: true,
        }),
      );
    }, 1000);

    return (
      <Comp ref={ref} {...props}>
        {distance}
      </Comp>
    );
  },
);

TimeAgo.displayName = "TimeAgo";

export { TimeAgo };
