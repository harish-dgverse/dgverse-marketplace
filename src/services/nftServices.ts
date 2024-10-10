/* eslint-disable no-unused-vars */
import axios from '../api/axios';
import { removeEmptyValues, isCypressTesting } from '../utils/commonUtils';
import { freezeAccount, tokenPause, kycAccount } from './hedera-service/token';
import { burnToken, wipeToken, mintNftHedera } from './hedera-service/nft';
import { uploadMetadata } from './hedera-service/metadata.service';
import { getNftId, handleHederaResponse } from './hedera-service/utils/htsUtils';
import { checkCurrentStatusUserToToken } from './miscServices';
import { uploadBlobToStorage } from './fileUploadService';
import {
  freeTransferHedera,
  approveNftAllowance,
  nftAllowanceTransferFunction,
  deleteNftAllowance,
} from './hedera-service/sale';
import { sendTransaction } from './executeTransaction';

export const mintNft = async ({
  payload,
  displayPicAfterCrop,
  coverPicAfterCrop,
  nftArtifact,
  metadata,
}: {
  payload: any;
  displayPicAfterCrop: any;
  coverPicAfterCrop: any;
  nftArtifact: any;
  metadata: any;
}) => {
  const payloadData = payload;
  console.log(payloadData);
  let ipfsResponse;
  console.log(payload.tokenType);
  if (payload.tokenType === 'nft' || payload.tokenType === 'sbt') {
    console.log('inside ipfs');
    // const ipfsResponse = { metadataCid: '' };
    ipfsResponse = await uploadMetadata(metadata, nftArtifact);
    if (ipfsResponse?.response?.status === 400)
      throw new Error(`while creating metadata for ${payload.tokenType.toUpperCase()}`);
  }
  console.log(ipfsResponse);
  let tokenTransactionReceipt: any;
  if (isCypressTesting()) {
    tokenTransactionReceipt = {
      nftId: `${payload.token_id}.1`,
      serials: ['1'],
      totalSupply: '10',
    };
  } else {
    const transactionRx: any = await mintNftHedera(payloadData, [ipfsResponse?.metadataCid]);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    tokenTransactionReceipt = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS') throw new Error('Error occured while minting');
  }

  payloadData.totalSupply = tokenTransactionReceipt?.totalSupply?.toString();
  if (payload.tokenType === 'nft' || payload.tokenType === 'sbt') {
    const serialNumber = tokenTransactionReceipt.serials[0].toString();
    const nftId = getNftId(payloadData.tokenId, serialNumber);
    payloadData.metadata = ipfsResponse?.metadataCid || null;
    payloadData.nftId = nftId;
    payloadData.serialNumber = serialNumber;
    if (displayPicAfterCrop) {
      const displayPicLocation = `public\\uploads\\nft\\${nftId}\\display_pic\\${nftId}.jpeg`;
      const imageUploadStatusDP = await uploadBlobToStorage(displayPicAfterCrop, displayPicLocation);
      if (imageUploadStatusDP) {
        payloadData.images.displayPic = `${nftId}.jpeg`;
      }
      const iconPicLocation = `public\\uploads\\nft\\${nftId}\\icon\\${nftId}.jpeg`;
      const imageUploadStatusIcon = await uploadBlobToStorage(displayPicAfterCrop, iconPicLocation);
      if (imageUploadStatusIcon) {
        payloadData.images.icon = `${nftId}.jpeg`;
      }
      const thumbPicLocation = `public\\uploads\\nft\\${nftId}\\thumbnail\\${nftId}.jpeg`;
      const imageUploadStatusThumb = await uploadBlobToStorage(displayPicAfterCrop, thumbPicLocation);
      if (imageUploadStatusThumb) {
        payloadData.images.thumbnail = `${nftId}.jpeg`;
      }
    }
    if (coverPicAfterCrop) {
      const coverPicLocation = `public\\uploads\\nft\\${nftId}\\cover_pic\\${nftId}.jpeg`;
      const imageUploadStatus = await uploadBlobToStorage(coverPicAfterCrop, coverPicLocation);
      if (imageUploadStatus) {
        payloadData.images.coverPic = `${nftId}.jpeg`;
      }
    }
  }
  delete payloadData.topic;
  delete payloadData.walletAddress;
  delete payloadData.walletType;
  const response: any = await axios.put('/v1/nft', removeEmptyValues(payloadData));
  response.nftId = payloadData.nftId;
  return response;
};

