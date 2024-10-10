/* eslint-disable no-unused-vars */
import React, { FC, useEffect, useState } from 'react';
import { Button, IconButton, Grid } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import CounterInput from 'react-counter-input';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import Badge from '@mui/material/Badge';
import axios from '../../api/axios';
import ImageStack from '../../components/imageStack/imageStack';
import SocialMediaLinks from '../../components/socialMediaLinks/socialMediaLinks';
import CarousalGroup from '../../components/carousalGroup/carousalGroup';
import './collectionHomePage.module.scss';
import Filter from '../../components/filter/filter';
import Sort from '../../components/sort/sort';
import { getPaginatedData } from '../../utils/pagination';
import {
  nftFilterInitialState,
  sortNFTOptions,
  filterChildNFTOptions,
  paginationLimit,
} from '../../helpers/filterSortOptions';
import { FilterOptionsInterface } from '../../helpers/interfaceHelpers';
import StatisticsBasic from '../../components/statisticsBasic/statisticsBasic';
import CollectionActionButtonGroup from '../../components/collectionActionButtonGroup/collectionActionButtonGroup';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import Loader from '../../components/loader/loader';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import ErrorOccured from '../../components/errorOccured/errorOccured';
import blobStorageService from '../../utils/variables';
import { useStore } from '../../store/store';
import { handleBuySale, withdrawFromMarketplace, sendToMarketplace } from '../../services/nftServices';
import SaleActivities from '../../components/saleActivities/saleActivities';
import useHederaWallets from '../../hooks/useHederaWallets';

interface CollectionHomePageProps {}

