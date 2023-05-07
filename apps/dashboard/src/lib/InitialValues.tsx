import { ContractsEnum } from './types';

interface TokenBalanceData {
  balance: number;
}

export interface TokenBalanceV1 {
  x7dao: TokenBalanceData;
  x7m105: TokenBalanceData;
  x7: TokenBalanceData;
  x7001: TokenBalanceData;
  x7002: TokenBalanceData;
  x7003: TokenBalanceData;
  x7004: TokenBalanceData;
  x7005: TokenBalanceData;
}

export interface TokenBalanceV2 {
  x7dao: TokenBalanceData;
  x7r: TokenBalanceData;
  // x7d?: TokenBalanceData,
  x7101: TokenBalanceData;
  x7102: TokenBalanceData;
  x7103: TokenBalanceData;
  x7104: TokenBalanceData;
  x7105: TokenBalanceData;
}

interface AlreadyMigratedArrayData {
  address: string;
  value: number;
}

interface AlreadyMigratedTokensData {
  contract: string;
  alreadyMigrated: Array<AlreadyMigratedArrayData>;
}

export interface AlreadyMigratedTokens {
  x7m105: AlreadyMigratedTokensData;
  x7: AlreadyMigratedTokensData;
  x7dao: AlreadyMigratedTokensData;
  x7001: AlreadyMigratedTokensData;
  x7002: AlreadyMigratedTokensData;
  x7003: AlreadyMigratedTokensData;
  x7004: AlreadyMigratedTokensData;
  x7005: AlreadyMigratedTokensData;
}

export interface MigratedTokensData {
  amount: number;
  percentage: number;
  formattedAmount: number;
}

export interface MigratedTokens {
  x7m105: MigratedTokensData;
  x7: MigratedTokensData;
  x7daoV1: MigratedTokensData;
  x7001: MigratedTokensData;
  x7002: MigratedTokensData;
  x7003: MigratedTokensData;
  x7004: MigratedTokensData;
  x7005: MigratedTokensData;
}

export const initialStatus = {
  x7r: { balance: 0, address: ContractsEnum.X7R },
  x7dao: { balance: 0, address: ContractsEnum.X7DAO },
  x7101: { balance: 0, address: ContractsEnum.X7101 },
  x7102: { balance: 0, address: ContractsEnum.X7102 },
  x7103: { balance: 0, address: ContractsEnum.X7103 },
  x7104: { balance: 0, address: ContractsEnum.X7104 },
  x7105: { balance: 0, address: ContractsEnum.X7105 },
};

export const initialUserMigratedTokens = {
  x7m105: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7dao: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7001: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7002: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7003: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7004: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
  x7005: { amount: 0, percentage: 0, formattedAmount: 0, status: false },
};

export const initialMigratedTokens = {
  x7m105: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7daoV1: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7001: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7002: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7003: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7004: { amount: 0, percentage: 0, formattedAmount: 0 },
  x7005: { amount: 0, percentage: 0, formattedAmount: 0 },
};
