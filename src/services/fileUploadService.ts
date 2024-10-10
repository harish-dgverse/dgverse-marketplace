/* eslint-disable import/prefer-default-export */
import { BlobServiceClient } from '@azure/storage-blob';
import blobStorageService from '../utils/variables';

const blobServiceClient = new BlobServiceClient(`${blobStorageService.hostnameOnly}${blobStorageService.sas}`);

export const uploadBlobToStorage = async (blob: any, location: string, container = 'dgverse-public-image') => {
  const containerClient = blobServiceClient.getContainerClient(container);
  const blockBlobClient = containerClient.getBlockBlobClient(location);
  const uploadBlobResponse = await blockBlobClient.uploadBrowserData(blob);
  // eslint-disable-next-line no-underscore-dangle
  if (uploadBlobResponse._response.status === 201) return true;
  return false;
};
