/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { useCallback, useContext, useMemo, useEffect, useState } from 'react';
import { TransactionReceipt, TransactionReceiptQuery, TransactionResponse } from '@hashgraph/sdk';
import { MessageTypes } from 'hashconnect';
import { useSnackbar } from 'notistack';
import { SigningService } from '../services/SigningService';
import { HederaWalletsContext } from '../services/wallet-service/HederaWalletsContext';

import { useStore } from '../store/store';
import { walletPaired } from '../store/action';

export enum ConnectionStateType {
  BLADEWALLET = 'bladewallet',
  HASHPACK = 'hashpack',
  METAMASK = 'metamask',
  NOCONNECTION = 'noconnection',
}

const useHederaWallets = () => {
  const [, dispatch] = useStore();
  const { enqueueSnackbar } = useSnackbar();

  const {
    // bladeSigner,
    // bladeAccountId,
    hashConnect,
    // connectBladeWallet,
    disconnectFromHashPack,
    // clearConnectedBladeWalletData,
    connectToHashPack,
    hashConnectState,
    isIframeParent,
  } = useContext(HederaWalletsContext);

  const [connectedWalletType, setConnectedWalletType] = useState<ConnectionStateType>(ConnectionStateType.NOCONNECTION);

  useEffect(() => {
    // if (!bladeAccountId && !hashConnectState.pairingData) {
    //   setConnectedWalletType(ConnectionStateType.NOCONNECTION);
    // }
    if (!hashConnectState.pairingData) {
      setConnectedWalletType(ConnectionStateType.NOCONNECTION);
    }
    // if (bladeAccountId && !hashConnectState.pairingData) {
    //   dispatch(walletPaired({ walletAddress: bladeAccountId, walletType: ConnectionStateType.BLADEWALLET }));
    //   setConnectedWalletType(ConnectionStateType.BLADEWALLET);
    // }
    //   if (hashConnectState.pairingData && hashConnectState.pairingData.accountIds?.length > 0 && !bladeAccountId) {
    //     dispatch(
    //       walletPaired({ walletAddress: hashConnectState.pairingData.accountIds[0], walletType: ConnectionStateType.HASHPACK })
    //     );
    //     setConnectedWalletType(ConnectionStateType.HASHPACK);
    //   }
    // }, [bladeAccountId, setConnectedWalletType, hashConnectState.pairingData]);

    if (hashConnectState.pairingData && hashConnectState.pairingData.accountIds?.length > 0) {
      dispatch(
        walletPaired({
          walletAddress: hashConnectState.pairingData.accountIds[0],
          walletType: ConnectionStateType.HASHPACK,
          freshLogin: false,
        })
      );
      setConnectedWalletType(ConnectionStateType.HASHPACK);
    }
  }, [setConnectedWalletType, hashConnectState.pairingData]);

  const connect = useCallback(
    (walletType: any) => {
      switch (walletType) {
        // case ConnectionStateType.BLADEWALLET:
        //   disconnectFromHashPack();
        //   // connectBladeWallet();
        //   break;
        case ConnectionStateType.HASHPACK: {
          // clearConnectedBladeWalletData();
          const response = connectToHashPack();
          console.log(response);
          if (response.status === false) {
            enqueueSnackbar(
              `${response.errorMessage} You can access our tutorial section to see how to download and install hashpack.`,
              { variant: 'info' }
            );
          }
          break;
        }
        default:
          break;
      }
    },
    [connectToHashPack, disconnectFromHashPack]
  );

  const disconnect = useCallback(() => {
    switch (connectedWalletType) {
      // case ConnectionStateType.BLADEWALLET:
      //   clearConnectedBladeWalletData();
      //   enqueueSnackbar('Removed Blade Wallet pairing', { variant: 'info' });
      //   break;
      case ConnectionStateType.HASHPACK:
        disconnectFromHashPack();
        enqueueSnackbar('Removed HashPack pairings', { variant: 'info' });
        break;
      default:
        break;
    }
  }, [connectedWalletType]);
  // }, [connectedWalletType, clearConnectedBladeWalletData, disconnectFromHashPack]);

  const userWalletId = useMemo(() => {
    switch (connectedWalletType) {
      // case ConnectionStateType.BLADEWALLET:
      //   return bladeAccountId;
      case ConnectionStateType.HASHPACK:
        return hashConnectState.pairingData?.accountIds && hashConnectState.pairingData?.accountIds[0];
      default:
        return undefined;
    }
  }, [connectedWalletType, hashConnectState]);

  const sendTransaction = useCallback(
    async (tx: any, sign = false) => {
      if (!userWalletId) {
        throw new Error('Loading logged Hedera account id Error.');
      }

      let response: MessageTypes.TransactionResponse | TransactionResponse | undefined;

      let hashConnectTxBytes;

      switch (connectedWalletType) {
        // case ConnectionStateType.BLADEWALLET: {
        //   // ); //   }) //     transactionId: response.transactionId, //   new TransactionReceiptQuery({ // return bladeSigner?.call( // } //   throw new Error('Get transaction response error'); // if (!response) { // response = (await bladeSigner?.call(tx)) as TransactionResponse;
        //   // populate adds transaction ID and node IDs to the transaction
        //   const populatedTransaction = await bladeSigner.populateTransaction(tx);
        //   const signedTransaction = await bladeSigner.signTransaction(tx.freeze());

        //   // call executes the transaction
        //   const result = await bladeSigner.call(signedTransaction);
        //   return result;
        // }
        case ConnectionStateType.HASHPACK:
          if (!hashConnectState.topic) {
            throw new Error('Loading topic Error.');
          }

          hashConnectTxBytes = sign ? SigningService.makeBytes(tx, userWalletId) : tx.toBytes();

          // eslint-disable-next-line no-case-declarations
          response = await hashConnect?.sendTransaction(hashConnectState.topic, {
            topic: hashConnectState.topic,
            byteArray: hashConnectTxBytes,
            metadata: {
              accountToSign: userWalletId,
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
    },
    [hashConnect, connectedWalletType, userWalletId, hashConnectState.topic]
  );

  return {
    // bladeSigner,
    userWalletId,
    connectedWalletType,
    connect,
    disconnect,
    sendTransaction,
    isIframeParent,
    hashConnectState,
  };
};

export default useHederaWallets;
