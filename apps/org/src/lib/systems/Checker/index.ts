import type { ComponentType, FC } from "react";

import type { AmountsProps } from "./Amounts";
import { Amounts } from "./Amounts";
import type { ApproveERC20Props } from "./ApproveERC20";
import { ApproveERC20 } from "./ApproveERC20";
import type { ApproveERC20MultipleProps } from "./ApproveERC20Multiple";
import { ApproveERC20Multiple } from "./ApproveERC20Multiple";
import type { GuardProps } from "./Guard";
import { Guard } from "./Guard";
import type { NetworkProps } from "./Network";
import { Network } from "./Network";
import type { ProviderProps } from "./Provider";
import { CheckerProvider as Root } from "./Provider";
import type { SuccessProps } from "./Success";
import { Success } from "./Success";

export interface CheckerProps {
  Amounts: ComponentType<AmountsProps>;
  Network: ComponentType<NetworkProps>;
  Guard: FC<GuardProps>;
  ApproveERC20: ComponentType<ApproveERC20Props>;
  ApproveERC20Multiple: ComponentType<ApproveERC20MultipleProps>;
  Success: FC<SuccessProps>;
  Root: FC<ProviderProps>;
}

export const Checker: CheckerProps = {
  Amounts,
  Network,
  Guard,
  ApproveERC20,
  ApproveERC20Multiple,
  Success,
  Root,
};
