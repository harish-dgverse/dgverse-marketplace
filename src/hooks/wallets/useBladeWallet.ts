/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import { useEffect, useState, useCallback } from 'react';
// import { BladeConnector, HederaNetwork, ConnectorStrategy } from '@bladelabs/blade-web3.js';
import { APP_NAME, HEDERA_NETWORK } from '../../Global.d';
import { loadLocalData } from '../../utils/helpers/loadLocalData';

export type BladeAccountId = string;

export const BLADE_WALLET_LOCALSTORAGE_VARIABLE_NAME = `${APP_NAME ?? 'DgVerse'}BladeWalletData`;

// const BLADE_SIGNER_PARAMS = {
//   network: HEDERA_NETWORK === 'mainnet' ? HederaNetwork.Mainnet : HederaNetwork.Testnet,
//   dAppCode: APP_NAME,
// };

// const bladeSigner = new BladeSigner();
// const bladeConnector = new BladeConnector(
//   ConnectorStrategy.EXTENSION, // preferred strategy is optional
//   {
//     // dApp metadata options are optional, but are highly recommended to use
//     name: 'Awesome DApp',
//     description: 'DApp description',
//     url: 'https://awesome-dapp.io/',
//     icons: ['some-image-url.png'],
//   }
// );
// const bladeSigner = bladeConnector.getSigner();

const useBladeWallet = () => {
  const [bladeAccountId, setBladeAccountId] = useState<BladeAccountId>('');
  let bladeSigner;
  // CLEANER
  const clearConnectedBladeWalletData = useCallback(() => {
    localStorage.removeItem(BLADE_WALLET_LOCALSTORAGE_VARIABLE_NAME);
    setBladeAccountId('');
  }, [setBladeAccountId]);

  // CONNECTION
  // const connectBladeWallet = useCallback(async () => {
  //   let loggedId: string | undefined = '';

  //   try {
  //     // await bladeSigner.createSession(BLADE_SIGNER_PARAMS);
  //     // loggedId = bladeSigner.getAccountId().toString();
  //     const pairedAccountIds = await bladeConnector.createSession(BLADE_SIGNER_PARAMS);
  //     console.log(pairedAccountIds, 'pairedAccountIds');
  //     bladeSigner = bladeConnector.getSigner();
  //     // await bladeConnector.createSession(BLADE_SIGNER_PARAMS);
  //     loggedId = bladeSigner?.getAccountId().toString();
  //     console.log('loggedId', loggedId);
  //     // retrieving the currently active signer to perform all the Hedera operations
  //   } catch (e) {
  //     if (typeof e === 'function') {
  //       const { message } = e();

  //       console.error(message);
  //     } else if (typeof e === 'string') {
  //       console.error(e);
  //     } else if (e instanceof Error) {
  //       console.error(e.message);
  //     }
  //   } finally {
  //     if (!loggedId) {
  //       console.error('Cannot find connected account id in Blade Wallet!');
  //     } else {
  //       if (!loadLocalData(BLADE_WALLET_LOCALSTORAGE_VARIABLE_NAME)) {
  //         console.log('Blade Wallet has been connected!');
  //       }
  //       setBladeAccountId(loggedId);
  //       localStorage.setItem(
  //         BLADE_WALLET_LOCALSTORAGE_VARIABLE_NAME,
  //         JSON.stringify({
  //           bladeAccountId: loggedId,
  //         })
  //       );
  //     }
  //   }
  // }, [setBladeAccountId]);

  // INITIALIZATION
  // const initializeBladeWallet = useCallback(async () => {
  //   const wasConnected = loadLocalData(BLADE_WALLET_LOCALSTORAGE_VARIABLE_NAME);

  //   if (wasConnected) {
  //     await connectBladeWallet();
  //   }
  // }, [connectBladeWallet]);

  // useEffect(() => {
  //   initializeBladeWallet();
  // }, [initializeBladeWallet]);

  // LISTEN FOR ACCOUNT CHANGES
  // useEffect(() => {
  //   bladeSigner.onAccountChanged(connectBladeWallet);
  // }, [connectBladeWallet]);

  // return {
  //   bladeSigner,
  //   bladeAccountId,
  //   connectBladeWallet,
  //   clearConnectedBladeWalletData,
  // };
  return {
    status: 'Coming soon',
  };
};

export default useBladeWallet;
