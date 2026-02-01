"use client";

import { useEffect, useState } from "react";

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export function Countdown({
  exactEnd,
  canLiquidate,
}: {
  exactEnd: Date;
  canLiquidate: boolean;
}) {
  const end = exactEnd.getTime();

  const [time, setTime] = useState(() => Math.floor(Date.now() / 1000));
  useEffect((): (() => void) | void => {
    if (time <= end) {
      const timeout = setTimeout(
        () => setTime(Math.floor(Date.now() / 1000)),
        1000,
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [time, end]);

  const timeUntilEnd = end - time;

  let timeRemaining: number;
  // let message: string;

  const ongoing = timeUntilEnd >= 0;
  if (ongoing) {
    // message = "Rewards end in";
    timeRemaining = timeUntilEnd;
  } else {
    // message = "Rewards have ended!";
    timeRemaining = Infinity;
  }

  const days = Math.floor(timeRemaining / DAY);
  timeRemaining -= days * DAY;
  const hours = Math.floor(timeRemaining / HOUR);
  timeRemaining -= hours * HOUR;
  const minutes = Math.floor(timeRemaining / MINUTE);
  timeRemaining -= minutes * MINUTE;
  const seconds = timeRemaining;

  return Number.isFinite(timeRemaining) ? (
    <code>
      {`${days.toString().padStart(2, "0")}d ${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`}
    </code>
  ) : canLiquidate ? (
    <>✅ </>
  ) : (
    <>❗ </>
  );
}
