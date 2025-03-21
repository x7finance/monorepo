"use client";

import { useChainId } from "wagmi";

import { Button } from "@x7/ui/button";
import { Tag } from "@x7/ui/tag";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";
import type { ChainId } from "@x7/utils";

import { useLiquidateLoan } from "~/lib/hooks/loans/useLiquidateLoan";

interface IconAlertsProps {
  liquidationAmount: number;
  canLiquidate: number;
  loanState: number;
  loanId: number;
  chainId: ChainId;
}

export function IconAlerts({
  liquidationAmount,
  canLiquidate,
  loanState,
  loanId = 0,
  chainId,
}: IconAlertsProps) {
  const currentChainId = useChainId();
  const isCorrectNetwork = currentChainId === chainId;
  const { writeContract, data, isPending } = useLiquidateLoan({ loanId });

  const handleLiquidate = () => {
    // @ts-expect-error: todo fix
    writeContract(data?.request);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="">
        <Tooltip>
          <TooltipTrigger>
            {liquidationAmount === -1 ? (
              <Tag variant="large" color="rose">
                Liquidated
              </Tag>
            ) : loanState === 0 ? (
              <Tag variant="large" color="zinc">
                Active
              </Tag>
            ) : loanState === 1 ? (
              <Tag variant="large" color="emerald">
                Complete
              </Tag>
            ) : (
              <></>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <span>
              {liquidationAmount === -1
                ? "Liquidated"
                : loanState === 0
                  ? "Loan Active"
                  : loanState === 1
                    ? "Loan Paid"
                    : ""}
            </span>
          </TooltipContent>
        </Tooltip>
      </span>
      <span className="">
        {canLiquidate > 0 ? (
          <Button
            size={"xs"}
            variant={"default"}
            loading={isPending}
            onClick={handleLiquidate}
            disabled={!isCorrectNetwork}
          >
            Liquidate
          </Button>
        ) : (
          <></>
        )}
      </span>
    </div>
  );
}
