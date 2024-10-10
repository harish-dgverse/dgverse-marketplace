/* eslint-disable no-unused-vars */
import {
  Hbar,
  TokenCreateTransaction,
  TokenMintTransaction,
  TransactionId,
  TransferTransaction,
  AccountId,
  TokenId,
  TokenType,
  TokenSupplyType,
  TokenUpdateTransaction,
  Key,
  Timestamp,
  PublicKey,
} from '@hashgraph/sdk';
import { Buffer } from 'buffer';
import prepareFees from '../utils/helpers/prepareFees';
import { Fees } from '../utils/entity/Fees';
import { AdditionalDetails } from '../utils/entity/AdditionalDetails';
import { HEDERA_NETWORK } from '../Global.d';

export type AccountInfo = Response & {
  result?: string;
  key?: {
    key: string;
  };
};

export type NewTokenType = {
  accountId: string;
  tokenName: string;
  tokenSymbol: string;
  amount: number;
  pause_key?: boolean;
  customFees?: Fees[];
  keys?: string[];
  userId: number;
  description: string;
  additionalDetails?: AdditionalDetails[];
  socialMedia?: AdditionalDetails[];
};

type UpdateTokenProps =
  | {
      tokenId?: string | TokenId;
      tokenName?: string;
      tokenSymbol?: string;
      treasuryAccountId?: string | AccountId;
      adminKey?: Key;
      kycKey?: Key;
      freezeKey?: Key;
      wipeKey?: Key;
      supplyKey?: Key;
      autoRenewAccountId?: string | AccountId;
      expirationTime?: Date | Timestamp;
      autoRenewPeriod?: number;
      tokenMemo?: string;
      feeScheduleKey?: Key;
      pauseKey?: Key;
    }
  | undefined;
// NewTokenType
export default class HTS {
  static async createToken({ ...tokenProps }: NewTokenType): Promise<TokenCreateTransaction> {
    const accountInfo: AccountInfo = await window
      .fetch(
        `https://${HEDERA_NETWORK === 'mainnet' ? 'mainnet-public' : HEDERA_NETWORK}.mirrornode.hedera.com/api/v1/accounts/${
          tokenProps.accountId
        }`,
        { method: 'GET' }
      )
      .then((res) => res.json());

    if (!accountInfo.key?.key) {
      throw new Error('Error while trying to fetch user Public key.');
    }

    // 90 days
    const expirationTime = new Date(Date.now() + 7776000 * 1000);

    const key = PublicKey.fromString(accountInfo.key.key);
    const memo = tokenProps.description
      ? tokenProps.description.substring(0, 100)
      : `${tokenProps.tokenName} by ${tokenProps.accountId}`;
    const token = new TokenCreateTransaction({
      tokenType: TokenType.NonFungibleUnique,
      supplyType: TokenSupplyType.Finite,
      decimals: 0,
      initialSupply: 0,
      expirationTime,
      treasuryAccountId: tokenProps.accountId,
      tokenMemo: memo,
      supplyKey: key,
      pauseKey: tokenProps.pause_key ? key : undefined,
    });
    // Royalty fee for provider
    // const customFees: CustomFee[] = [];
    // const providerAccount = '0.0.14956270';
    // const fallback = new CustomFixedFee()
    //   .setFeeCollectorAccountId(providerAccount)
    //   .setHbarAmount(Hbar.from(1, HbarUnit.Hbar));

    // const providerInfo = new CustomRoyaltyFee()
    //   .setNumerator(2)
    //   .setDenominator(100)
    //   .setFeeCollectorAccountId(providerAccount)
    //   .setFallbackFee(fallback);

    // customFees.push(providerInfo);

    // // Royalty fee for user
    // if (payload.royaltyStatus && payload.royaltyPercent) {
    //   const royaltyInfo = new CustomRoyaltyFee()
    //     .setNumerator(payload.royaltyPercent)
    //     .setDenominator(100)
    //     .setFeeCollectorAccountId(accountId);
    //   customFees.push(royaltyInfo);
    // }
    // .setCustomFees(customFees)
    // .setAutoRenewPeriod(timestamp);
    // if (payload.immutable === false) tokenCreate.setAdminKey(key);
    // if (payload.kycKey === true) tokenCreate.setKycKey(key);
    // if (payload.defaultFreezeStatus === true) {
    //   tokenCreate.setFreezeDefault(true);
    //   tokenCreate.setFreezeKey(key);
    // } else if (payload.freezeKey === true) tokenCreate.setFreezeKey(key);
    // if (payload.wipeKey === true) tokenCreate.setWipeKey(key);
    // if ((payload.royaltyStatus && payload.royaltyPercent) || payload.customFeeKey === true) {
    //   tokenCreate.setFeeScheduleKey(key);
    // }
    // if (payload.pauseKey === true) tokenCreate.setPauseKey(key);
    // if (payload.maxSupply) {
    //   tokenCreate.setMaxSupply(payload.maxSupply);
    //   tokenCreate.setSupplyType(TokenSupplyType.Finite);
    // }
    token.setMaxTransactionFee(50).setAutoRenewAccountId(tokenProps.accountId).setAutoRenewPeriod(7776000);

    return token;
  }

  static mintToken(tokenId: string | TokenId, acc1: string, cids: string[]) {
    console.log(tokenId, 'a', acc1, 'c', cids);
    const txID = TransactionId.generate(acc1);
    const meta = cids.map((cid) => Buffer.from(`ipfs://${cid}`));

    const mintTx = new TokenMintTransaction()
      .setTransactionId(txID)
      .setTokenId(tokenId)
      .setNodeAccountIds([new AccountId(3)])
      .setMetadata(meta)
      .freeze();

    return mintTx;
  }

  static updateToken(tokenId: string | TokenId, acc1: string, newValues: UpdateTokenProps) {
    const txID = TransactionId.generate(acc1);

    const updateTx = new TokenUpdateTransaction(newValues)
      .setTransactionId(txID)
      .setTokenId(tokenId)
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    return updateTx;
  }

  static sendNFT(tokenId: string | TokenId, serial: number, sender: string, receiver: string) {
    const txID = TransactionId.generate(sender);

    const tx = new TransferTransaction()
      .setTransactionId(txID)
      .addNftTransfer(tokenId, serial, sender, receiver)
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    return tx;
  }

  static transfer(acc1: string, acc2: string) {
    const txID = TransactionId.generate(acc1);
    const tx = new TransferTransaction()
      .setTransactionId(txID)
      .addHbarTransfer(acc1, new Hbar(-1))
      .addHbarTransfer(acc2, new Hbar(1))
      .setNodeAccountIds([new AccountId(3)])
      .freeze();

    return tx;
  }
}
