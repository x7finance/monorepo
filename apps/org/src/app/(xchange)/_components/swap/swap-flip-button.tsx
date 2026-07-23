import { ArrowUpDownIcon } from "@x7/icons"

export function FlipSwapTokensButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="left-0 right-0 mb-[-26px] mt-[-26px] flex items-center justify-center">
      <button
        onClick={onClick}
        type="button"
        aria-label="Swap input and output tokens"
        className="transition-border group z-10 cursor-pointer rounded-full border border-border bg-[#fafafa] p-2 transition-all hover:shadow-xs dark:bg-black"
      >
        <div className="rotate-0 transition-transform group-hover:rotate-180">
          <ArrowUpDownIcon
            strokeWidth={3}
            className="h-4 w-4 text-muted-foreground"
          />
        </div>
      </button>
    </div>
  )
}
