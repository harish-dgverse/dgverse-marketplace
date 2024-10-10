import { useState, useCallback, useEffect, useMemo } from 'react';
import { HashConnect, HashConnectTypes } from 'hashconnect';
import { HashConnectConnectionState } from 'hashconnect/dist/types';
import {
  HEDERA_NETWORK,
  HASHPACK_APP_CONFIG_NAME,
  HASHPACK_APP_CONFIG_DESCRIPTION,
  HASHPACK_APP_CONFIG_ICON_URL,
} from '../../Global.d';
import useHashConnectEvents from './useHashConnectEvents';
import logo from '../../assets/favicon.png';

export interface HashConnectState {
  availableExtension: HashConnectTypes.WalletMetadata;
  state: HashConnectConnectionState;
  topic: string;
  pairingString: string;
  pairingData: HashConnectTypes.SavedPairingData | null;
}

const HASHCONNECT_DEBUG_MODE = true;

export const hashConnect = new HashConnect(HASHCONNECT_DEBUG_MODE);

const useHashPack = () => {
  const [hashConnectState, setHashConnectState] = useState<Partial<HashConnectState>>({});
  const { isIframeParent } = useHashConnectEvents(hashConnect, setHashConnectState);

  // PREPARE APP CONFIG
  const hederaNetworkPrefix = useMemo(() => (HEDERA_NETWORK === 'testnet' ? `${HEDERA_NETWORK}.` : ''), []);

  const appConfig = useMemo<HashConnectTypes.AppMetadata>(
    () => ({
      name: `${hederaNetworkPrefix}${HASHPACK_APP_CONFIG_NAME}`,
      description: HASHPACK_APP_CONFIG_DESCRIPTION,
      icon: HASHPACK_APP_CONFIG_ICON_URL ?? logo,
    }),
    [hederaNetworkPrefix]
  );

  // INITIALIZATION
  const initializeHashConnect = useCallback(async () => {
    const hashConnectInitData = await hashConnect.init(appConfig, HEDERA_NETWORK, false);

    if (hashConnectInitData.savedPairings.length > 0) {
      setHashConnectState((prev) => ({
        ...prev,
        topic: hashConnectInitData.topic,
        pairingString: hashConnectInitData.pairingString,
        pairingData: hashConnectInitData.savedPairings[0],
      }));
    } else {
      setHashConnectState((prev) => ({
        ...prev,
        topic: hashConnectInitData.topic,
        pairingString: hashConnectInitData.pairingString,
      }));
    }
  }, [appConfig]);

  useEffect(() => {
    initializeHashConnect();
  }, [initializeHashConnect]);

  // DISCONNECT
  const disconnectFromHashPack = useCallback(async () => {
    if (hashConnectState.topic) {
      await hashConnect.disconnect(hashConnectState.topic);

      setHashConnectState((prev) => ({
        ...prev,
        pairingData: undefined,
      }));
      hashConnect.hcData.pairingData = [];

      if (isIframeParent) {
        await hashConnect.clearConnectionsAndData();
      }
    }
  }, [hashConnectState.topic, isIframeParent]);

  // CONNECT
  const connectToHashPack = useCallback(() => {
    try {
      if (typeof hashConnect.hcData.pairingString === 'undefined' || hashConnect.hcData.pairingString === '') {
        throw new Error('No pairing key generated! Initialize HashConnect first!');
      }

      if (!hashConnectState.availableExtension || !hashConnect) {
        throw new Error('Hashpack wallet is not installed!');
      }

      hashConnect.connectToLocalWallet();
      return {
        status: true,
      };
    } catch (e) {
      let errorMessage;
      if (typeof e === 'string') {
        errorMessage = e;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      return {
        status: false,
        errorMessage,
      };
      // enqueueSnackbar('NFT burned successfully', { variant: 'success' });
      // enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [hashConnectState.availableExtension]);

  return {
    hashConnect,
    hashConnectState,
    connectToHashPack,
    disconnectFromHashPack,
    isIframeParent,
  };
};

export default useHashPack;
