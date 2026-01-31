import { LinkExternal } from "@x7/ui/link";

export function ClawLendBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 px-4 py-3">
      <div className="flex items-center justify-center gap-x-2 text-center">
        <span className="text-sm font-semibold text-white sm:text-base">
          Launching{" "}
          <LinkExternal
            href="https://clawlend.com"
            className="font-bold underline hover:no-underline"
          >
            ClawLend.com
          </LinkExternal>{" "}
          powered by X7
        </span>
      </div>
    </div>
  );
}
