import { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';
import useHederaWallets, { ConnectionStateType } from '../../../hooks/useHederaWallets';
import { ModalContext } from '../../../services/wallet-service/ModalContext';

const ConnectToWalletButton = ({
  isEnabled = true,
  walletType,
  logoImageSrc,
}: {
  isEnabled?: boolean;
  walletType: ConnectionStateType.HASHPACK | ConnectionStateType.BLADEWALLET | ConnectionStateType.METAMASK;
  logoImageSrc?: string;
}) => {
  const { userWalletId, connectedWalletType, connect, disconnect, isIframeParent } = useHederaWallets();
  const { closeModal } = useContext(ModalContext);

  const connectToWalletButtonOnClick = useCallback(() => {
    if (!isEnabled) {
      return;
    }

    if (connectedWalletType === walletType) {
      disconnect();
    } else {
      connect(walletType);
      closeModal();
    }
  }, [closeModal, connect, connectedWalletType, disconnect, isEnabled, walletType]);

  const connectToWalletButtonImage = useMemo(
    () => (logoImageSrc ? <img src={logoImageSrc} alt={`connect-to-wallet-button-${walletType}-logo`} /> : null),
    [logoImageSrc, walletType]
  );

  const walletName = useMemo(() => {
    switch (walletType) {
      case ConnectionStateType.HASHPACK:
        return 'HashPack';

      case ConnectionStateType.BLADEWALLET:
        return 'BladeWallet';
      case ConnectionStateType.METAMASK:
        return 'Metamask';
      default:
        return 'HashPack';
    }
  }, [walletType]);

  const connectToWalletButtonContent = useMemo(() => {
    if (isEnabled && connectedWalletType === walletType) {
      return `Disconnect from account ${userWalletId}`;
    }

    if (isIframeParent && walletType === ConnectionStateType.HASHPACK) {
      return 'Please login using the Hashpack DAPP explorer in the wallet';
    }

    if (isMobile) {
      if (walletType === ConnectionStateType.HASHPACK) {
        return `Log in using the ${walletName} mobile dApp explorer`;
      }

      if (walletType === ConnectionStateType.BLADEWALLET) {
        return `${walletName} not supported on mobile`;
      }
    }

    if (!isEnabled) {
      switch (walletType) {
        case ConnectionStateType.HASHPACK:
          return 'Internal Error, hashpack will be back soon';
        case ConnectionStateType.BLADEWALLET:
          return 'Alpha testing. Coming soon';
        default:
          return 'Coming soon';
      }
    }

    return userWalletId && walletType !== connectedWalletType ? `Switch to ${walletName}` : 'Click to connect';
  }, [isEnabled, connectedWalletType, walletType, isIframeParent, userWalletId, walletName]);

  const connectToWalletButtonClassNames = useMemo(
    () =>
      classNames('connection-modal__button', {
        'connection-modal__button--disabled': !isEnabled,
      }),
    [isEnabled]
  );

  return (
    <button
      disabled={!isEnabled}
      className={connectToWalletButtonClassNames}
      onClick={connectToWalletButtonOnClick}
      type="button"
    >
      {connectToWalletButtonImage}
      <p className="connectToWalletButtonContent">{connectToWalletButtonContent}</p>
    </button>
  );
};

export default ConnectToWalletButton;
