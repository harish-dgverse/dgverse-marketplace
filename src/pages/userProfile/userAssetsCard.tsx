import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import blobStorageService from '../../utils/variables';

interface UserAssetsCardProps {
  assetDetails: any;
  assetType: string;
}

const UserAssetsCard: FC<UserAssetsCardProps> = ({ assetDetails, assetType }) => {
  const { name, identifier, minter, dp, currentPrice, currentOffer, highestBid, iconMinter } = assetDetails;
  const isCollection = assetType === 'created';
  return (
    <Grid xs={4}>
      <div className="cardview">
        <div className="imagesec">
          <img src={`${blobStorageService.hostname}/${dp}${blobStorageService.sas}`} alt="trending" />
        </div>
        <div className="textpart">
          <h4>{name}</h4>
          <p className="profilepicouter">
            <span className="profilview">
              <img src={`${blobStorageService.hostname}/${iconMinter}${blobStorageService.sas}`} alt="minter" />
            </span>{' '}
            {minter}
          </p>
          {isCollection && (
            <Grid container spacing={2}>
              <Grid xs={6}>
                <p className="bid">Price</p>
                <h6>{currentPrice}</h6>
              </Grid>
              <Grid xs={6}>
                <p className="bid">{identifier}</p>
                <h6>{currentPrice}</h6>
              </Grid>
              {currentOffer && (
                <Grid className="highestsec" xs={6}>
                  <p className="bid">Current Offer</p>
                  <h6>{currentOffer}</h6>
                </Grid>
              )}
              {highestBid && (
                <Grid className="highestsec" xs={6}>
                  <p className="bid">Highest Bid</p>
                  <h6>{highestBid}</h6>
                </Grid>
              )}
            </Grid>
          )}
        </div>
      </div>
    </Grid>
  );
};
export default UserAssetsCard;
