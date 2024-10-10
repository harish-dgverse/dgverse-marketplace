/* eslint-disable import/extensions */
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import DeleteCollection from '../../components/collectionActions/deleteCollection';
import BurnNft from '../../components/collectionActions/burnNft';
import WipeNft from '../../components/collectionActions/wipeNft';
import FreezeAccount from '../../components/collectionActions/freezeAccount';
import KycAccount from '../../components/collectionActions/kycAccount';
import PauseCollection from '../../components/collectionActions/pauseCollection';
import TokenAssociate from '../../components/collectionActions/tokenAssociate';

interface CollectionActionsProps {}

const CollectionActions: FC<CollectionActionsProps> = () => {
  const { action, tokenType } = useParams();

  return (
    <div className="collection-action-page-outer-container">
      <section className="collection-action-page-container">
        {action === 'delete-collection' && <DeleteCollection />}
        {action === 'burn-tokens' && <BurnNft tokenType={tokenType} />}
        {action === 'wipe-tokens' && <WipeNft tokenType={tokenType} />}
        {action === 'freeze-an-account' && <FreezeAccount selectedAction="freeze" />}
        {action === 'unfreeze-an-account' && <FreezeAccount selectedAction="unfreeze" />}
        {action === 'enable-kyc-on-account' && <KycAccount selectedAction="enableKyc" />}
        {action === 'disable-kyc-on-account' && <KycAccount selectedAction="disableKyc" />}
        {action === 'pause-collection' && <PauseCollection selectedAction="pause" />}
        {action === 'unpause-collection' && <PauseCollection selectedAction="unpause" />}
        {action === 'token-associate' && <TokenAssociate selectedAction="associate" />}
        {action === 'token-dissociate' && <TokenAssociate selectedAction="dissociate" />}
      </section>
    </div>
  );
};

export default CollectionActions;
