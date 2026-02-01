/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import type { FC } from "react";
import { useState } from "react";
import type { Address } from "viem";

import { cn } from "@x7/css";
import { InfoIcon } from "@x7/icons";
import type { ButtonProps } from "@x7/ui/button";
import { Button } from "@x7/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@x7/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@x7/ui/hover-card";
import { LinkInternal } from "@x7/ui/link";
import { Select, SelectContent, SelectItem } from "@x7/ui/select";
import type { Currency, CurrencyAmount } from "@x7/utils";
import { Native } from "@x7/utils";

import { DocsLinks } from "~/types/links";
import {
  ApprovalState,
  useTokenApproval,
} from "../../hooks/approvals/useTokenApproval";

interface ApproveERC20Props extends ButtonProps {
  id: string;
  amount: CurrencyAmount<Currency> | undefined;
  contract: Address | undefined;
  enabled?: boolean;
}

const ApproveERC20: FC<ApproveERC20Props> = ({
  amount,
  contract,
  children,
  className,
  fullWidth = true,
  size = "lg",
  enabled = true,
  ...props
}) => {
  const [max, setMax] = useState(false);
  const [state, approval, data] = useTokenApproval({
    amount,
    spender: contract,
    enabled,
    approveMax: max,
  });

  if (
    state === ApprovalState.APPROVED ||
    !enabled ||
    amount?.currency.equals(Native.onChain(amount.currency.chainId).wrapped)
  ) {
    return <>{children}</>;
  }

  const loading =
    [
      ApprovalState.UNKNOWN,
      ApprovalState.LOADING,
      ApprovalState.PENDING,
    ].includes(state) || approval.isPending;

  return (
    <Select
      value={`${max}`}
      onValueChange={(val: string) => setMax(val === "true")}
    >
      <HoverCard openDelay={0} closeDelay={0}>
        <Button
          variant={props?.variant ?? "primary"}
          disabled={
            state !== ApprovalState.NOT_APPROVED ||
            !approval.writeContract ||
            approval.isPending
          }
          className={cn(className, "group relative w-full gap-2")}
          loading={loading || approval.isPending}
          // @ts-expect-error: todo fix
          onClick={() => approval.writeContract(data?.request)}
          fullWidth={fullWidth}
          size={size}
          {...props}
        >
          Approve {amount?.currency.symbol} {max ? "Permanently" : ""}
          <HoverCardTrigger>
            <span className="">
              <InfoIcon width={16} height={16} />
            </span>
          </HoverCardTrigger>
          {/* <div className={cn(fullWidth ? "absolute" : "", "right-2")}>
            <SelectTrigger asChild>
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "xs",
                  }),
                  "h-full w-full px-2 py-3",
                )}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </SelectTrigger>
          </div> */}
        </Button>
        <HoverCardContent className="max-w-[320px] p-0!">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">
              Approve ERC20
            </CardTitle>
            <CardDescription>
              Xchange needs approval to execute this transaction on your behalf.{" "}
              <LinkInternal
                prefetch={true}
                target="_blank"
                className="font-medium text-emerald-500 hover:underline"
                href={DocsLinks.Index}
              >
                Learn more
              </LinkInternal>
            </CardDescription>
          </CardHeader>
        </HoverCardContent>
      </HoverCard>
      <SelectContent className="w-80">
        <SelectItem value="false">
          <div className="flex flex-col">
            <span className="font-semibold">Approve one-time only</span>
            <span className="text-muted-foreground text-xs">
              You&apos;ll give your approval to spend{" "}
              <b>
                {amount?.toFixed(6)} {amount?.currency.symbol}
              </b>{" "}
              on your behalf
            </span>
          </div>
        </SelectItem>
        <SelectItem value="true">
          <div className="flex flex-col">
            <span className="font-semibold">Approve unlimited amount</span>
            <span className="text-muted-foreground text-xs">
              You won&apos;t need to approve again next time you want to
              interact with <b>{amount?.currency.symbol}</b>.
            </span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export { ApproveERC20, type ApproveERC20Props };
