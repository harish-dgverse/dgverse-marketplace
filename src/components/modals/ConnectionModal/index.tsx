import { useMemo } from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';
import useHederaWallets, { ConnectionStateType } from '../../../hooks/useHederaWallets';
import ConnectToWalletButton from './ConnectToWalletButton';
import BladeWalletLogo from '../../../assets/images/wallets/bladewallet.svg';
import HashpackWalletLogo from '../../../assets/images/wallets/hashpack.svg';
import MetamaskLogo from '../../../assets/images/wallets/metamask.svg';

const ConnectionModal = () => {
  const { userWalletId, isIframeParent } = useHederaWallets();

  const isHashPackConnectionButtonEnabledInDAppExplorer = useMemo(
    () =>
      // When user is using HashPack 'dApp explorer' enable button only for disconnect
      isIframeParent && !!userWalletId,
    [isIframeParent, userWalletId]
  );

  const isHashPackConnectionComponentEnabled = useMemo(() => {
    if (!isIframeParent && !isMobile) {
      return true;
    }

    if (isIframeParent) {
      return isHashPackConnectionButtonEnabledInDAppExplorer;
    }

    return false;
  }, [isIframeParent, isHashPackConnectionButtonEnabledInDAppExplorer]);

  const buttonsWrapperClassName = useMemo(
    () =>
      classNames('connection-modal__buttons-wrapper', {
        'connection-modal__buttons-wrapper--single': isIframeParent,
      }),
    [isIframeParent]
  );

  return (
    <div className="connection-modal">
      <div className={buttonsWrapperClassName}>
        <ConnectToWalletButton
          walletType={ConnectionStateType.HASHPACK}
          logoImageSrc={HashpackWalletLogo}
          isEnabled={isHashPackConnectionComponentEnabled}
        />
        <ConnectToWalletButton walletType={ConnectionStateType.METAMASK} logoImageSrc={MetamaskLogo} isEnabled={false} />
        {!isIframeParent && (
          <ConnectToWalletButton
            walletType={ConnectionStateType.BLADEWALLET}
            logoImageSrc={BladeWalletLogo}
            isEnabled={false}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionModal;
