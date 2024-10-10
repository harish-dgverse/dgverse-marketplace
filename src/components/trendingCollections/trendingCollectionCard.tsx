import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import blobStorageService from '../../utils/variables';

interface TrendingCollectionCardProps {
  trendingDetails: any;
  trendingType: string;
}

const TrendingCollectionCard: FC<TrendingCollectionCardProps> = ({ trendingDetails, trendingType }) => {
  const {
    name,
    identifier,
    minterName,
    minterId,
    displayPic,
    minterIcon,
    total_supply: totalSupply,
    tokenType,
    symbol,
    salePrice,
    inMarketCount,
  } = trendingDetails;
  const isCollection =
    trendingType === 'collection' || trendingType === 'sbt' || trendingType === 'nftc' || trendingType === 'ft';
  const trendTypeFolder =
    trendingType === 'collection' || trendingType === 'sbt' || trendingType === 'nftc' || trendingType === 'ft'
      ? 'collection'
      : 'nft';
  return (
    <Grid className="cardlistouter" xs={12} sm={6} md={3}>
      <div className="cardview" data-cy="trending-card">
        {displayPic && (
          <div className="imagesec">
            <Link to={`/${trendTypeFolder}/${identifier}/home`}>
              <img
                src={`${blobStorageService.hostname}/public/uploads/${trendTypeFolder}/${identifier}/display_pic/${displayPic}${blobStorageService.sas}`}
                alt="trending"
              />
            </Link>
          </div>
        )}
        <div className="textpart">
          <Grid container direction="column" justifyContent="start" alignItems="stretch">
            <Grid className="name-section-outer" container direction="row" justifyContent="space-between">
              <Grid className="name-part" data-cy="carousal-card-name">
                <Link to={`/${trendTypeFolder}/${identifier}/home`}>
                  {tokenType === 'ft' && (
                    <h4>
                      {name}.{symbol}
                    </h4>
                  )}
                  {tokenType !== 'ft' && <h4>{name}</h4>}
                </Link>
              </Grid>
              {salePrice && (
                <Grid className="price-part">
                  <span>{salePrice} Hbar</span>
                </Grid>
              )}
            </Grid>
            <Grid className="cardlistprofilename" container direction="row" justifyContent="space-between">
              <Grid className="namesection" container direction="row">
                <Link to={`/user/${minterId}/profile`}>
                  {minterIcon && (
                    <span className="profilview">
                      <img
                        src={`${blobStorageService.hostname}/public/uploads/user/${minterId}/icon/${minterId}.jpeg${blobStorageService.sas}`}
                        alt="minter"
                      />
                    </span>
                  )}
                  <span className="profilename">{minterName}</span>
                </Link>
              </Grid>
              <Grid className="token-text">
                <p className="idenitifer">{identifier}</p>
              </Grid>
            </Grid>
            <Grid className="supply-outer" container direction="row" justifyContent="space-between">
              {isCollection && (
                <Grid className="supplylist" xs={9} container>
                  {totalSupply && (
                    <Grid xs={6}>
                      <p className="total-supply">Total Supply</p>
                      <h6>{totalSupply}</h6>
                    </Grid>
                  )}
                  {inMarketCount !== 0 && inMarketCount && (
                    <Grid xs={6}>
                      <p className="total-supply">In market</p>
                      <h6 data-cy="in-market-count">{inMarketCount}</h6>
                    </Grid>
                  )}
                </Grid>
              )}
              {tokenType && (
                <Grid xs={3} container justifyContent="flex-end">
                  <span className="token-type">{tokenType}</span>
                </Grid>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </Grid>
  );
};
export default TrendingCollectionCard;
