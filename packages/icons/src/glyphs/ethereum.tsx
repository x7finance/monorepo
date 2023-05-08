import { memo } from 'react';

function Ethereum(props: any) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M49.6537 36.9783V0L19 50.9269L49.6537 36.9783Z" fill="#8A92B2" />
      <path
        d="M49.6537 69.072V36.9783L19 50.9269L49.6537 69.072ZM49.6537 36.9783L80.313 50.9269L49.6537 0V36.9783Z"
        fill="#62688F"
      />
      <path
        d="M49.6537 36.9783V69.072L80.313 50.9269L49.6537 36.9783Z"
        fill="#454A75"
      />
      <path
        d="M49.6537 74.8834L19 56.7497L49.6537 100V74.8834Z"
        fill="#8A92B2"
      />
      <path
        d="M80.33 56.7497L49.6537 74.8834V100L80.33 56.7497Z"
        fill="#62688F"
      />
    </svg>
  );
}

export default memo(Ethereum);
