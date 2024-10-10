/* eslint-disable no-unused-vars */
import { FC, useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useStore } from '../../store/store';
import blobStorageService from '../../utils/variables';

interface NotificationPreviewProps {
  previewDetails: any;
}

const NotificationPreview: FC<NotificationPreviewProps> = ({ previewDetails }) => {
  const {
    name,
    nftId,
    saleMode,
    displayPic,
    type,
    message,
    saleId,
    potentialBuyerId: buyerId,
    amount: saleAmount,
    raw_data: rawData,
  } = previewDetails;

  const [store] = useStore();
  const { user } = store;
  const loggedUserId = user?.user_id;

  const { enqueueSnackbar } = useSnackbar();
  const [quotedPrice, setQuotedPrice] = useState('');

  return (
    <div className="notification-preview-container">
      <div className="nft-details">
        <span className="sale-type">{saleMode}</span>
        <Link to={`/nft/${nftId}/home`}>
          {displayPic && (
            <div className="">
              <img
                src={`${blobStorageService.hostname}/public/uploads/nft/${nftId}/thumbnail/${displayPic}${blobStorageService.sas}`}
                alt="trending"
              />
            </div>
          )}
          <div className="cardview">
            <span className="asset-name">{name}</span>
            <span className="asset-wallet-id">{nftId}</span>
          </div>
        </Link>
      </div>

      <div className="notification-preview-details">
        <div className="notification-preview-header">
          <span>{type}</span>
        </div>
        <div className="notification-preview-message">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};
export default NotificationPreview;
