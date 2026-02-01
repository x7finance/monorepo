/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from "@x7/css";
import { CheckCircleIcon, Uniswap, Xchange } from "@x7/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@x7/ui/form";
import { RadioGroup, RadioGroupItem } from "@x7/ui/radio-group";

const LOAN_POOL_OPTIONS = [
  {
    poolId: "xchange",
    icon: () => <Xchange className="w-24" />,
  },
  {
    poolId: "uniswap",
    icon: () => <Uniswap className="w-24" />,
  },
  {
    poolId: "halfnhalf",
    icon: () => (
      <span className="flex">
        <Xchange className="relative bottom-1 right-2 w-14" />
        <div className="rotate rotate-45 text-xl text-zinc-300 dark:text-zinc-700">
          |
        </div>
        <Uniswap className="relative left-1 top-2 w-14" />
      </span>
    ),
  },
];

export default function LoanPoolChoice(form: any) {
  return (
    <FormField
      control={form.control}
      name="dex"
      render={({ field }) => (
        <FormItem className="space-y-3 last-of-type:space-y-0">
          <FormLabel>
            1. Choose type of liquidity pool you want to create
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
            >
              {LOAN_POOL_OPTIONS.map((data, id) => (
                <LoanPoolOption
                  key={`${data.poolId}-${id}`}
                  field={field}
                  data={data}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div className="h-12">
            <DexDetailsHelper value={field.value} />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  function LoanPoolOption({ field, data }: { field: any; data: any }) {
    return (
      <FormItem
        className={cn(
          field?.value === data.poolId
            ? "border-emerald-600 ring-2 ring-emerald-600"
            : "border-zinc-700",
          "relative flex h-full w-full cursor-pointer rounded-lg border p-4 shadow-xs focus:outline-hidden",
        )}
      >
        <>
          <span className="flex flex-1">
            <span className="flex w-full flex-col items-center justify-center">
              <FormLabel className="z-0 block">
                <data.icon />
              </FormLabel>
              <FormControl className="">
                <RadioGroupItem
                  className="absolute inset-0 h-full w-full rounded-none opacity-0"
                  value={data.poolId}
                />
              </FormControl>
            </span>
          </span>
          <span className="absolute -top-1 right-1">
            <CheckCircleIcon
              className={cn(
                field?.value === data.poolId ? "" : "invisible",
                "relative h-5 w-5 text-emerald-600",
              )}
              aria-hidden="true"
            />
          </span>
        </>
      </FormItem>
    );
  }

  function DexDetailsHelper({
    value,
  }: {
    value: "xchange" | "uniswap" | "halfnhalf";
  }) {
    if (value === "xchange") {
      return (
        <div className="mt-4 flex flex-col gap-2">
          <span className={"text-sm text-zinc-500"}>
            Your pair will be hosted on Xchange the most decentralized exchange.
          </span>
        </div>
      );
    } else if (value === "uniswap") {
      return (
        <div className="mt-4 flex flex-col gap-2">
          <span className={"text-sm text-zinc-500"}>
            Your pair will be hosted on Uniswap, but still tradeable via Xchange
            as it gives the best price available for all pairs regardless of
            pool.
          </span>
        </div>
      );
    } else if (value === "halfnhalf") {
      return (
        <div className="mt-4 flex flex-col gap-2">
          <span className={"text-sm text-zinc-500"}>
            Half of your pair will be hosted on Xchange and half of your pair
            will be hosted on Uniswap. This gives your pair flexibility to be
            traded on both DEXs.
          </span>
        </div>
      );
    } else {
      return <></>;
    }
  }
}
