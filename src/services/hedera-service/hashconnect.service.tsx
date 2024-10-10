/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import { HashConnectConnectionState } from 'hashconnect/dist/types';
import React from 'react';

import { useStore } from '../../store/store';
import { walletPaired } from '../../store/action';

// create the hashconnect instance
export const hashconnect = new HashConnect(false);

export interface ProviderProps {
  children: React.ReactNode;
  network: 'testnet' | 'mainnet' | 'previewnet';
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

export interface HashconnectContextAPI {
  availableExtension: HashConnectTypes.WalletMetadata;
  pairingState: HashConnectConnectionState;
  topic: string;
  pairingString: string;
  pairingData: HashConnectTypes.SavedPairingData | null;
}

const appMetadata: HashConnectTypes.AppMetadata = {
  name: 'Dgverse',
  description: 'dgverse: the future',
  icon: 'https://www.hashpack.app/img/logo.svg',
};

const HashconectServiceContext = React.createContext<
  Partial<
    HashconnectContextAPI & {
      network: 'testnet' | 'mainnet' | 'previewnet';
      setHashConnectState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>;
    }
  >
>({});

export const HashconnectAPIProvider = ({ children, metaData, network, debug }: ProviderProps) => {
  const [hashConnectState, setHashConnectState] = React.useState<Partial<HashconnectContextAPI>>({});
  const [, dispatch] = useStore();

  const initHashconnect = async () => {
    // initialize and use returned data
    const initData = await hashconnect.init(metaData ?? appMetadata, network, false);
    const { topic, pairingString, savedPairings } = initData;
    // Saved pairings will return here, generally you will only have one unless you are doing something advanced
    const pairingData = savedPairings[0];
    console.log('initData for existing session', initData);
    console.log('pairingData for existing session', pairingData);
    let pairingState = HashConnectConnectionState.Disconnected;
    if (pairingData) {
      pairingState = HashConnectConnectionState.Paired;
      dispatch(walletPaired({ walletAddress: pairingData?.accountIds[0], walletType: 'hashpack', freshLogin: false }));
    }
    setHashConnectState((exState) => ({
      ...exState,
      topic,
      pairingData,
      pairingString,
      pairingState,
    }));
  };

  const onFoundExtension = (data: HashConnectTypes.WalletMetadata) => {
    console.log('Found extension', data);
    setHashConnectState((exState) => ({ ...exState, availableExtension: data }));
  };

  const onParingEvent = async (data: MessageTypes.ApprovePairing) => {
    console.log('Paired with wallet walletPaired', data);
    dispatch(walletPaired({ walletAddress: data.accountIds[0], walletType: 'hashpack', freshLogin: true }));
    // else handleClose();
    setHashConnectState((exState) => ({ ...exState, pairingData: data.pairingData }));
  };

  const onConnectionChange = async (state: HashConnectConnectionState) => {
    console.log('hashconnect state change event', state);
    setHashConnectState((exState) => ({ ...exState, pairingState: state }));
  };

  // Call Initialization and register events
  React.useEffect(() => {
    initHashconnect();
    hashconnect.foundExtensionEvent.on(onFoundExtension);
    hashconnect.pairingEvent.on(onParingEvent);
    hashconnect.connectionStatusChangeEvent.on(onConnectionChange);
    return () => {
      hashconnect.foundExtensionEvent.off(onFoundExtension);
      hashconnect.pairingEvent.on(onParingEvent);
      hashconnect.connectionStatusChangeEvent.off(onConnectionChange);
    };
  }, []);

  // Call Initialization
  React.useEffect(() => {
    // (async () => {
    //   if (hashConnectState.pairingState === 'Paired') {
    //     console.log(`hashconnect state change event `, hashConnectState);
    //     const { data: responseLogin, status } = await axios.patch(
    //       '/v1/auth/login',
    //       { walletAddress: hashConnectState.pairingData?.accountIds[0] },
    //       {
    //         headers: { 'Content-Type': 'application/json' },
    //         withCredentials: true,
    //       }
    //     );
    //     if (status === 200 || status === 201) {
    //       const accessToken = responseLogin?.accessToken;
    //       dispatch(userLogin({ user: responseLogin.user, accessToken }));
    //     }
    //     if (status === 201) {
    //       dispatch(newUserFlag());
    //     }
    //   }
    // })();
  }, [hashConnectState.pairingState]);

  return (
    <HashconectServiceContext.Provider value={{ ...hashConnectState, setHashConnectState, network }}>
      {children}
    </HashconectServiceContext.Provider>
  );
};

export const useHashconnectService = () => {
  const value = React.useContext(HashconectServiceContext);
  const { topic, pairingData, network, setHashConnectState } = value;

  const connectToExtension = async () => {
    // this will automatically pop up a pairing request in the HashPack extension
    hashconnect.connectToLocalWallet();
  };

  const disconnect = () => {
    hashconnect.disconnect(pairingData?.topic!);
    // hashconnect.clearConnectionsAndData();
    setHashConnectState!((exState) => ({ ...exState, pairingData: null }))!;
  };

  const requestAccountInfo = async () => {
    const request: MessageTypes.AdditionalAccountRequest = {
      topic: topic!,
      network: network!,
      multiAccount: true,
    };

    await hashconnect.requestAdditionalAccounts(topic!, request);
  };

  const clearPairings = () => {
    hashconnect.clearConnectionsAndData();
    setHashConnectState!((exState) => ({ ...exState, pairingData: null }));
  };

  return { ...value, connectToExtension, disconnect, requestAccountInfo, clearPairings };
};
