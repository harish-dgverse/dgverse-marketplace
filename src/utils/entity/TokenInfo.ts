/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

export enum TokenSupplyType {
  INFINITE = 'INFINITE',
  FINITE = 'FINITE',
}

interface TokenInfoKey {
  key: string;
  _type: string;
}

export interface TokenInfo {
  admin_key: TokenInfoKey | null;
  auto_renew_account: string | null;
  auto_renew_period: string | null;
  created_timestamp: string | null;
  decimals: number;
  expiry_timestamp: string | null;
  freeze_default: boolean;
  fee_schedule_key: TokenInfoKey | null;
  freeze_key: TokenInfoKey | null;
  initial_supply: string | null;
  kyc_key: TokenInfoKey | null;
  name: string | null;
  supply_key: TokenInfoKey | null;
  deleted: boolean;
  symbol: string | null;
  token_id: string | null;
  total_supply: string | null;
  treasury_account_id: string | null;
  type?: 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE';
  supply_type: TokenSupplyType;
  wipe_key: string | null;
  custom_fees?: string | null;
  pause_key: TokenInfoKey | null;
  pause_status: string | null;
  max_supply: string | null;
}
