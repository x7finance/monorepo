import React, { useCallback, useEffect, useMemo, useState } from "react";
import { config } from "@react-spring/web";

import { cn } from "@x7/css";
import { CheckCircleIcon, PlusCircleIcon } from "@x7/icons";
import { X7ContractsEnum } from "@x7/sdk";
import { Button } from "@x7/ui/button";
import { Slider } from "@x7/ui/slider";
import type { ActiveChainId, Native, Token } from "@x7/utils";
import { CurrencyAmount } from "@x7/utils";

import { CurrencyInput } from "~/lib/components/utils/currency-input";
import { APPROVE_TAG_REMOVE } from "~/lib/constants/misc";
import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens";
import { Checker } from "~/lib/systems/Checker";
import { CheckerProvider } from "~/lib/systems/Checker/Provider";
import pDebounce from "~/lib/utils/debounce";
import TextTransition from "../../loans/TextTransition";
import { ConfirmLiquidityRemoval } from "../confirm-liquidity-removal";
import { LockedAmountsPoolInfoCard } from "../locked-amounts-pool-info-card";
import { RemoveSectionPoolInfoCard } from "../remove-section-pool-info-card";

const MAX_PERCENTAGE = 10000n;
const FULL_REMOVAL_PERCENTAGE = 99.999999999;

