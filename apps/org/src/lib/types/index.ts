import type { ChainShortNameType, LoanType } from "@x7/utils";

export interface LoanProps {
  loanId: number;
  loanType: LoanType;
  chain: ChainShortNameType;
}

export enum LendingTabs {
  AllLoans = "all-loans",
  MyOpenLoans = "my-open-loans",
  MyClosedLoans = "my-closed-loans",
  LendingPool = "lending-pool",
  LoanTerms = "loan-terms",
  InitiateLoan = "initiate-loan",
}

export enum GovernanceTabs {
  Proposals = "proposals",
  Stake = "stake",
  MyVotes = "my-votes",
  PreviousProposals = "previous-proposals",
}

export enum FundingTabs {
  Fund = "fund",
  History = "history",
}

export enum LiquidityTabs {
  AllPools = "all-pools",
  MyOpenPositions = "my-open-positions",
  MyClosedPositions = "my-closed-positions",
  Add = "add",
}

export enum DeployerTabs {
  DeployForm = "deploy-form",
  PreviousDeployments = "previous-deployments",
}

export enum CreateTabs {
  Create = "create",
  Manage = "manage",
  Deployer = "deployer",
}
