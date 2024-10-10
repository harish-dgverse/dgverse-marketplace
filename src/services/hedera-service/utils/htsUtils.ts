import { Transaction } from '@hashgraph/sdk';
import axios from '../../../api/axios';

export const splitNftId = (nftId: string) => {
  const index = nftId.lastIndexOf('.');
  const tokenId = nftId.slice(0, index);
  const serialNumber = nftId.slice(index + 1);
  return { tokenId, serialNumber: parseInt(serialNumber, 10) };
};

export const freezeWithClient = async (transBytes: any) => {
  const tx = await axios
    .post(`/v1/hts/freeze-with-client`, { transBytes: Buffer.from(transBytes).toString('hex') })
    .then((res) => res.data);
  return Transaction.fromBytes(Buffer.from(tx.transactionOutBytes, 'hex'));
};

export const signWithClient = async (transBytes: any) => {
  const tx = await axios
    .post(`/v1/hts/sign-with-client`, { transBytes: Buffer.from(transBytes).toString('hex') })
    .then((res) => res.data);
  return Transaction.fromBytes(Buffer.from(tx.transactionOutBytes, 'hex'));
};

export const getNftId = (tokenId: string, serialNumber: string) => {
  return `${tokenId}.${serialNumber}`;
};

export const handleHederaResponse = (error: any) => {
  return error;
};
