import { memo } from 'react';

function Loading({ fill }: { fill: string }) {
  return (
    <svg className="animate-spin" fill="none" viewBox="0 0 32 32">
      <path
        className="opacity-20"
        d="M16 26c5.523 0 10-4.477 10-10S21.523 6 16 6 6 10.477 6 16s4.477 10 10 10z"
        stroke={fill}
        strokeWidth={4}
      />
      <path
        className="opacity-70"
        fill={fill}
        d="M8 16a8 8 0 018-8V4C9.373 4 4 9.373 4 16h4zm2 5.291A7.962 7.962 0 018 16H4c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default memo(Loading);
