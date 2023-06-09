import type { SVGProps } from "react"
import { memo } from "react"

function Bsc(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <path
        d="M30.2738 42.6L49.4995 23.3752L68.7353 42.6102L79.9221 31.4234L49.4995 1L19.087 31.4132L30.2738 42.6Z"
        fill="#F3BA2F"
      />
      <path
        d="M22.3738 50.4975L11.1872 39.3109L0 50.4981L11.1866 61.6847L22.3738 50.4975Z"
        fill="#F3BA2F"
      />
      <path
        d="M30.2738 58.3985L49.4995 77.6234L68.7345 58.3892L79.9275 69.5697L79.9221 69.576L49.4995 99.9986L19.0706 69.5705L30.2738 58.3985Z"
        fill="#F3BA2F"
      />
      <path
        d="M87.8128 61.69L99 50.5028L87.8134 39.3162L76.6262 50.5034L87.8128 61.69Z"
        fill="#F3BA2F"
      />
      <path
        d="M60.8466 50.4934H60.8512L49.4995 39.1416L38.1422 50.4989L38.1578 50.5153L49.4995 61.8569L60.8512 50.5051L60.8567 50.4989L60.8466 50.4934Z"
        fill="#F3BA2F"
      />
    </svg>
  )
}

export default memo(Bsc)
