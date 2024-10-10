/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { TransactionReceipt, TransactionReceiptQuery, TransactionResponse } from '@hashgraph/sdk';
import axios from '../api/axios';
import { removeEmptyValues } from '../utils/commonUtils';
import { tokenAssociate, deleteCollectionHedera, createCollectionHedera } from './hedera-service/token';
import { handleHederaResponse, freezeWithClient, signWithClient } from './hedera-service/utils/htsUtils';
import { uploadBlobToStorage } from './fileUploadService';
import { hashConnect } from '../hooks/wallets/useHashPack';
import { SigningService } from './SigningService';
import { DGVERSE_PROVIDER_ACCOUNT } from '../Global.d';

export {};

export const sendTransaction = async (
  tx: any,
  walletAddress: any,
  walletType: any,
  topic: any,
  sign = false,
  signClient = false
) => {
  if (!walletAddress) {
    throw new Error('Loading logged Hedera account id Error.');
  }

  let response: any;

  let hashConnectTxBytes;

  switch (walletType) {
    // case 'bladewallet': {
    //   // ); //   }) //     transactionId: response.transactionId, //   new TransactionReceiptQuery({ // return bladeSigner?.call( // } //   throw new Error('Get transaction response error'); // if (!response) { // response = (await bladeSigner?.call(tx)) as TransactionResponse;
    //   // populate adds transaction ID and node IDs to the transaction
    //   const populatedTransaction = await bladeSigner.populateTransaction(tx);
    //   const signedTransaction = await bladeSigner.signTransaction(tx.freeze());

    //   // call executes the transaction
    //   const result = await bladeSigner.call(signedTransaction);
    //   return result;
    // }
    case 'hashpack':
      if (!topic) {
        throw new Error('Loading topic Error.');
      }

      if (signClient) {
        hashConnectTxBytes = SigningService.makeBytes(tx, DGVERSE_PROVIDER_ACCOUNT);
        hashConnectTxBytes = await signWithClient(hashConnectTxBytes);
        // .freezeWith(client)
        // approvedSendTxFreezedWithClient.freezeWithSigner(signer);
        // hashConnectTxBytes.freezeWithSigner(signer);
        // hashConnectTxBytes = await signWithClient(hashConnectTxBytes.toBytes());
        hashConnectTxBytes = hashConnectTxBytes.toBytes();
        // const signedTrans = await approvedSendTxSignWithClient.sign(operatorPrivateKey);

        // const cryptoTransferTx: any = await hashConnectTxBytes.executeWithSigner(signer);
        // if (cryptoTransferTx === undefined) throw new Error('Transaction failed, please see wallet for more details.');
        // const cryptoTransferTxReceipt = await provider.getTransactionReceipt(cryptoTransferTx.transactionId);
        // if (cryptoTransferTxReceipt.status.toString() !== 'SUCCESS') throw new Error('ERROR');
        // console.log(`HBAR TRANSFER TO SELLER ${cryptoTransferTxReceipt.status.toString()}`);
        // return {
        //   status: 'success',
        // };
      } else {
        hashConnectTxBytes = sign ? SigningService.makeBytes(tx, walletAddress) : tx.toBytes();
      }
      // eslint-disable-next-line no-case-declarations
      console.log(walletAddress, 'walletAddress');
      response = await hashConnect?.sendTransaction(topic, {
        topic,
        byteArray: hashConnectTxBytes,
        metadata: {
          accountToSign: walletAddress,
          returnTransaction: false,
        },
      });

      if (response?.receipt) {
        return TransactionReceipt.fromBytes(response.receipt as Uint8Array);
      }
      throw new Error('No transaction receipt found!');

    default:
      throw new Error('No wallet connected!');
  }
};
