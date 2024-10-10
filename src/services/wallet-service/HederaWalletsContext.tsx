import React from 'react';
// import { BladeSigner } from '@bladelabs/blade-web3.js';
import { HashConnect } from 'hashconnect';
import useHashPack, { HashConnectState } from '../../hooks/wallets/useHashPack';
// import useBladeWallet, { BladeAccountId } from '../../hooks/wallets/useBladeWallet';

interface HederaWalletsContextType {
  // bladeSigner?: any;
  hashConnect?: HashConnect;
  hashConnectState: Partial<HashConnectState>;
  // bladeAccountId: BladeAccountId;
  // connectBladeWallet: () => void;
  connectToHashPack: () => any;
  // clearConnectedBladeWalletData: () => void;
  disconnectFromHashPack: () => void;
  isIframeParent: boolean;
}

const INITIAL_CONTEXT: HederaWalletsContextType = {
  hashConnect: undefined,
  // bladeSigner: undefined,
  hashConnectState: {},
  // bladeAccountId: '',
  disconnectFromHashPack: () => undefined,
  // connectBladeWallet: () => undefined,
  connectToHashPack: () => undefined,
  // clearConnectedBladeWalletData: () => undefined,
  isIframeParent: false,
};

export const HederaWalletsContext = React.createContext(INITIAL_CONTEXT);

const HederaWalletsProvider = ({ children }: { children: React.ReactElement }) => {
  // const { bladeSigner, bladeAccountId, connectBladeWallet, clearConnectedBladeWalletData } = useBladeWallet();

  const { hashConnect, hashConnectState, connectToHashPack, disconnectFromHashPack, isIframeParent } = useHashPack();

  return (
    <HederaWalletsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        // bladeSigner,
        hashConnect,
        hashConnectState,
        // bladeAccountId,
        // connectBladeWallet,
        disconnectFromHashPack,
        // clearConnectedBladeWalletData,
        connectToHashPack,
        isIframeParent,
      }}
    >
      {children}
    </HederaWalletsContext.Provider>
  );
};

export default HederaWalletsProvider;
