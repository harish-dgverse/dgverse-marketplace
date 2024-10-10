/* eslint-disable no-unused-vars */
import axios from '../api/axios';
import { removeEmptyValues, isCypressTesting } from '../utils/commonUtils';
import { tokenAssociate, deleteCollectionHedera, createCollectionHedera } from './hedera-service/token';
import { handleHederaResponse } from './hedera-service/utils/htsUtils';
import { uploadBlobToStorage } from './fileUploadService';
import { sendTransaction } from './executeTransaction';

export {};

export const createCollection = async ({
  payload,
  displayPicAfterCrop,
  coverPicAfterCrop,
}: {
  payload: any;
  displayPicAfterCrop: any;
  coverPicAfterCrop: any;
}) => {
  const data: any = removeEmptyValues(payload);
  let tokenCreateReceipt: any;
  if (isCypressTesting()) {
    tokenCreateReceipt = {
      tokenId: '0.0.333123',
    };
  } else {
    const transactionRx: any = await createCollectionHedera(data);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
    }
    tokenCreateReceipt = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenCreateReceipt.status.toString() !== 'SUCCESS') throw new Error('Error occured while creating token');
  }
  data.tokenId = tokenCreateReceipt.tokenId?.toString();
  delete data.topic;
  delete data.walletAddress;
  delete data.walletType;
  const picName = `${data.tokenId}`;
  data.images = {};
  if (displayPicAfterCrop) {
    const displayPicLocation = `public\\uploads\\collection\\${picName}\\display_pic\\${picName}.jpeg`;
    const imageUploadStatusDP = await uploadBlobToStorage(displayPicAfterCrop, displayPicLocation);
    if (imageUploadStatusDP) {
      data.images.displayPic = `${picName}.jpeg`;
    }
    const iconPicLocation = `public\\uploads\\collection\\${picName}\\icon\\${picName}.jpeg`;
    const imageUploadStatusIcon = await uploadBlobToStorage(displayPicAfterCrop, iconPicLocation);
    if (imageUploadStatusIcon) {
      data.images.icon = `${picName}.jpeg`;
    }
    const thumbPicLocation = `public\\uploads\\collection\\${picName}\\thumbnail\\${picName}.jpeg`;
    const imageUploadStatusThumb = await uploadBlobToStorage(displayPicAfterCrop, thumbPicLocation);
    if (imageUploadStatusThumb) {
      data.images.thumbnail = `${picName}.jpeg`;
    }
  }
  if (coverPicAfterCrop) {
    const coverPicLocation = `public\\uploads\\collection\\${picName}\\cover_pic\\${picName}.jpeg`;
    const imageUploadStatus = await uploadBlobToStorage(coverPicAfterCrop, coverPicLocation);
    if (imageUploadStatus) {
      data.images.coverPic = `${picName}.jpeg`;
    }
  }
  const response: any = await axios.post('/v1/token/create', data);
  response.tokenId = data.tokenId;
  return response;
};

export const deleteToken = async (data: any) => {
  const payload = removeEmptyValues(data);

  if (!isCypressTesting()) {
    const transactionRx: any = await deleteCollectionHedera(data);
    if (transactionRx.status !== 'success') {
      const errMsg = handleHederaResponse(transactionRx.error);
      throw new Error(errMsg);
      // return
    }
    const tokenTransactionReceipt: any = await sendTransaction(
      transactionRx.transaction,
      payload.walletAddress,
      payload.walletType,
      payload.topic,
      true
    );
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS') throw new Error('Error occured while deleting token');
  }

  delete payload.topic;
  delete payload.walletAddress;
  delete payload.walletType;
  const response = await axios.post('/v1/token/delete', payload);
  return response;
};

export const associateToken = async ({ payload, selectedAction }: { payload: any; selectedAction: string }) => {
  if (!isCypressTesting()) {
    const transactionRx: any = await tokenAssociate(payload, selectedAction);
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
    if (tokenTransactionReceipt?.status?.toString() !== 'SUCCESS') throw new Error('Error occured while associating token');
  }
  return {
    status: 200,
  };
};
