/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMemo } from "react";
import type { FC } from "react";

import { Card, CardContent } from "@x7/ui/card";
import { Collapsible } from "@x7/ui/radix-collapsible";
import { StatLabel, StatValue } from "@x7/ui/stat";
import { CurrencyAmount } from "@x7/utils";
import type { Amount, Currency, Native } from "@x7/utils";

import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens";

interface RemoveSectionPoolInfoCard {
  position: UserPositionsResponse; // Use for left overs
  input0: Amount<Currency | Native> | undefined; // Amount Removing
  input1: Amount<Currency | Native> | undefined; // Amount Removing
  remainingLiquidity: number;
}

export const RemoveSectionPoolInfoCard: FC<RemoveSectionPoolInfoCard> = ({
  position,
  input0,
  input1,
  remainingLiquidity,
}) => {
  const token0Balance = useMemo(() => {
    if (input0 && position) {
      return CurrencyAmount.fromRawAmount(
        input0.currency,
        position.token0.balance!,
      );
    } else {
      return null;
    }
  }, [position, input0]);

  const token1Balance = useMemo(() => {
    if (input1 && position) {
      return CurrencyAmount.fromRawAmount(
        input1.currency,
        position.token1.balance!,
      );
    } else {
      return null;
    }
  }, [position, input1]);

  const remainingShare = useMemo(() => {
    if (remainingLiquidity && position) {
      return (remainingLiquidity / Number(position.liquidity)) * 100;
    } else {
      return 0;
    }
  }, [position, remainingLiquidity]);

  return (
    <Collapsible
      open={Boolean(input0?.greaterThan(0n) && input1?.greaterThan(0n))}
    >
      <Card>
        <CardContent className="grid grid-cols-3 pt-6">
          <div className="flex flex-col items-center justify-center">
            <StatValue size="sm">
              {token0Balance
                ? token0Balance
                    .subtract(input0!)
                    .toFixed(
                      Math.floor(
                        Math.log10(Number(token0Balance?.scale)) / 2,
                      ) ?? 4,
                    )
                : "Unknown"}
            </StatValue>
            <StatLabel size="sm">{position.token0.symbol} Remaining</StatLabel>
          </div>
          <div className="flex flex-col items-center justify-center">
            <StatValue size="sm">
              {" "}
              {token1Balance
                ? token1Balance
                    .subtract(input1!)
                    .toFixed(
                      Math.floor(
                        Math.log10(Number(token1Balance?.scale)) / 2,
                      ) ?? 4,
                    )
                : "Unknown"}
            </StatValue>
            <StatLabel size="sm">{position.token1.symbol} Remaining</StatLabel>
          </div>
          <div className="flex flex-col items-center justify-center">
            <StatValue size="sm">{remainingShare.toFixed(2)}%</StatValue>
            <StatLabel size="sm">Remaining share of pool</StatLabel>
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
};
