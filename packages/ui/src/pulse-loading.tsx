import { cn } from "@x7/utils"

export interface LoadingProps {
  className?: string
  color?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

export const Loading: React.FC<LoadingProps> = ({
  className,
  color = "text-inherit",
  size = "md",
}) => {
  const dotStyle = cn("animate-loading loading-dot", color, sizeClasses[size])

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={dotStyle}>&#8226;</span>
      <span style={{ marginLeft: "3px" }} className={dotStyle}>
        &#8226;
      </span>
      <span style={{ marginLeft: "3px" }} className={dotStyle}>
        &#8226;
      </span>
    </div>
  )
}
