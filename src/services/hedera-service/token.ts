/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable import/prefer-default-export */
// import { HashConnect } from 'hashconnect'
import {
  AccountId,
  Status,
  TokenUnpauseTransaction,
  TokenPauseTransaction,
  TokenDissociateTransaction,
  TokenAssociateTransaction,
  TokenFreezeTransaction,
  TokenUnfreezeTransaction,
  TokenGrantKycTransaction,
  TokenRevokeKycTransaction,
  TokenDeleteTransaction,
  Timestamp,
  PublicKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenId,
  CustomFee,
  CustomFixedFee,
  CustomRoyaltyFee,
  Hbar,
  HbarUnit,
  TransactionId,
} from '@hashgraph/sdk';
import axios from 'axios';
import { MIRROR_NODE } from '../../Global.d';
import { hashconnect } from './hashconnect.service';

export const createCollectionHedera = async (payload: any) => {
  try {
    let symbol;
    let tokenType = TokenType.NonFungibleUnique;
    let initialSupply;
    if (payload.tokenType === 'Non fungible token (NFT)') {
      symbol = payload.name;
      initialSupply = 0;
    } else if (payload.tokenType === 'Fungible token (FT)') {
      symbol = payload.symbol;
      tokenType = TokenType.FungibleCommon;
      initialSupply = payload.initialSupply;
    } else if (payload.tokenType === 'Soul bound token (SBT)') {
      symbol = payload.name;
      initialSupply = 0;
    }
    const accountInfo = await axios.get(`${MIRROR_NODE}/accounts/${payload.walletAddress}`).then((res) => res.data);

    if (!accountInfo.key?.key) {
      throw new Error('Error while trying to fetch user Public key.');
    }
    const key = PublicKey.fromString(accountInfo.key.key);
    const ninetyDaysSeconds = 60 * 60 * 24 * 90;
    const secondsNow = Math.round(Date.now() / 1000);
    const timestamp = secondsNow + ninetyDaysSeconds;
    const timestampObj = new Timestamp(timestamp, 0);
    const tokenCreate = new TokenCreateTransaction();
    const memo = payload.description ? payload.description.substring(0, 100) : `${payload.name} by ${payload.walletAddress}`;
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
    //     .setFeeCollectorAccountId(walletAddress);
    //   customFees.push(royaltyInfo);
    // }
    tokenCreate
      .setMaxTransactionFee(40)
      .setTokenName(payload.name)
      .setTokenSymbol(symbol)
      .setTokenType(tokenType)
      .setDecimals(payload.decimal)
      .setInitialSupply(initialSupply)
      .setTreasuryAccountId(payload.walletAddress)
      // .setCustomFees(customFees)
      .setTokenMemo(memo)
      .setSupplyKey(key)
      .setExpirationTime(timestampObj);
    // .setAutoRenewPeriod(timestamp);
    if (payload.tokenType === 'Fungible token (FT)' || payload.tokenType === 'Non fungible token (NFT)') {
      if (payload.immutable === false) tokenCreate.setAdminKey(key);
      if (payload.kycKey === true) tokenCreate.setKycKey(key);
      if (payload.defaultFreezeStatus === true) {
        tokenCreate.setFreezeDefault(true);
        tokenCreate.setFreezeKey(key);
      } else if (payload.freezeKey === true) tokenCreate.setFreezeKey(key);
      if (payload.wipeKey === true) tokenCreate.setWipeKey(key);
      if ((payload.royaltyStatus && payload.royaltyPercent) || payload.customFeeKey === true) {
        tokenCreate.setFeeScheduleKey(key);
      }
      if (payload.pauseKey === true) tokenCreate.setPauseKey(key);
      if (payload.maxSupply) {
        tokenCreate.setMaxSupply(payload.maxSupply);
        tokenCreate.setSupplyType(TokenSupplyType.Finite);
      }
    } else {
      tokenCreate.setFreezeDefault(true);
      tokenCreate.setFreezeKey(key);
      tokenCreate.setWipeKey(key);
      if (payload.maxSupply) {
        tokenCreate.setMaxSupply(payload.maxSupply);
        tokenCreate.setSupplyType(TokenSupplyType.Finite);
      }
    }

    return {
      status: 'success',
      transaction: tokenCreate,
    };
  } catch (error: any) {
    console.log(error);
    return {
      status: 'error',
      error,
    };
  }
};

export const deleteCollectionHedera = async (payload: any) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    const transaction = new TokenDeleteTransaction().setTokenId(tokenId);
    return {
      status: 'success',
      transaction,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const tokenAssociate = async (payload: any, selectedAction: string) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    let tokenAssociateTx;
    if (selectedAction === 'associate') tokenAssociateTx = new TokenAssociateTransaction();
    else tokenAssociateTx = new TokenDissociateTransaction();
    tokenAssociateTx.setAccountId(payload.walletAddress).setTokenIds([tokenId]);
    return {
      status: 'success',
      transaction: tokenAssociateTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const tokenPause = async (payload: any, selectedAction: string) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    let tokenPauseTx;
    if (selectedAction === 'pause') tokenPauseTx = new TokenPauseTransaction();
    else tokenPauseTx = new TokenUnpauseTransaction();
    tokenPauseTx.setTokenId(tokenId);
    return {
      status: 'success',
      transaction: tokenPauseTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const freezeAccount = async (payload: any, selectedAction: string) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    const freezeAccountId = AccountId.fromString(payload.accountId);
    // Freeze an account from transferring a token
    let freezeTx;
    if (selectedAction === 'freeze') freezeTx = new TokenFreezeTransaction();
    else freezeTx = new TokenUnfreezeTransaction();
    freezeTx.setAccountId(freezeAccountId).setTokenId(tokenId);
    return {
      status: 'success',
      transaction: freezeTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const kycAccount = async (payload: any, selectedAction: string) => {
  try {
    const tokenId = TokenId.fromString(payload.tokenId);
    const kycAccId = AccountId.fromString(payload.accountId);
    let transaction;
    if (selectedAction === 'enableKyc') transaction = new TokenGrantKycTransaction();
    else transaction = new TokenRevokeKycTransaction();
    transaction.setAccountId(kycAccId).setTokenId(tokenId);
    return {
      status: 'success',
      transaction,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};
