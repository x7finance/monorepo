/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import { config } from "@react-spring/web";
import type { Address } from "viem";
import { useChainId } from "wagmi";

import { cn } from "@x7/css";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@x7/ui/form";
import { Slider } from "@x7/ui/slider";
import { Tag } from "@x7/ui/tag";
import type { ChainId } from "@x7/utils";

import { SECONDS_IN_A_DAY } from "~/lib/constants/misc";
import {
  useMaximumLoanLengthSeconds,
  useMinimumLoanLengthSeconds,
} from "~/lib/hooks/loans/useXchangeLoanData";
import { generateX7InitialLiquidityLoanTermNumber } from "~/lib/utils/lending";
import TextTransition from "../TextTransition";

interface LoanTypeDurationProps {
  form: any;
  loanDuration: number;
  setLoanDuration: (value: number) => void;
  loanAddress: Address;
}

export const LoanTypeDuration: React.FC<LoanTypeDurationProps> = ({
  form,
  loanDuration,
  setLoanDuration,
  loanAddress,
}) => {
  const chainId = (useChainId() || 1) as ChainId;
  const { minimumLoanLengthSeconds } = useMinimumLoanLengthSeconds(
    chainId,
    generateX7InitialLiquidityLoanTermNumber(loanAddress.toString(), chainId),
  );
  const { maximumLoanLengthSeconds } = useMaximumLoanLengthSeconds(
    chainId,
    generateX7InitialLiquidityLoanTermNumber(loanAddress.toString(), chainId),
  );

  const minimumLoanLengthDays = Math.ceil(
    minimumLoanLengthSeconds / SECONDS_IN_A_DAY,
  );
  const maximumLoanLengthDays = Math.floor(
    maximumLoanLengthSeconds / SECONDS_IN_A_DAY,
  );

  return (
    <FormField
      control={form?.control}
      defaultValue={loanDuration}
      name="duration"
      render={() => (
        <FormItem className="space-y-3 border-t-2 pt-4">
          <FormLabel className="mt-4 text-sm text-muted-foreground">
            2. Select desired loan duration
          </FormLabel>
          <FormControl>
            <div>
              <span className="mb-2 flex gap-1 text-xl font-bold tabular-nums">
                <div
                  className={cn(
                    `px-0.5`,
                    loanDuration.toString().length > 1 ? "w-8" : "w-4",
                  )}
                >
                  <TextTransition springConfig={config.gentle} direction="down">
                    {loanDuration}
                  </TextTransition>
                </div>
                <span className="text-emerald-500">
                  day{loanDuration > 1 ? "s" : ""}
                </span>
                <span className="ml-auto">
                  <Tag variant="large" color="zinc">
                    {`${minimumLoanLengthDays}-${maximumLoanLengthDays} days available`}
                  </Tag>
                </span>
              </span>
              <Slider
                defaultValue={[loanDuration]}
                step={1}
                min={minimumLoanLengthDays || 1}
                max={maximumLoanLengthDays || 28}
                onValueChange={(newValues: number[]) =>
                  setLoanDuration(newValues[0] ?? 0)
                }
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
