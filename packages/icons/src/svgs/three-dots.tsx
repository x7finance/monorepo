import type { SVGProps } from "react";

export function ThreeDots(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
      <circle cx="19" cy="12" r="1" fill="currentColor"></circle>
      <circle cx="5" cy="12" r="1" fill="currentColor"></circle>
    </svg>
  );
}