export const RemoveLiquidityTab = ({
  token0,
  token1,
  liquidityToken,
  position,
  chainId,
}: {
  token0: Token | Native;
  token1: Token | Native;
  liquidityToken: Token;
  position: UserPositionsResponse;
  chainId: ActiveChainId;
}) => {
  const maxRemovablePercentage = useMemo(() => {
    const token0Total = position.token0.balance ?? 0n;
    const token1Total = position.token1.balance ?? 0n;
    const token0Locked = position.token0.minimumBalance;
    const token1Locked = position.token1.minimumBalance;

    if (token0Total === 0n || token1Total === 0n) return 0;

    const token0Unlocked =
      token0Total > token0Locked ? token0Total - token0Locked : 0n;
    const token1Unlocked =
      token1Total > token1Locked ? token1Total - token1Locked : 0n;

    const token0Percentage = Number((token0Unlocked * 10000n) / token0Total);
    const token1Percentage = Number((token1Unlocked * 10000n) / token1Total);

    const maxPercentage = Math.min(token0Percentage, token1Percentage) / 100;
    return maxPercentage >= 99.99 ? FULL_REMOVAL_PERCENTAGE : maxPercentage;
  }, [position]);

  const [liquidityPercentage, setLiquidityPercentage] = useState<number>(() =>
    Math.min(50, maxRemovablePercentage / 2),
  );
  const [remainingLiquidity, setRemainingLiquidity] = useState<number>(0);
  const [removingAmm, setRemovingAmm] = useState<CurrencyAmount<Token>>();
  const [token0Amt, setToken0Amt] = useState<CurrencyAmount<Token | Native>>();
  const [token1Amt, setToken1Amt] = useState<CurrencyAmount<Token | Native>>();
  const [refetchCount, setRefetchCount] = useState<number>(0);
  const [typedAmounts, setTypedAmounts] = useState<{
    input0: string;
    input1: string;
  }>({ input0: "", input1: "" });

  const handleSliderChange = useCallback(
    (newValues: number[]) => {
      const debouncedUpdate = pDebounce((values: number[]) => {
        const newValue = values[0];
        if (typeof newValue === "number" && !isNaN(newValue)) {
          const roundedValue = Math.min(
            Number(newValue.toFixed(9)),
            maxRemovablePercentage,
          );
          setLiquidityPercentage(roundedValue);
        }
      }, 100);
      debouncedUpdate(newValues).catch(console.error);
    },
    [maxRemovablePercentage],
  );

  const calculateWithdrawableAmounts = useMemo(() => {
    if (!position.tokenBalance) {
      return {
        token0Withdrawable: 0n,
        token1Withdrawable: 0n,
        amountOfLiquidity: 0n,
      };
    }

    const percentageBigInt = BigInt(Math.floor(liquidityPercentage * 100));
    return calculateLockedWithdrawal(percentageBigInt, position);
  }, [liquidityPercentage, position]);

  useEffect(() => {
    const { token0Withdrawable, token1Withdrawable, amountOfLiquidity } =
      calculateWithdrawableAmounts;

    const _t0Amt = CurrencyAmount.fromRawAmount(token0, token0Withdrawable);
    const _t1Amt = CurrencyAmount.fromRawAmount(token1, token1Withdrawable);

    setToken0Amt(_t0Amt);
    setToken1Amt(_t1Amt);
    setRemovingAmm(
      CurrencyAmount.fromRawAmount(liquidityToken, amountOfLiquidity),
    );
    setRemainingLiquidity(
      Number(position.tokenBalance?.toString()) - Number(amountOfLiquidity),
    );
    setTypedAmounts({
      input0: `${_t0Amt.toFixed(6)}`,
      input1: `${_t1Amt.toFixed(6)}`,
    });
  }, [
    calculateWithdrawableAmounts,
    token0,
    token1,
    liquidityToken,
    position.tokenBalance,
  ]);

  const lockedAmount0 = position.token0.minimumBalance;
  const lockedAmount1 = position.token1.minimumBalance;

  const isRemovalDisabled = maxRemovablePercentage === 0;
  const isFullRemovalPossible =
    maxRemovablePercentage === FULL_REMOVAL_PERCENTAGE;

  const ticks = Array.from({ length: 11 }, (_, i) => (i * maxRemovablePercentage) / 10);
  const skipInterval = 2;

  return (
    <div className="flex flex-col">
      <div className="space-y-3 border-t-2 pt-5">
        <h3 className="text-sm text-muted-foreground">
          1. Select amount of your position you are wanting to withdraw
        </h3>
        <div className="text-xs leading-5 dark:text-zinc-500">
          {isRemovalDisabled
            ? "All liquidity is locked. You cannot remove any liquidity at this time."
            : isFullRemovalPossible
              ? "You can withdraw up to 100% of your position."
              : `You can withdraw up to ${maxRemovablePercentage < 0.01 ? maxRemovablePercentage.toFixed(4) : maxRemovablePercentage.toFixed(2)}% of your position due to locked liquidity`}
        </div>
        <div className="flex">
          <div>Remove</div>
          <div className="mx-1 font-bold text-emerald-500">
            <TextTransition springConfig={config.gentle} direction="down">
              {liquidityPercentage < 0.01
                ? liquidityPercentage.toFixed(4)
                : liquidityPercentage.toFixed(2)}
              %
            </TextTransition>
          </div>
          <div>of your position</div>
        </div>
        <div>
          <Slider
            defaultValue={[liquidityPercentage]}
            value={[liquidityPercentage]}
            step={0.0001}
            min={0}
            max={maxRemovablePercentage}
            onValueChange={handleSliderChange}
            disabled={isRemovalDisabled}
            className={cn(
              isRemovalDisabled ? "cursor-not-allowed opacity-50" : "",
              "mb-6",
            )}
          />
          <span
            className="mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
            aria-hidden="true"
          >
            {ticks.map((tick, i) => (
              <span
                key={i}
                className="flex w-0 flex-col items-center justify-center gap-2"
              >
                <span
                  className={cn(
                    "h-1 w-px bg-emerald-500",
                    i % skipInterval !== 0 && "h-0.5",
                  )}
                />
                <span className={cn(i % skipInterval !== 0 && "opacity-0")}>
                  {tick < 0.01 ? tick.toFixed(2) : tick.toFixed(2)}%
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-6">
        <h3 className="text-sm text-muted-foreground">2. Verify amounts</h3>
        <div className="text-xs leading-5 dark:text-zinc-500">
          Below is an estimation to how much of each token you will be
          withdrawing from the pool
        </div>

        <div className="flex flex-col gap-4">
          <CurrencyInput
            id="remove-liquidity-token0"
            type="INPUT"
            className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
            chainId={chainId}
            value={typedAmounts.input0}
            onChange={console.log}
            onSelect={console.log}
            currency={token0}
            disabled={true}
            loading={false}
            disableMaxButton={true}
            disableInsufficientBalanceError={true}
            refetchCounter={refetchCount}
          />
          <div className="left-0 right-0 mb-[-24px] mt-[-24px] flex items-center justify-center">
            <button
              type="button"
              className="z-10 rounded-full border border-accent bg-emerald-500/80 p-2 dark:bg-background"
            >
              <PlusCircleIcon
                strokeWidth={3}
                className="h-4 w-4 text-white dark:text-emerald-500"
              />
            </button>
          </div>
          <CurrencyInput
            id="remove-liquidity-token1"
            type="INPUT"
            className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
            chainId={chainId}
            value={typedAmounts.input1}
            onChange={console.log}
            onSelect={console.log}
            currency={token1}
            disabled={true}
            loading={false}
            disableMaxButton={true}
            disableInsufficientBalanceError={true}
            refetchCounter={refetchCount}
          />
          {(lockedAmount0 > 0 || lockedAmount1 > 0) && (
            <LockedAmountsPoolInfoCard position={position} />
          )}
          <RemoveSectionPoolInfoCard
            position={position}
            input0={token0Amt}
            input1={token1Amt}
            remainingLiquidity={remainingLiquidity}
          />
          <CheckerProvider>
            <Checker.Network fullWidth chainId={chainId}>
              <h3 className="mt-2 text-sm text-muted-foreground">
                3. Approve the removal of your liquidity from pool.
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Checker.ApproveERC20
                    id="approve-amm-token"
                    className="whitespace-nowrap"
                    variant={"default"}
                    size="default"
                    fullWidth
                    amount={removingAmm}
                    contract={X7ContractsEnum.XchangeRouter(chainId)}
                  >
                    <Button
                      variant={"outline"}
                      icon={CheckCircleIcon}
                      iconPosition="end"
                      iconProps={{
                        className: "h-3 w-3 relative left-2 text-emerald-500",
                      }}
                      fullWidth
                    >
                      Approved Removal
                    </Button>
                  </Checker.ApproveERC20>
                </div>
                <h3 className="mt-4 text-sm text-muted-foreground">
                  4. Execute the removal of your liquidity from pool.
                </h3>
              </div>

              <Checker.Success tag={APPROVE_TAG_REMOVE}>
                <ConfirmLiquidityRemoval
                  poolAddress={position.contractAddress}
                  contract={X7ContractsEnum.XchangeRouter(chainId)}
                  position={position}
                  chainId={chainId}
                  token0={token0}
                  token1={token1}
                  input0={token0Amt}
                  input1={token1Amt}
                  ammInput={removingAmm}
                  fees={{
                    token0: position.token0.fees,
                    token1: position.token1.fees,
                  }}
                  liquidityRemoving={removingAmm}
                  onSuccess={() => {
                    setTypedAmounts({ input0: "", input1: "" });
                    setRefetchCount(refetchCount + 1);
                  }}
                />
              </Checker.Success>
            </Checker.Network>
          </CheckerProvider>
        </div>
      </div>
    </div>
  );
};

function calculateLockedWithdrawal(
  percentageBigInt: bigint,
  position: UserPositionsResponse,
) {
  const token0Total = position.token0.balance ?? 0n;
  const token1Total = position.token1.balance ?? 0n;
  const token0Locked = position.token0.minimumBalance / 10n ** BigInt(position.token0.decimals);
  const token1Locked = position.token1.minimumBalance / 10n ** BigInt(position.token1.decimals);

  const token0Unlocked =
    token0Total > token0Locked ? token0Total - token0Locked : 0n;
  const token1Unlocked =
    token1Total > token1Locked ? token1Total - token1Locked : 0n;

  if (
    token0Unlocked === 0n ||
    token1Unlocked === 0n ||
    position.tokenBalance === undefined
  ) {
    return {
      token0Withdrawable: 0n,
      token1Withdrawable: 0n,
      amountOfLiquidity: 0n,
    };
  }

  const effectiveLiquidityBalance =
    position.tokenBalance / MAX_PERCENTAGE;
  const amountOfLiquidity =
    effectiveLiquidityBalance * percentageBigInt;

  const token0Withdrawable =
    (amountOfLiquidity * token0Unlocked) / position.tokenBalance;
  const token1Withdrawable =
    (amountOfLiquidity * token1Unlocked) / position.tokenBalance;

  return { token0Withdrawable, token1Withdrawable, amountOfLiquidity };
}
