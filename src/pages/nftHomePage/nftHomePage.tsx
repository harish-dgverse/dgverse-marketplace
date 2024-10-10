import { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, IconButton } from '@mui/material';
// import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import './nftHomePage.module.scss';
import { useQuery, useMutation } from '@tanstack/react-query';
import moment from 'moment';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useSnackbar } from 'notistack';
import axios from '../../api/axios';
import SocialMediaLinks from '../../components/socialMediaLinks/socialMediaLinks';
import ImageStack from '../../components/imageStack/imageStack';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import SaleActivities from '../../components/saleActivities/saleActivities';
import Description from './description';
import TagsList from './tagsList';
import AdditionalDetails from './additionalDetails';
import RelatedNFT from './relatedNFT';
import MoreFromUser from './moreFromUser';
import { useStore } from '../../store/store';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import blobStorageService from '../../utils/variables';
import { splitNftId } from '../../services/hedera-service/utils/htsUtils';
import { handleBuySale, withdrawFromMarketplace } from '../../services/nftServices';
import hbarIcon from '../../assets/icon/hbar-icon-black.png';
import useHederaWallets from '../../hooks/useHederaWallets';

interface NftHomePageProps {}

const NftHomePage: FC<NftHomePageProps> = () => {
  const { nftId } = useParams();
  const { tokenId } = splitNftId(nftId as string);
  const [store] = useStore();
  const { user, walletAddress, walletType } = store;
  const { hashConnectState } = useHederaWallets();
  const loggedUserId = user?.user_id;
  const userLoggedIn = !!user?.user_id;
  const axiosPrivate = useAxiosPrivate();
  const { enqueueSnackbar } = useSnackbar();
  const [saleOnProgress, setSaleOnProgress] = useState(false);

  const {
    isLoading: nftItemLoading,
    isError: nftItemError,
    data: nftItemsData,
    refetch,
  } = useQuery({
    queryKey: ['nftHomeItems'],
    queryFn: () => axiosPrivate.get(`/v1/nft/${nftId}?loggedUserId=${loggedUserId}`).then((res) => res.data),
  });

  // useEffect(() => {
  //   refetch();
  // }, []);

  const [isOwner, setIsOwner] = useState(false);
  const [userInteractionState, setUserInteractionState] = useState({
    like: false,
    favorite: false,
    follow: false,
    followMinter: false,
  });
  const [userInteractionCount, setUserInteractionCount] = useState({
    like: 0,
    views: 1,
  });
  const [userInteractionButtonState, setUserInteractionButtonState] = useState({
    like: false,
    share: false,
    favorite: false,
    follow: false,
    followMinter: false,
  });

  const handleFavorite = async () => {
    setUserInteractionState({ ...userInteractionState, favorite: !userInteractionState.favorite });
    // To disable button for 2 seconds
    setUserInteractionButtonState({ ...userInteractionButtonState, favorite: true });
    const { status } = await axios.post('v1/user/favorites/', {
      userId: loggedUserId,
      NFTId: nftId,
      favorite: !userInteractionState.favorite,
    });
    if (status === 200) setUserInteractionButtonState({ ...userInteractionButtonState, favorite: false });
  };

  const handleLike = async () => {
    // To set count
    setUserInteractionCount({
      ...userInteractionCount,
      like: userInteractionState.like ? userInteractionCount.like - 1 : userInteractionCount.like + 1,
    });
    // To set liked or not
    setUserInteractionState({ ...userInteractionState, like: !userInteractionState.like });
    // To disable button for 2 seconds
    setUserInteractionButtonState({ ...userInteractionButtonState, like: true });
    const { status } = await axios.post('v1/like', {
      userId: loggedUserId,
      NFTId: nftId,
      like: !userInteractionState.like,
    });
    if (status === 200) setUserInteractionButtonState({ ...userInteractionButtonState, like: false });
  };

  // const handleShare = async () => {
  //   // To disable button for 2 seconds
  //   setUserInteractionButtonState({ ...userInteractionButtonState, share: true });
  //   const { status } = await axios.post('v1/share', {
  //     userId: loggedUserId,
  //     NFTId: nftId,
  //     media: 'whatsapp',
  //   });
  //   if (status === 200) setUserInteractionButtonState({ ...userInteractionButtonState, share: false });
  // };

  const handleFollow = async (userTo: any, minter: boolean) => {
    // To disable button for 2 seconds
    if (minter) setUserInteractionButtonState({ ...userInteractionButtonState, followMinter: true });
    else setUserInteractionButtonState({ ...userInteractionButtonState, follow: true });

    const { status } = await axios.post('v1/followings', {
      userId: loggedUserId,
      userTo,
      follow: true,
    });
    if (status !== 200) {
      if (minter) setUserInteractionButtonState({ ...userInteractionButtonState, followMinter: false });
      else setUserInteractionButtonState({ ...userInteractionButtonState, follow: false });
    }
  };

  useEffect(() => {
    if (!nftItemLoading && !nftItemError && userLoggedIn) {
      if (nftItemsData?.user.user_id === loggedUserId) setIsOwner(true);
      else {
        axios.put('v1/misc/view', {
          userId: loggedUserId,
          NFTId: nftId,
        });
      }
      setUserInteractionCount({
        like: nftItemsData.count.UserLike,
        views: nftItemsData.count.UserView + 1,
      });
      setUserInteractionState({
        like: nftItemsData.userActions.like,
        favorite: nftItemsData.userActions.favorite,
        follow: nftItemsData.userActions.follow,
        followMinter: nftItemsData.userActions.followMinter,
      });

      if (loggedUserId && nftItemsData?.saleDetails) {
        setSaleOnProgress(true);
      } else setSaleOnProgress(false);
    }
  }, [nftItemLoading, nftItemsData]);

  function stringToColor(string: string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }

  function stringAvatar(name: string) {
    const splitName = name.split(' ');
    let avatarChildren;
    if (splitName.length > 1) {
      avatarChildren = `${splitName[0][0]}${splitName[1][0]}`;
    } else avatarChildren = `${splitName[0][0]}${splitName[0][1]}`;
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 32,
        height: 32,
      },
      children: avatarChildren,
    };
  }

  const mutateSaleTransfer = useMutation({
    mutationFn: handleBuySale,
    onSuccess: (successRx: any) => {
      // setOpen(false);
      if (successRx.status === 200 || successRx.status === 201) {
        refetch();
        enqueueSnackbar(`Transaction Succesful`, { variant: 'success' });
      } else if (successRx.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      // setOpen(false);
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const mutateSaleCancel = useMutation({
    mutationFn: withdrawFromMarketplace,
    onSuccess: (data: any) => {
      if (data.status === 200) {
        refetch();
        enqueueSnackbar(`NFT withdrawn from marketplace`, { variant: 'success' });
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleBuyAction = async () => {
    const quotedPrice = nftItemsData?.saleDetails?.quotedPrice;
    const transferData = {
      identifier: nftId,
      quotedPrice,
      saleId: nftItemsData?.saleDetails?.saleId,
      buyerId: loggedUserId,
      buyerWalletId: user?.wallet_address,
      sellerId: nftItemsData?.user.user_id,
      sellerWalletId: nftItemsData?.user.Wallet[0].wallet_address,
      tokenType: 'nft',
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutateSaleTransfer.mutate(transferData);
  };

  const handleChangeStatus = async () => {
    const payload = {
      identifier: nftId,
      saleId: nftItemsData?.saleDetails?.saleId,
      tokenType: 'nft',
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutateSaleCancel.mutate(payload);
  };

  if (nftItemError) return <ErrorComponent />;
  if (nftItemLoading) return <LoadingComponent />;
  return (
    <div className="nft-home-page">
      <div className="collection-home-container">
        <div className="coverpic-outer">
          {nftItemsData.image?.display_pic && nftItemsData.image?.cover_pic && (
            <ImageStack
              dp={`${blobStorageService.hostname}/public/uploads/nft/${nftId}/display_pic/${nftItemsData?.image?.display_pic}${blobStorageService.sas}`}
              cover={`${blobStorageService.hostname}/public/uploads/nft/${nftId}/cover_pic/${nftItemsData?.image?.cover_pic}${blobStorageService.sas}`}
            />
          )}
        </div>
        {nftItemsData?.image?.display_pic && !nftItemsData.image?.cover_pic && (
          <div className="profilepicture">
            <img
              src={`${blobStorageService.hostname}/public/uploads/nft/${nftId}/display_pic/${nftItemsData?.image?.display_pic}${blobStorageService.sas}`}
              className="profile-photo"
              alt="user-cover"
            />
          </div>
        )}
        <div className="nft-header">
          <Grid className="nft-name-date-share" container columnSpacing={2}>
            <Grid item xs={12} sm={5} />
            <Grid item xs={12} sm={7}>
              <Grid container columnSpacing={2}>
                <Grid className="nft-name-containver" item xs={8}>
                  <div className="nft-name">
                    {nftItemsData.nft_name}
                    <span className="tradeicon">
                      {nftItemsData.ranking && (
                        <IconButton className="user-like-button no-pointer">
                          <TrendingUpIcon className="nft-view-icon" />
                          <span className="nft-view">#{nftItemsData.ranking.rank}</span>
                        </IconButton>
                      )}
                    </span>
                  </div>
                  <div className="id-date">
                    <span className="token-id">{nftItemsData.nft_id}</span>
                    <span className="nft-mint-date-text">
                      Minted on {moment(nftItemsData.timestamp).format('MMM Do, YYYY')}
                    </span>
                  </div>
                  {nftItemsData?.social_media && (
                    <div className="social-media-icons">
                      <SocialMediaLinks mediaLinks={nftItemsData?.social_media} />
                    </div>
                  )}
                </Grid>

                <Grid className="nft-share-container" item xs={12}>
                  <Link to={`/collection/${tokenId}/home`}>
                    <Button className="nft-action-button">Goto Collection</Button>
                  </Link>
                  {userLoggedIn &&
                    isOwner &&
                    nftItemsData.nft_type === 'sbt' &&
                    nftItemsData.user.user_id === loggedUserId && (
                      <Link to={`/${nftItemsData.token.token_type}/${nftId}/transfer`}>
                        <Button data-cy="transfer-sbt" className="nft-action-button">
                          Transfer SBT
                        </Button>
                      </Link>
                    )}
                  {userLoggedIn &&
                    isOwner &&
                    nftItemsData.nft_type === 'nft' &&
                    nftItemsData.user.user_id === loggedUserId && (
                      <Link to={`/${nftItemsData.token.token_type}/${nftId}/transfer`}>
                        <Button data-cy="free-transfer-nft" className="nft-action-button">
                          Free Transfer
                        </Button>
                      </Link>
                    )}
                  {nftItemsData.nft_type === 'nft' &&
                    userLoggedIn &&
                    isOwner &&
                    (!saleOnProgress ? (
                      <Link to={`/nft/${nftId}/transfer/send-to-marketplace`}>
                        <Button data-cy="stm-nft" className="nft-action-button">
                          Send To Marketplace
                        </Button>
                      </Link>
                    ) : (
                      <Button data-cy="stm-withdraw-transfer-nft" className="nft-action-button" onClick={handleChangeStatus}>
                        Withdraw
                      </Button>
                    ))}
                  {userLoggedIn && !isOwner && nftItemsData.nft_type === 'nft' && nftItemsData.saleDetails && (
                    <Button data-cy="buy-nft" variant="outlined" className="nft-action-button" onClick={handleBuyAction}>
                      Buy
                    </Button>
                  )}
                  <Grid className="nft-action">{saleOnProgress && <span>{saleOnProgress}</span>}</Grid>
                </Grid>

                <Grid className="nft-price-container" container>
                  {nftItemsData?.saleDetails?.quotedPrice && (
                    <Grid className="nft-like-container" item xs={4}>
                      <span className="nft-price">
                        {nftItemsData?.saleDetails?.quotedPrice}
                        <img src={hbarIcon} className="hbar-icon" alt="" />
                      </span>
                    </Grid>
                  )}
                  <Grid className="nft-like-share-view-stat-container" item xs={4}>
                    {!isOwner && (
                      <>
                        <IconButton
                          disabled={userInteractionButtonState.favorite && userLoggedIn}
                          className="user-like-button"
                          onClick={handleFavorite}
                        >
                          {userInteractionState.favorite && <FavoriteIcon className="nft-share-icon" />}
                          {!userInteractionState.favorite && <FavoriteBorderIcon className="nft-share-icon" />}
                        </IconButton>

                        <span className="nft-like">{userInteractionCount.like}</span>
                        <IconButton
                          disabled={userInteractionButtonState.like && userLoggedIn}
                          className="user-like-button"
                          onClick={handleLike}
                        >
                          {userInteractionState.like && <ThumbUpIcon className="nft-share-icon" />}
                          {!userInteractionState.like && <ThumbUpOffAltIcon className="nft-share-icon" />}
                        </IconButton>
                      </>
                    )}
                    <span className="nft-view">{userInteractionCount.views}</span>
                    <IconButton className="user-like-button no-pointer">
                      <VisibilityIcon className="nft-view-icon" />
                    </IconButton>
                    {/* {nftItemsData.ranking && (
                    <IconButton className="user-like-button no-pointer">
                      <TrendingUpIcon className="nft-view-icon" />
                      <span className="nft-view">#{nftItemsData.ranking.rank}</span>
                    </IconButton>
                  )} */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <section className="nft-home-content">
        <Grid container columnSpacing={2}>
          <Description description={nftItemsData?.description} />
          <Grid className="created-by-user" item xs={12} sm={6}>
            <div className="content-headers">Owned By:</div>
            <div className="created-by-content">
              <Link to={`/user/${nftItemsData.user.user_id}/profile`}>
                <div className="user-icon">
                  {nftItemsData.user?.image?.display_pic ? (
                    <img
                      src={`${blobStorageService.hostname}/public/uploads/user/${nftItemsData.user.user_id}/display_pic/${nftItemsData.user.user_id}.jpeg${blobStorageService.sas}`}
                      className="user-icon img"
                      alt="user-icon img"
                    />
                  ) : (
                    <Avatar {...stringAvatar(nftItemsData.user.user_name)} />
                  )}
                </div>
              </Link>
              <div className="user-details">
                <div className="userview">
                  <Link to={`/user/${nftItemsData.user.user_id}/profile`}>
                    <span className="user-name">{nftItemsData.user.user_name}</span>
                  </Link>
                  <span className="joining-date">{moment(nftItemsData.user.timestamp).format('MMM Do, YYYY')}</span>
                  {!isOwner && (
                    <span className="button-follow-container">
                      <Button
                        disabled={(userInteractionState.follow || userInteractionButtonState.follow) && userLoggedIn}
                        onClick={() => handleFollow(nftItemsData.user.user_id, false)}
                        className={userInteractionState.follow || userInteractionButtonState.follow ? 'button' : 'following'}
                      >
                        {(userInteractionState.follow || userInteractionButtonState.follow) && <span>Following</span>}
                        {!(userInteractionState.follow || userInteractionButtonState.follow) && <span>Follow</span>}
                      </Button>
                    </span>
                  )}
                  {nftItemsData?.user?.SocialMedia && (
                    <div className="social-media-icons">
                      <SocialMediaLinks mediaLinks={nftItemsData?.user?.SocialMedia} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container columnSpacing={2}>
          <Grid className="additionalouter" item xs={12} sm={4}>
            {nftItemsData?.additional_info && <AdditionalDetails additionalInfo={nftItemsData.additional_info} />}
            {nftItemsData?.tags && <TagsList tags={nftItemsData.tags} />}
          </Grid>
          <Grid item xs={2} />
          <Grid className="nftactivity" item xs={12} sm={6}>
            {nftItemsData?.history && <SaleActivities history={nftItemsData?.history} />}
            {nftItemsData.user.user_id !== nftItemsData.mintedByUser.user_id && (
              <Grid className="originally-minted-by-user">
                <div className="content-headers">Originally Minted By:</div>
                <div className="created-by-content">
                  <Link to={`/user/${nftItemsData.mintedByUser.user_id}/profile`}>
                    <div className="user-icon">
                      {nftItemsData.mintedByUser?.image?.display_pic ? (
                        <img
                          src={`${blobStorageService.hostname}/public/uploads/user/${nftItemsData.mintedByUser.user_id}/display_pic/${nftItemsData.mintedByUser.user_id}.jpeg${blobStorageService.sas}`}
                          className="user-icon img"
                          alt="user-icon img"
                        />
                      ) : (
                        <Avatar {...stringAvatar(nftItemsData.mintedByUser.user_name)} />
                      )}
                    </div>
                  </Link>
                  <div className="user-details">
                    <Link to={`/user/${nftItemsData.mintedByUser.user_id}/profile`}>
                      <span className="user-name">{nftItemsData.mintedByUser.user_name}</span>
                    </Link>
                    <span className="joining-date">
                      Joined on {moment(nftItemsData.mintedByUser.timestamp).format('MMM Do, YYYY')}
                    </span>
                  </div>
                  <div className="follow-sm-outer">
                    {nftItemsData?.mintedByUser.user_id !== loggedUserId && (
                      <span className="button-follow-container">
                        <Button
                          disabled={
                            (userInteractionState.followMinter || userInteractionButtonState.followMinter) && userLoggedIn
                          }
                          onClick={() => handleFollow(nftItemsData.mintedByUser.user_id, true)}
                          className={
                            userInteractionState.follow || userInteractionButtonState.follow ? 'button' : 'following'
                          }
                        >
                          {(userInteractionState.followMinter || userInteractionButtonState.followMinter) && (
                            <span>Following</span>
                          )}
                          {!(userInteractionState.followMinter || userInteractionButtonState.followMinter) && (
                            <span>Follow</span>
                          )}
                        </Button>
                      </span>
                    )}
                    {nftItemsData?.mintedByUser?.social_media && (
                      <div className="social-media-icons">
                        <SocialMediaLinks mediaLinks={nftItemsData?.mintedByUser?.social_media} />
                      </div>
                    )}
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        </Grid>
      </section>
      <section className="more-nft-section">
        {nftId && <RelatedNFT nftId={nftId} />}
        <Divider />
        {nftId && <MoreFromUser userId={nftItemsData?.user?.user_id} nftId={nftId} />}
      </section>
    </div>
  );
};

export default NftHomePage;