export const burnNft = async (data: any) => {
  const payload = removeEmptyValues(data);
  let tokenTransactionReceipt: any;
  if (isCypressTesting()) {
    tokenTransactionReceipt = {
      totalSupply: 25,
    };
  } else {
    const transactionRx: any = await burnToken(payload);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    tokenTransactionReceipt = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while burning the token balance');
  }
  payload.totalSupply = tokenTransactionReceipt?.totalSupply?.toString();
  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  const response = await axios.post('/v1/nft/burn/', payload);
  return response;
};

export const wipeNft = async (data: any) => {
  const payload = removeEmptyValues(data);

  let tokenTransactionReceipt: any;
  if (isCypressTesting()) {
    tokenTransactionReceipt = {
      totalSupply: 25,
    };
  } else {
    const transactionRx: any = await wipeToken(payload);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    tokenTransactionReceipt = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while wiping token balance');
  }

  payload.totalSupply = tokenTransactionReceipt?.totalSupply?.toString();
  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  const response = await axios.post('/v1/nft/wipe/', payload);
  return response;
};

export const freezeStatus = async ({ payload, selectedAction }: { payload: any; selectedAction: string }) => {
  const data = removeEmptyValues(payload);
  if (!isCypressTesting()) {
    const currentStatus = await checkCurrentStatusUserToToken({
      selectedAction,
      tokenId: data.tokenId,
      walletAddress: data.accountId,
    });
    if (currentStatus.status === 409) return currentStatus;
    const transactionRx = await freezeAccount(data, selectedAction);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while updating the status');
  }
  delete data.topic;
  delete data.walletAddress;
  delete data.walletType;
  if (selectedAction === 'freeze') {
    data.doOperation = true;
  } else data.doOperation = false;
  data.status = 200;
  // const response = await axios.patch('/v1/token/update/freeze-status/', data);
  return data;
};

export const kycStatus = async ({ payload, selectedAction }: { payload: any; selectedAction: string }) => {
  const data = removeEmptyValues(payload);
  if (!isCypressTesting()) {
    const currentStatus = await checkCurrentStatusUserToToken({
      selectedAction,
      tokenId: data.tokenId,
      walletAddress: data.accountId,
    });
    if (currentStatus.status === 409) return currentStatus;
    const transactionRx = await kycAccount(data, selectedAction);

    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while enabling/disabling the account');
  }
  delete data.topic;
  delete data.walletAddress;
  delete data.walletType;
  if (selectedAction === 'enableKyc') {
    data.doOperation = true;
  } else data.doOperation = false;
  data.status = 200;
  // const response = await axios.patch('/v1/token/update/kyc-status/', data);
  return data;
};

export const pauseStatus = async ({ payload, selectedAction }: { payload: any; selectedAction: string }) => {
  const data = removeEmptyValues(payload);
  if (!isCypressTesting()) {
    const transactionRx = await tokenPause(data, selectedAction);

    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while updating the status');
  }
  delete data.topic;
  delete data.walletAddress;
  delete data.walletType;
  if (selectedAction === 'pause') {
    data.doOperation = true;
  } else data.doOperation = false;
  const response = await axios.patch('/v1/token/update/pause-status/', data);
  return response;
};

export const freeTransfer = async (data: any) => {
  const payload = removeEmptyValues(data);
  // let tokenTransactionReceipt: any;
  // if (isCypressTesting()) {
  // } else {

  // }

  if (!isCypressTesting()) {
    const transactionRx = await freeTransferHedera(payload);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS') throw new Error('Error occured while transfer');
  }
  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  const response = await axios.patch('/v1/nft/transfer', payload);
  return response;
};

export const sendToMarketplace = async (data: any) => {
  const payload = removeEmptyValues(data);
  if (!isCypressTesting()) {
    const transactionRx = await approveNftAllowance(payload);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while sending to marketplace');
  }
  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  delete payload.sellerWalletId;
  const response = await axios.post('/v1/sale', payload);
  return response;
};

export const withdrawFromMarketplace = async (data: any) => {
  const payload = removeEmptyValues(data);
  if (!isCypressTesting()) {
    let transactionRx;
    if (data.tokenType === 'nft') {
      transactionRx = await deleteNftAllowance(payload);
    } else {
      transactionRx = await approveNftAllowance({ ...payload, volume: 0, sellerWalletId: payload.wallet_address });
    }
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS')
      throw new Error('Error occured while sending to marketplace');
  }
  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  delete payload.identifier;
  delete payload.tokenType;
  const response = await axios.patch('/v1/sale/change-status', payload);
  return response;
};

export const handleBuySale = async (data: any) => {
  const payload = removeEmptyValues(data);
  if (!isCypressTesting()) {
    const transactionRx = await nftAllowanceTransferFunction(payload);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS') throw new Error('Error occured while transfer');
  }
  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  delete payload.sellerWalletId;
  const response = await axios.patch('/v1/nft/transfer', payload);
  return response;
};