const CollectionHomePage: FC<CollectionHomePageProps> = () => {
  const { tokenId } = useParams();
  const [store] = useStore();
  const { user, walletAddress, walletType } = store;
  const { hashConnectState } = useHederaWallets();
  const loggedUserId = user?.user_id;
  const userLoggedIn = !!user?.user_id;
  const filterOptionsInitialState: FilterOptionsInterface = {
    saletype: nftFilterInitialState.saletype,
    category: nftFilterInitialState.category,
  };
  const [sortOrder, setSortOrder] = React.useState<string>(sortNFTOptions[0].value);
  const [volume, setVolume] = React.useState<any>({});
  const [isOwner, setIsOwner] = useState(false);
  const [userHasSocialToken, setUserHasSocialToken] = useState(false);
  const [socialTokenDetails, setSocialTokenDetails] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();
  const [saleOnProgress, setSaleOnProgress] = useState('false');
  const queryClient = useQueryClient();

  const [filterOptionState, setFilterOptionState] = useState<FilterOptionsInterface>(filterOptionsInitialState);
  const {
    isLoading,
    isError,
    data: filteredData,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['filteredDataChildNft', 'infinte'],
    getNextPageParam: (prevData: any) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedData('nft', pageParam, filterOptionState, sortOrder, paginationLimit, '', tokenId),
    refetchOnWindowFocus: false,
  });
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
  const basicStatistics = useQuery({
    queryKey: ['collectionStats'],
    queryFn: () => axios.get(`/v1/token/${tokenId}/stats`).then((res) => res.data),
  });

  const {
    isLoading: tokenItemLoading,
    isError: tokenItemError,
    data: tokenItemsData,
  } = useQuery({
    queryKey: ['tokenHomeItems'],
    queryFn: () => axios.get(`/v1/token/${tokenId}?loggedUserId=${loggedUserId}`).then((res) => res.data),
  });

  useEffect(() => {
    refetch();
  }, [sortOrder]);

  const applyFilterData = () => {
    refetch();
  };

  const clearFilterData = () => {
    setFilterOptionState(filterOptionsInitialState);
    // Temp solution
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const [userInteractionState, setUserInteractionState] = useState({
    like: false,
    favorite: false,
    follow: false,
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
  });

  useEffect(() => {
    if (!tokenItemLoading && !tokenItemError && userLoggedIn) {
      if (tokenItemsData?.user.user_id === loggedUserId) setIsOwner(true);
      else {
        axios.put('v1/misc/view', {
          userId: loggedUserId,
          tokenId,
        });
      }
      if (tokenItemsData.token_type === 'ft') {
        const socialTokenPartitions = tokenItemsData.SocialToken;
        const socialTokenFiltered = socialTokenPartitions.filter((x: any) => x.volume > 0 && x.ownedBy === loggedUserId);
        if (socialTokenFiltered.length > 0) {
          setUserHasSocialToken(true);
          setSocialTokenDetails(socialTokenFiltered[0]);
          basicStatistics?.data?.push({
            type: 'tokensInHand',
            label: 'Tokens in hands',
            value: socialTokenFiltered[0].volume,
          });
          if (socialTokenFiltered[0].saleDetails) setSaleOnProgress('true');
          else setSaleOnProgress('false');
        } else setSaleOnProgress('false');
      }
      if (tokenItemsData.count) {
        setUserInteractionCount({
          like: tokenItemsData.count.UserLike,
          views: tokenItemsData.count.UserView + 1,
        });
        setUserInteractionState({
          like: tokenItemsData?.userActions?.like,
          favorite: tokenItemsData?.userActions?.favorite,
          follow: tokenItemsData?.userActions?.follow,
        });
      }
    }
  }, [tokenItemLoading, tokenItemsData]);

  const handleFavorite = async () => {
    setUserInteractionState({ ...userInteractionState, favorite: !userInteractionState.favorite });
    // To disable button for 2 seconds
    setUserInteractionButtonState({ ...userInteractionButtonState, favorite: true });
    const { status } = await axios.post('v1/user/favorites/', {
      userId: loggedUserId,
      tokenId,
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
      tokenId,
      like: !userInteractionState.like,
    });
    if (status === 200) setUserInteractionButtonState({ ...userInteractionButtonState, like: false });
    // setTimeout(() => {
    //   setUserInteractionButtonState({ ...userInteractionButtonState, like: false });
    // }, 2000);
  };

  const handleShare = async () => {
    // To disable button for 2 seconds
    setUserInteractionButtonState({ ...userInteractionButtonState, share: true });
    const { status } = await axios.post('v1/share', {
      userId: loggedUserId,
      tokenId,
      media: 'whatsapp',
    });
    if (status === 200) setUserInteractionButtonState({ ...userInteractionButtonState, share: false });
  };

  const handleFollow = async () => {
    // To disable button for 2 seconds
    setUserInteractionButtonState({ ...userInteractionButtonState, follow: true });
    const { status } = await axios.post('v1/followings', {
      userId: loggedUserId,
      userTo: tokenItemsData?.user.user_id,
      follow: true,
    });
    if (status !== 200) setUserInteractionButtonState({ ...userInteractionButtonState, follow: false });
  };

  const mutateSaleTransfer = useMutation({
    mutationFn: handleBuySale,
    onSuccess: (successRx: any) => {
      // setOpen(false);
      if (successRx.status === 200 || successRx.status === 201) {
        // setSuccessModal(true);
        queryClient.invalidateQueries({ queryKey: ['tokenHomeItems'] });
        setVolume({});
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

  const handleBuy = async (saleDetails: any) => {
    const { quotedPrice, saleId, sellerId } = saleDetails;
    if (!volume[saleId]) {
      enqueueSnackbar('Please select the amount of tokens you want to buy', { variant: 'error' });
      return;
    }
    const transferData = {
      identifier: tokenId,
      quotedPrice: quotedPrice * volume[saleId],
      saleId,
      buyerId: loggedUserId,
      buyerWalletId: user?.wallet_address,
      sellerWalletId: tokenItemsData?.user.Wallet[0].wallet_address,
      sellerId,
      tokenType: 'ft',
      volume: volume[saleId],
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };

    // queryClient.invalidateQueries({ queryKey: ['tokenHomeItems'] });
    console.log(transferData);
    mutateSaleTransfer.mutate(transferData);
  };

  const mutateSaleCancel = useMutation({
    mutationFn: withdrawFromMarketplace,
    onSuccess: (data: any) => {
      if (data.status === 200) {
        // refetch();
        // Error occured: TypeError: Cannot read properties of undefined (reading 'status')
        queryClient.invalidateQueries({ queryKey: ['tokenHomeItems'] });
        setSaleOnProgress('false');
        enqueueSnackbar(`NFT withdrawn from marketplace`, { variant: 'success' });
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleChangeStatus = async () => {
    const { saleId } = socialTokenDetails.saleDetails;
    const payload = {
      identifier: tokenId,
      saleId,
      tokenType: 'ft',
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    setSaleOnProgress('loading');
    mutateSaleCancel.mutate(payload);
  };

  if (tokenItemError) return <ErrorComponent />;
  if (tokenItemLoading) return <LoadingComponent />;
  return (
    <div className="collection-home-container-outer">
      <div className="collection-home-container">
        <div className="coverpic-outer">
          {tokenItemsData.image?.display_pic && tokenItemsData.image?.cover_pic && (
            <ImageStack
              dp={`${blobStorageService.hostname}/public/uploads/collection/${tokenId}/display_pic/${tokenItemsData.image.display_pic}${blobStorageService.sas}`}
              cover={`${blobStorageService.hostname}/public/uploads/collection/${tokenId}/cover_pic/${tokenItemsData.image.cover_pic}${blobStorageService.sas}`}
            />
          )}
        </div>
        {tokenItemsData.image?.display_pic && !tokenItemsData.image?.cover_pic && (
          <div className="profilepicture">
            <img
              src={`${blobStorageService.hostname}/public/uploads/collection/${tokenId}/display_pic/${tokenItemsData.image.display_pic}${blobStorageService.sas}`}
              className="profile-photo"
              alt="user-cover"
            />
          </div>
        )}
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          className="collection-profile-header"
        >
          <Grid className="sale-container">
            {tokenItemsData.token_type === 'ft' && userHasSocialToken && (
              <Grid container direction="row" alignItems="flex-end" className="ft-sale-action-container">
                <Grid className="contentsec">
                  {saleOnProgress === 'false' && (
                    <p className="remaintoken">
                      <span className="remaining-token-amount">{socialTokenDetails.volume}</span>
                      <span>{tokenItemsData.symbol} on hand</span>
                    </p>
                  )}
                  {saleOnProgress === 'true' && (
                    <p className="remaintoken">
                      <span className="remaining-token-amount">{socialTokenDetails.saleDetails?.volume}</span>
                      <span>{tokenItemsData.symbol} owned by you for sale</span>
                    </p>
                  )}
                </Grid>
                {saleOnProgress === 'false' ? (
                  <Grid className="btn-section">
                    <Link to={`/ft/${tokenItemsData.token_id}/transfer/send-to-marketplace`}>
                      <Button data-cy="send-ft-to-marketplace" className="marketplace-action-button">
                        Send To Marketplace
                      </Button>
                    </Link>
                  </Grid>
                ) : (
                  <Grid className="btn-section">
                    {mutateSaleCancel.isLoading || saleOnProgress === 'loading' ? (
                      <LoadingButton className="marketplace-action-loader-button" loading variant="outlined">
                        Submit
                      </LoadingButton>
                    ) : (
                      <Button
                        className="marketplace-action-button"
                        data-cy="withdraw-ft"
                        disabled={mutateSaleCancel.isLoading}
                        onClick={handleChangeStatus}
                      >
                        Withdraw
                      </Button>
                    )}
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
          <Grid className="collection-profile-header-inner-container">
            <Grid
              container
              className="collection-name-container"
              spacing={3}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ flexGrow: 1 }}
            >
              <Grid className="collection-name-sec-view">
                <div className="collection-name-sec">
                  <div className="collection-name-view">
                    {tokenItemsData.token_type === 'ft' && (
                      <div className="badgeouter">
                        <div className="token-name">
                          {tokenItemsData.name}
                          <div className="badgewrap">
                            <span className="badge">{tokenItemsData.symbol}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {tokenItemsData.token_type !== 'ft' && (
                      <div className="badgeouter">
                        <div className="token-name">{tokenItemsData.name}</div>
                      </div>
                    )}
                  </div>
                  <div className="collection-name-part">
                    {tokenItemsData.ranking && (
                      <IconButton className="user-like-button no-pointer">
                        <TrendingUpIcon className="nft-view-icon" />
                        <span className="nft-view">#{tokenItemsData.ranking.rank}</span>
                      </IconButton>
                    )}
                  </div>
                </div>
                <div className="toketypeouter">
                  <span className="token-type">{tokenItemsData.token_type?.toUpperCase()}</span>
                </div>
                <div className="date-section">
                  <div className="id-date">
                    <span className="token-id">{tokenItemsData.token_id}</span>
                    <span className="user-joining-date">
                      Created on {moment(tokenItemsData.timestamp).format('MMM Do, YYYY')}
                    </span>
                  </div>
                  {tokenItemsData.social_media && (
                    <div className="socialmediaicons">
                      <SocialMediaLinks mediaLinks={tokenItemsData.social_media} />
                    </div>
                  )}
                </div>
              </Grid>
              <Grid
                container
                className="namesec"
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
                xs={12}
              >
                {isOwner && (
                  <Grid className="mint-btn-sec">
                    <Button className="mint-nft-button">
                      <Link to={`/${tokenItemsData.token_type}/mint/?parentTokenId=${tokenItemsData.token_id}`}>Mint</Link>
                    </Button>
                    {userLoggedIn && isOwner && tokenItemsData.token_type === 'ft' && userHasSocialToken && (
                      <Link to={`/ft/${tokenId}/transfer`}>
                        <Button className="mint-nft-button">Free Transfer</Button>
                      </Link>
                    )}
                    <CollectionActionButtonGroup
                      tokenId={tokenItemsData.token_id}
                      tokenType={tokenItemsData.token_type}
                      options={tokenItemsData.actionsAvailable}
                    />
                  </Grid>
                )}
                <Grid className="nft-name-date-share" container columnSpacing={2}>
                  {/* <Grid className="nft-share-container" item>
                    <div className="likesec">
                      <IconButton
                        disabled={userInteractionButtonState.share && userLoggedIn}
                        className="user-like-button"
                        onClick={handleShare}
                      >
                        <ShareIcon className="nft-share-icon" />
                      </IconButton>
                    </div>
                  </Grid> */}
                  {/* <Grid className="nft-share-container" item>
                    {!isOwner && (
                      <div className="likesec">
                        <IconButton
                          disabled={userInteractionButtonState.favorite && userLoggedIn}
                          className="user-like-button"
                          onClick={handleFavorite}
                        >
                          {userInteractionState.favorite && <FavoriteIcon className="nft-share-icon" />}
                          {!userInteractionState.favorite && <FavoriteBorderIcon className="nft-share-icon" />}
                        </IconButton>
                      </div>
                    )}
                  </Grid> */}
                  <Grid className="nft-like-share-view-stat-container" item xs={4}>
                    {!isOwner && (
                      <>
                        <div className="likesec">
                          <IconButton
                            disabled={userInteractionButtonState.favorite && userLoggedIn}
                            data-cy="favorite-button"
                            className="user-like-button"
                            onClick={handleFavorite}
                          >
                            {userInteractionState.favorite && <FavoriteIcon className="nft-share-icon" />}
                            {!userInteractionState.favorite && <FavoriteBorderIcon className="nft-share-icon" />}
                          </IconButton>
                        </div>
                        <div className="likesec">
                          <IconButton
                            disabled={userInteractionButtonState.like && userLoggedIn}
                            className="user-like-button"
                            onClick={handleLike}
                          >
                            {userInteractionState.like && <ThumbUpIcon className="nft-share-icon" />}
                            {!userInteractionState.like && <ThumbUpOffAltIcon className="nft-share-icon" />}
                          </IconButton>
                          <span className="nft-like">{userInteractionCount.like}</span>
                        </div>
                      </>
                    )}
                    {/* {tokenItemsData.ranking && (
                      <IconButton className="user-like-button no-pointer">
                        <TrendingUpIcon className="nft-view-icon" />
                        <span className="nft-view">#{tokenItemsData.ranking.rank}</span>
                      </IconButton>
                    )} */}
                    <div className="likesec">
                      <IconButton className="user-like-button no-pointer">
                        <VisibilityIcon className="nft-view-icon" />
                      </IconButton>
                      <span className="nft-view">{userInteractionCount.views}</span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid className="created-by-user creatuser">
              <div className="content-headers">Created By:</div>
              <div className="created-by-content">
                <Link className="userlink" to={`/user/${tokenItemsData.user.user_id}/profile`}>
                  <div className="user-icon">
                    {tokenItemsData.user?.image?.display_pic ? (
                      <img
                        src={`${blobStorageService.hostname}/public/uploads/user/${tokenItemsData.user.user_id}/display_pic/${tokenItemsData.user.user_id}.jpeg${blobStorageService.sas}`}
                        className="user-icon img"
                        alt="user-icon img"
                      />
                    ) : (
                      <Avatar {...stringAvatar(tokenItemsData.user.user_name)} />
                    )}
                  </div>
                </Link>
                <div className="user-details">
                  <Link to={`/user/${tokenItemsData.user.user_id}/profile`}>
                    <span className="user-name">{tokenItemsData.user.user_name}</span>
                  </Link>
                  <span className="joining-date">{moment(tokenItemsData.user.timestamp).format('MMM Do, YYYY')}</span>
                  {!isOwner && (
                    <span className="button-follow-container">
                      <Button
                        disabled={(userInteractionState.follow || userInteractionButtonState.follow) && userLoggedIn}
                        onClick={handleFollow}
                        data-cy="follow-button"
                        className={userInteractionState.follow || userInteractionButtonState.follow ? 'button' : 'following'}
                      >
                        {(userInteractionState.follow || userInteractionButtonState.follow) && <span>Following</span>}
                        {!(userInteractionState.follow || userInteractionButtonState.follow) && <span>Follow</span>}
                      </Button>
                    </span>
                  )}
                  {tokenItemsData?.user?.SocialMedia && (
                    <div className="social-media-icons">
                      <SocialMediaLinks mediaLinks={tokenItemsData?.user?.SocialMedia} />
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <section className="stat-container">
        <StatisticsBasic basicStatistics={basicStatistics} />
      </section>
      {(tokenItemsData.token_type === 'nft' || tokenItemsData.token_type === 'sbt') && (
        <section className="content">
          <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} sortOptions={sortNFTOptions} />
          <div className="filterpart">
            <Grid className="p-0" container spacing={2}>
              <Grid className="p-0" item xs={12} md={2}>
                <Filter
                  applyFilterData={applyFilterData}
                  filterOptionState={filterOptionState}
                  setFilterOptionState={setFilterOptionState}
                  clearFilterData={clearFilterData}
                  filterOptions={filterChildNFTOptions}
                />
              </Grid>
              <Grid item xs={12} md={10}>
                {(isLoading || isFetching) && <Loader />}
                {isError && !isFetching && !isLoading && <ErrorOccured />}
                {!isLoading && !isError && !isFetching && filteredData?.pages?.[0]?.empty && (
                  <div className="nodat-content">No records to show</div>
                )}
                {!isLoading && !isError && !isFetching && (
                  <CarousalGroup
                    carousal={false}
                    trendingType="nft"
                    trendingData={filteredData?.pages.flatMap((data) => data.nft)}
                  />
                )}
                {hasNextPage && (
                  <section className="seemore">
                    <Button onClick={() => fetchNextPage()} variant="outlined" className="more">
                      {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </Button>
                  </section>
                )}
              </Grid>
            </Grid>
          </div>
        </section>
      )}
      {tokenItemsData.token_type === 'ft' && (
        <section className="content">
          <Grid container sx={{ pl: 1 }}>
            {tokenItemsData.SocialToken?.length > 0 && (
              <Grid item xs={12} sm={6}>
                <h2>Users with token</h2>
                {tokenItemsData.SocialToken.map((socialTokenDetail: any) => {
                  return (
                    <Grid
                      container
                      direction="row"
                      alignItems="baseline"
                      justifyContent="space-between"
                      className="ft-buy-container"
                      data-cy="ft-holders-list"
                    >
                      <Grid className="sale-by-minter-grid">
                        {socialTokenDetail?.ownedBy === tokenItemsData.user.user_id ? (
                          <Badge badgeContent="Minter" color="primary">
                            <Link to={`/user/${socialTokenDetail?.ownedBy}/profile`}>
                              {socialTokenDetail?.ownedByUser?.user_name}
                            </Link>
                          </Badge>
                        ) : (
                          <Link to={`/user/${socialTokenDetail?.ownedBy}/profile`}>
                            {socialTokenDetail?.ownedByUser?.user_name}
                          </Link>
                        )}
                      </Grid>
                      <Grid>
                        <p className="remaintoken">
                          <span>Token balance: </span>
                          <span className="remaining-token-amount">{socialTokenDetail.volume}</span>
                        </p>
                        {socialTokenDetail.saleDetails && (
                          <p className="remaintoken">
                            <span>On Sale: </span>
                            <span className="remaining-token-amount">{socialTokenDetail.saleDetails?.volume}</span>
                          </p>
                        )}
                      </Grid>
                      {socialTokenDetail.saleDetails && (
                        <>
                          <Grid className="counter-input">
                            <CounterInput
                              min={0}
                              max={socialTokenDetail.saleDetails?.volume}
                              count={volume[socialTokenDetail.saleDetails?.saleId]}
                              onCountChange={(count: number) =>
                                setVolume({ ...volume, [socialTokenDetail.saleDetails?.saleId]: count })
                              }
                            />
                          </Grid>
                          <Grid>
                            <Grid className="mint-nft-action-button">
                              {mutateSaleTransfer.isLoading ? (
                                <LoadingButton loading variant="outlined">
                                  Loading...
                                </LoadingButton>
                              ) : (
                                <Button
                                  className="create-button"
                                  data-cy="buy-ft-button"
                                  disabled={
                                    mutateSaleTransfer.isLoading || socialTokenDetail.saleDetails?.sellerId === loggedUserId
                                  }
                                  onClick={() => handleBuy(socialTokenDetail.saleDetails)}
                                >
                                  Buy
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            )}
            <Grid item sx={{ pl: 2 }} xs={12} sm={6}>
              <div className="tablesec">
                {tokenItemsData?.history && (
                  <>
                    <h2>History</h2>
                    <SaleActivities history={tokenItemsData.history} />
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </section>
      )}
    </div>
  );
};

export default CollectionHomePage;
