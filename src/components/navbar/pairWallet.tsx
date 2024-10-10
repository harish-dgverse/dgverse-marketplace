/* eslint-disable no-unused-vars */
// import { HashConnectTypes } from 'hashconnect';
// import { HashConnectConnectionState } from 'hashconnect/dist/types';
import { useHashconnectService } from '../../services/hedera-service/hashconnect.service';
import useHederaWallets, { ConnectionStateType } from '../../hooks/useHederaWallets';
import ConnectionModal from '../modals/ConnectionModal';

// interface AppState {
//   pairingState: HashConnectConnectionState;
//   pairingData?: HashConnectTypes.SavedPairingData | null;
//   availableExtension?: HashConnectTypes.WalletMetadata;
//   topic?: string;
//   pairingString?: string;
// }

const PairWallet = () => {
  const { connectToExtension, pairingString, pairingState } = useHashconnectService();
  const { userWalletId, connectedWalletType, connect, disconnect, isIframeParent } = useHederaWallets();

  const pairWithExtension = async () => {
    connect('hashpack');
  };

  return <ConnectionModal />;
};

export default PairWallet;
