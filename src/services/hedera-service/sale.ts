/* eslint-disable no-unused-vars */
import {
  PrivateKey,
  TokenId,
  TransactionId,
  Client,
  AccountAllowanceApproveTransaction,
  AccountAllowanceDeleteTransaction,
  NftId,
  TransferTransaction,
  AccountId,
  Hbar,
} from '@hashgraph/sdk';
import { splitNftId, freezeWithClient, signWithClient } from './utils/htsUtils';
import { DGVERSE_PROVIDER_ACCOUNT } from '../../Global.d';

export const freeTransferHedera = async (data: any) => {
  try {
    console.log(data);
    if (data.tokenType === 'ft') {
      const transaction = new TransferTransaction()
        .addTokenTransfer(data.tokenId, data.walletAddress, -data.volume)
        .addTokenTransfer(data.tokenId, data.buyerWalletId, data.volume);
      return {
        status: 'success',
        transaction,
      };
    }
    const { tokenId, serialNumber } = splitNftId(data.identifier);
    const tokenIdObj = TokenId.fromString(tokenId);

    const transaction = new TransferTransaction().addNftTransfer(
      tokenIdObj,
      serialNumber,
      data.walletAddress,
      data.buyerWalletId
    );
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

export const approveNftAllowance = async (saleInfo: any) => {
  try {
    /** ********* To support multi NFT transfer ********* */
    // const nftsSerialNumbers = [serialNumber];
    // const nftsToApprove = nftsSerialNumbers.map((num) => new NftId(TokenId.fromString(tokenId), serialNumber));
    // .approveTokenNftAllowanceAllSerials(nft2Approve, owner, spender) // Can approve all serials under a NFT collection else below method we can use
    // nftsToApprove.forEach((nft) => allowanceTx.approveTokenNftAllowance(nft, owner, spender));
    /** ********* To support multi NFT transfer ********* */

    console.log(saleInfo, 'saleInfo');
    const owner = saleInfo.sellerWalletId;
    const spender = DGVERSE_PROVIDER_ACCOUNT;
    const allowanceTx = new AccountAllowanceApproveTransaction().setTransactionMemo(
      `Allowing ${saleInfo.identifier} for sale through dgverse`
    );
    if (saleInfo.tokenType === 'ft') {
      // nftsToApprove = new NftId(TokenId.fromString(tokenId), serialNumber);
      const tokenId = TokenId.fromString(saleInfo.identifier);
      allowanceTx.approveTokenAllowance(tokenId, owner, spender, saleInfo.volume);
    } else {
      const { tokenId, serialNumber } = splitNftId(saleInfo.identifier);
      const nftsToApprove = new NftId(TokenId.fromString(tokenId), serialNumber);
      allowanceTx.approveTokenNftAllowance(nftsToApprove, owner, spender);
    }
    // allowanceTx.approveHbarAllowance(owner, spender, new Hbar(saleInfo.quotedPrice));
    return {
      status: 'success',
      transaction: allowanceTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const nftAllowanceTransferFunction = async (saleInfo: any) => {
  try {
    /** ********* To support multi NFT transfer ********* */
    // const nftsSerialNumbers = [saleInfo.tokenSerials]; // example input array with nft serials
    // const nftsToApprove = nftsSerialNumbers.map((num) => new NftId(tokenId, num));
    // .approveTokenNftAllowanceAllSerials(nft2Approve, owner, spender) // Can approve all serials under a NFT collection else below method we can use
    // nftsToApprove.forEach((nft) => allowanceTx.approveTokenNftAllowance(nft, owner, spender));
    /** ********* To support multi NFT transfer ********* */

    /** ********* Checking balance ********* */
    // const client = Client.forTestnet().setOperator(operatorAccountId, operatorPrivateKey);
    // const accountBalance = await provider.getAccountBalance(saleInfo.buyerWalletId);
    // const buyerAccountBalance = accountBalance.hbars.toBigNumber();
    // if (buyerAccountBalance.toString() < quotedPrice) {
    //   throw new Error(`BUYER ACCOUNT BALANCE NOT SUFFICIENT :-${buyerAccountBalance.toString()}`);
    // }
    // nftsToApprove.forEach((nft) => approvedSendTx.addApprovedNftTransfer(nft, sellerWalletId, buyerWalletId));
    /** ********* To support multi NFT transfer ********* */

    console.log(saleInfo, 'saleInfo');
    const { sellerWalletId, buyerWalletId, quotedPrice, volume } = saleInfo;
    const approvedSendTx = new TransferTransaction().setTransactionMemo(
      `Approved Allowance Transaction, Transferd To Buyer : ${buyerWalletId}`
    );
    if (saleInfo.tokenType === 'nft') {
      const { tokenId, serialNumber } = splitNftId(saleInfo.identifier);
      const nftsToApprove = new NftId(TokenId.fromString(tokenId), serialNumber);
      // Send the nft to buyer
      approvedSendTx.addApprovedNftTransfer(nftsToApprove, sellerWalletId, buyerWalletId);
    } else {
      const tokenId = TokenId.fromString(saleInfo.identifier);
      approvedSendTx
        .addApprovedTokenTransfer(tokenId, sellerWalletId, -volume)
        .addTokenTransfer(tokenId, buyerWalletId, volume);
    }
    approvedSendTx.addHbarTransfer(buyerWalletId, -quotedPrice).addHbarTransfer(sellerWalletId, quotedPrice);
    // .setNodeAccountIds(nodeId);
    // .setTransactionId(transId);
    // const approvedSendTxFreezedWithClient = await freezeWithClient(approvedSendTx.toBytes());
    // .freezeWith(client)
    // approvedSendTxFreezedWithClient.freezeWithSigner(signer);
    // const approvedSendTxSignWithClient = await signWithClient(approvedSendTxFreezedWithClient.toBytes());
    // const signedTrans = await approvedSendTxSignWithClient.sign(operatorPrivateKey);
    return {
      status: 'success',
      transaction: approvedSendTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};

export const deleteNftAllowance = async (saleInfo: any) => {
  try {
    const owner = saleInfo.walletAddress;
    const { tokenId, serialNumber } = splitNftId(saleInfo.identifier);
    const nft2disallow = new NftId(TokenId.fromString(tokenId), serialNumber);
    const allowanceTx = new AccountAllowanceDeleteTransaction().deleteAllTokenNftAllowances(nft2disallow, owner);
    return {
      status: 'success',
      transaction: allowanceTx,
    };
  } catch (error: any) {
    return {
      status: 'error',
      error,
    };
  }
};
