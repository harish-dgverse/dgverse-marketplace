import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import './autofillCard.module.scss';
import axios from '../../api/axios';
import Loader from '../loader/loader';
import { stringAvatar } from '../../utils/helpers/avatarUtils';
import blobStorageService from '../../utils/variables';

const AutofillCard = ({ autoFillKey, filterFlag }: { autoFillKey: string; filterFlag: string }) => {
  const {
    isLoading: searchUserByWalletLoading,
    isError: searchUserByWalletError,
    data: searchUserByWalletData,
    refetch,
  } = useQuery({
    queryKey: ['searchUserByWallet'],
    queryFn: () => axios.get(`/v1/analytics/search?q=${autoFillKey}&filterFlag=${filterFlag}`).then((res) => res.data),
  });

  useEffect(() => {
    refetch();
  }, [autoFillKey]);

  if (searchUserByWalletLoading) return <Loader />;
  if (searchUserByWalletError || searchUserByWalletData?.length === 0) return null;
  let displayParams;
  switch (filterFlag) {
    case 'user':
      displayParams = {
        navigateLink: `/user/${searchUserByWalletData[0].user.user_id}/profile`,
        name: searchUserByWalletData[0].user.user_name,
        display_pic: searchUserByWalletData[0].user?.image?.display_pic,
        address: searchUserByWalletData[0].wallet_address,
        id: searchUserByWalletData[0].user.user_id,
        folderName: 'user',
      };
      break;
    case 'nft':
      displayParams = {
        navigateLink: `/user/${searchUserByWalletData[0].nft_id}/profile`,
        name: searchUserByWalletData[0].nft_name,
        display_pic: searchUserByWalletData[0].image?.display_pic,
        address: searchUserByWalletData[0].nft_id,
        id: searchUserByWalletData[0].nft_id,
        folderName: 'nft',
      };
      break;
    case 'token':
      displayParams = {
        navigateLink: `/user/${searchUserByWalletData[0].token_id}/profile`,
        name: searchUserByWalletData[0].name,
        display_pic: searchUserByWalletData[0].image?.display_pic,
        address: searchUserByWalletData[0].token_id,
        id: searchUserByWalletData[0].token_id,
        folderName: 'collection',
      };
      break;
    default:
      return null;
  }
  return (
    <Grid className="autofill-outer" container>
      <Grid sm={6} xs={12} />
      <Grid
        container
        direction="row"
        justifyContent="start"
        alignItems="start"
        className="search-user-by-wallet"
        sm={6}
        xs={12}
      >
        <Link className="userlink" to={displayParams?.navigateLink}>
          <div className="user-icon">
            {displayParams?.display_pic ? (
              <img
                src={`${blobStorageService.hostname}/public/uploads/${displayParams.folderName}/${displayParams?.id}/display_pic/${displayParams.id}.jpeg${blobStorageService.sas}`}
                className="user-icon img"
                alt="user-icon img"
              />
            ) : (
              <Avatar {...stringAvatar(displayParams?.name)} />
            )}
          </div>
        </Link>
        <Grid container direction="column" justifyContent="start" alignItems="start" className="user-details">
          <Link to={`/user/${searchUserByWalletData[0].user.user_id}/profile`}>
            <span className="user-name">{displayParams?.name}</span>
          </Link>
          <span className="user-wallet">{displayParams.address}</span>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AutofillCard;
