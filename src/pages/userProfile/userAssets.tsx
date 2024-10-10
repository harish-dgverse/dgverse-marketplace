/* eslint-disable no-unused-vars */
import * as React from 'react';
import { useEffect, useState, FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Tabs, Tab, Typography, Box, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CarousalGroup from '../../components/carousalGroup/carousalGroup';
import Loader from '../../components/loader/loader';
import ErrorOccured from '../../components/errorOccured/errorOccured';
import axios from '../../api/axios';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  handleTrendSelectInputChange: any;
  trendSelectInputChange: any;
  listItems: any;
  viewAllLink: any;
  trendingType: any;
  userAssetsData: any;
  isOwner: boolean;
}

const TabPanel = (props: TabPanelProps) => {
  const {
    children,
    value,
    index,
    handleTrendSelectInputChange,
    trendSelectInputChange,
    listItems,
    viewAllLink,
    trendingType,
    userAssetsData,
    isOwner,
  } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
      {/* {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )} */}
      <Box sx={{ p: 0 }}>
        <Grid container justifyContent="flex-end" alignItems="baseline" className="textview">
          <Grid className="select-seemore-container">
            <Select
              className="trendingCollectionsOptions"
              id="nft-type"
              name="tokenCategory"
              onChange={handleTrendSelectInputChange}
              value={trendSelectInputChange}
            >
              {listItems.map((item: any) => (
                <MenuItem value={item} key={item}>
                  <span className="dropdown-menu">{item}</span>
                </MenuItem>
              ))}
            </Select>
            {viewAllLink && (
              <Link to={viewAllLink}>
                <Button className="more" variant="outlined">
                  See more
                </Button>
              </Link>
            )}
          </Grid>
        </Grid>
        {userAssetsData && (
          <CarousalGroup
            carousal
            trendingType={trendingType}
            trendingData={userAssetsData}
            maxItems={!isOwner ? { desktop: 5, mobile: 2 } : undefined}
          />
        )}
      </Box>
    </div>
  );
};

interface UserAssetsProps {
  userId: string | undefined;
  isOwner: boolean;
}

const listItemIndex = {
  collection: ['Show all', 'NFT Collections', 'Soul bound token', 'Social tokens'],
  nft: ['Show all', 'SBT', 'NFT'],
};

const trendingTypeIndex = {
  collection: 'collection',
  nftc: 'nftc',
  nft: 'nft',
  sbt: 'sbt',
};

const UserAssets: FC<UserAssetsProps> = ({ userId, isOwner }) => {
  const [value, setValue] = React.useState(0);
  const [userAssets, setUserAssets] = useState([]);
  const [viewAllLink, setViewAllLink] = useState('');
  const [trendSelectInputChange, setTrendSelectInputChange] = useState(listItemIndex.collection[0]);
  // const [trendingData, setTrendingData] = useState([]);
  const [trendingType, setTrendingType] = React.useState(trendingTypeIndex.collection);
  const [listItems, setListItems] = useState(listItemIndex.collection);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['userAssets'],
    queryFn: () =>
      axios(`/v1/user/${userId}/assets`, {
        params: {
          collectionsOwned: true,
          nftOwned: true,
        },
      }).then((res) => res.data),
  });

  const {
    isLoading: isLoadingFav,
    isError: isErrorFav,
    data: favoriteData,
  } = useQuery({
    queryKey: ['userFavs'],
    queryFn: () => axios.get(`/v1/user/favorites/${userId}`).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        if (data?.collectionsOwned?.length > 3) {
          setUserAssets(data.collectionsOwned.slice(0, 3));
          setViewAllLink(`/collection/${userId}`);
        } else {
          setUserAssets(data.collectionsOwned);
          setViewAllLink('');
        }
        setListItems(listItemIndex.collection);
        setTrendSelectInputChange(listItemIndex.collection[0]);
        setTrendingType(trendingTypeIndex.collection);
        break;
      case 1:
        if (data?.nftOwned?.length > 3) {
          setUserAssets(data.nftOwned.slice(0, 3));
          setViewAllLink(`/nft/${userId}`);
        } else {
          setUserAssets(data.nftOwned);
          setViewAllLink('');
        }
        setListItems(listItemIndex.nft);
        setTrendSelectInputChange(listItemIndex.nft[0]);
        setTrendingType(trendingTypeIndex.nft);
        break;
      case 2:
        if (favoriteData?.token?.length > 3) {
          setUserAssets(favoriteData.token.slice(0, 3));
          setViewAllLink(`/collection/favorites/${userId}`);
        } else {
          setUserAssets(favoriteData.token);
          setViewAllLink('');
        }
        setListItems(listItemIndex.collection);
        setTrendSelectInputChange(listItemIndex.collection[0]);
        setTrendingType(trendingTypeIndex.collection);
        break;
      case 3:
        if (favoriteData?.nft?.length > 3) {
          setUserAssets(favoriteData.nft.slice(0, 3));
          setViewAllLink(`/nft/favorites/${userId}`);
        } else {
          setUserAssets(favoriteData.nft);
          setViewAllLink('');
        }
        setListItems(listItemIndex.nft);
        setTrendSelectInputChange(listItemIndex.nft[0]);
        setTrendingType(trendingTypeIndex.nft);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      let firstTab;
      if (data?.collectionsOwned && data?.collectionsOwned?.length !== 0) {
        firstTab = 'collectionsOwned';
        setValue(0);
      } else if (data?.nftOwned && data?.nftOwned?.length !== 0) {
        firstTab = 'nftOwned';
        setValue(1);
      } else if (favoriteData?.token && favoriteData?.token?.length !== 0) {
        firstTab = 'favoriteData.token';
        setValue(2);
      } else if (favoriteData?.nft && favoriteData?.nft?.length !== 0) {
        firstTab = 'favoriteData.nft';
        setValue(3);
      }
      switch (firstTab) {
        case 'collectionsOwned':
          if (data?.collectionsOwned?.length > 3) {
            setUserAssets(data.collectionsOwned.slice(0, 3));
            setViewAllLink(`/collection/${userId}`);
          } else {
            setUserAssets(data.collectionsOwned);
            setViewAllLink('');
          }
          setListItems(listItemIndex.collection);
          break;
        case 'nftOwned':
          if (data?.nftOwned?.length > 3) {
            setUserAssets(data.nftOwned.slice(0, 3));
            setViewAllLink(`/nft/${userId}`);
          } else {
            setUserAssets(data.nftOwned);
            setViewAllLink('');
          }
          setListItems(listItemIndex.nft);
          setTrendSelectInputChange(listItemIndex.nft[0]);
          setTrendingType(trendingTypeIndex.nft);
          break;
        case 'favoriteData.token':
          if (favoriteData?.token?.length > 3) {
            setUserAssets(favoriteData.token.slice(0, 3));
            setViewAllLink(`/collection/favorites/${userId}`);
          } else {
            setUserAssets(favoriteData.token);
            setViewAllLink('');
          }
          setListItems(listItemIndex.collection);
          setTrendSelectInputChange(listItemIndex.collection[0]);
          setTrendingType(trendingTypeIndex.collection);
          break;
        case 'favoriteData.nft':
          if (favoriteData?.nft?.length > 3) {
            setUserAssets(favoriteData.nft.slice(0, 3));
            setViewAllLink(`/nft/favorites/${userId}`);
          } else {
            setUserAssets(favoriteData.nft);
            setViewAllLink('');
          }
          setListItems(listItemIndex.nft);
          setTrendSelectInputChange(listItemIndex.nft[0]);
          setTrendingType(trendingTypeIndex.nft);
          break;
        default:
          break;
      }
    }
  }, [data]);

  const handleTrendSelectInputChange = (ev: any) => {
    setTrendSelectInputChange(ev.target.value);
    // setValue(newValue);
    if (data) {
      switch (value) {
        case 0:
          {
            let collectionsOwned = [];
            let trendingTypeLocal;
            if (ev.target.value === 'NFT Collections') {
              collectionsOwned = data.collectionsOwned.filter((item: any) => item.token_type === 'nft');
              trendingTypeLocal = 'nft';
              setTrendingType('nftc');
            } else if (ev.target.value === 'Social tokens') {
              collectionsOwned = data.collectionsOwned.filter((item: any) => item.token_type === 'ft');
              trendingTypeLocal = 'ft';
              setTrendingType('ft');
            } else if (ev.target.value === 'Soul bound token') {
              collectionsOwned = data.collectionsOwned.filter((item: any) => item.token_type === 'sbt');
              trendingTypeLocal = 'sbt';
              setTrendingType('sbt');
            } else {
              setTrendingType('collection');
              collectionsOwned = data.collectionsOwned;
            }
            if (collectionsOwned.length > 0) {
              setUserAssets(collectionsOwned.slice(0, 3));
              if (trendingTypeLocal) setViewAllLink(`/collection/${userId}?trendType=${trendingTypeLocal}`);
              else setViewAllLink(`/collection/${userId}`);
            } else {
              setUserAssets(collectionsOwned);
              setViewAllLink('');
            }
          }
          break;
        case 1:
          {
            let nftOwned = [];
            let trendingTypeLocal;
            if (ev.target.value === 'NFT') {
              nftOwned = data.nftOwned.filter((item: any) => item.nft_type === 'nft');
              trendingTypeLocal = 'nft';
            } else if (ev.target.value === 'SBT') {
              nftOwned = data.nftOwned.filter((item: any) => item.nft_type === 'sbt');
              trendingTypeLocal = 'sbt';
            } else {
              nftOwned = data.nftOwned;
            }
            setTrendingType('nft');
            if (nftOwned.length > 0) {
              setUserAssets(nftOwned.slice(0, 3));
              if (trendingTypeLocal) setViewAllLink(`/nft/${userId}?trendType=${trendingTypeLocal}`);
              else setViewAllLink(`/nft/${userId}`);
            } else {
              setUserAssets(nftOwned);
              setViewAllLink('');
            }
          }
          break;
        case 2:
          {
            let favoriteTokens = [];
            let trendingTypeLocal;
            if (ev.target.value === 'NFT Collections') {
              favoriteTokens = favoriteData?.token.filter((item: any) => item.token_type === 'nft');
              trendingTypeLocal = 'nft';
              setTrendingType('nftc');
            } else if (ev.target.value === 'Social tokens') {
              favoriteTokens = favoriteData?.token.filter((item: any) => item.token_type === 'ft');
              trendingTypeLocal = 'ft';
              setTrendingType('ft');
            } else if (ev.target.value === 'Soul bound token') {
              favoriteTokens = favoriteData?.token.filter((item: any) => item.token_type === 'sbt');
              trendingTypeLocal = 'sbt';
              setTrendingType('sbt');
            } else {
              setTrendingType('collection');
              favoriteTokens = favoriteData?.token;
            }
            if (favoriteTokens.length > 0) {
              setUserAssets(favoriteTokens.slice(0, 3));
              if (trendingTypeLocal) setViewAllLink(`/collection/favorites/${userId}?trendType=${trendingTypeLocal}`);
              else setViewAllLink(`/collection/favorites/${userId}`);
            } else {
              setUserAssets(favoriteTokens);
              setViewAllLink('');
            }
          }
          break;
        case 3:
          {
            let favoriteNft = [];
            let trendingTypeLocal;
            if (ev.target.value === 'NFT') {
              favoriteNft = favoriteData?.nft.filter((item: any) => item.nft_type === 'nft');
              trendingTypeLocal = 'nft';
              setTrendingType('nft');
            } else if (ev.target.value === 'SBT') {
              favoriteNft = favoriteData?.nft.filter((item: any) => item.nft_type === 'sbt');
              trendingTypeLocal = 'sbt';
              setTrendingType('nft');
            } else {
              setTrendingType('nft');
              favoriteNft = favoriteData?.nft;
            }
            if (favoriteNft.length > 0) {
              setUserAssets(favoriteNft.slice(0, 3));
              if (trendingTypeLocal) setViewAllLink(`/nft/favorites/${userId}?trendType=${trendingTypeLocal}`);
              else setViewAllLink(`/nft/favorites/${userId}`);
            } else {
              setUserAssets(favoriteNft);
              setViewAllLink('');
            }
          }
          break;
        default:
          break;
      }
    }
    // if (value === 0 || value === 2) {
    //   if (ev.target.value === 'NFT Collections') {
    //     setUserAssets(data.nftc);
    //     setTrendingType('nftc');
    //   } else if (ev.target.value === 'Social tokens') {
    //     setUserAssets(data.ft);
    //     setTrendingType('ft');
    //   } else {
    //     setTrendingType('collection');
    //     if (data?.collectionsOwned?.length > 3) {
    //       setUserAssets(data.collectionsOwned.slice(0, 3));
    //       setViewAllLink(`/collection/${userId}`);
    //     } else {
    //       setUserAssets(data.collectionsOwned);
    //       setViewAllLink('');
    //     }
    //   }
    // } else if (value === 1 || value === 3) {
    //   setTrendingType('nft');
    //   if (ev.target.value === 'NFT') {
    //     setUserAssets(data.nftc);
    //   } else if (ev.target.value === 'SBT') {
    //     setUserAssets(data.ft);
    //   } else {
    //     setUserAssets(data.token);
    //   }
    // }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorOccured />;
  return (
    <Box className="user-assets-container" sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 0, borderColor: 'none' }}>
        <Tabs className="tabsection" value={value} onChange={handleChange} aria-label="user-asset-list">
          <Tab
            data-cy="user-assets-pro-p-colcol"
            disabled={isError || !data?.collectionsOwned || data?.collectionsOwned?.length === 0}
            label={isOwner ? 'My Collections' : 'Collections'}
          />
          <Tab
            data-cy="user-assets-pro-p-colnft"
            disabled={isError || !data?.nftOwned || data?.nftOwned?.length === 0}
            label={isOwner ? 'My NFTs' : 'NFTs'}
          />
          <Tab
            data-cy="user-assets-pro-p-favcol"
            disabled={isErrorFav || !favoriteData?.token || favoriteData?.token?.length === 0}
            label="Favorite Collections"
          />
          <Tab
            data-cy="user-assets-pro-p-favnft"
            disabled={isErrorFav || !favoriteData?.nft || favoriteData?.nft?.length === 0}
            label="Favorite NFTs"
          />
        </Tabs>
      </Box>
      <TabPanel
        value={value}
        index={0}
        handleTrendSelectInputChange={handleTrendSelectInputChange}
        trendSelectInputChange={trendSelectInputChange}
        listItems={listItems}
        viewAllLink={viewAllLink}
        trendingType={trendingType}
        userAssetsData={userAssets}
        isOwner={isOwner}
      />
      <TabPanel
        value={value}
        index={1}
        handleTrendSelectInputChange={handleTrendSelectInputChange}
        trendSelectInputChange={trendSelectInputChange}
        listItems={listItems}
        viewAllLink={viewAllLink}
        trendingType={trendingType}
        userAssetsData={userAssets}
        isOwner={isOwner}
      />
      <TabPanel
        value={value}
        index={2}
        handleTrendSelectInputChange={handleTrendSelectInputChange}
        trendSelectInputChange={trendSelectInputChange}
        listItems={listItems}
        viewAllLink={viewAllLink}
        trendingType={trendingType}
        userAssetsData={userAssets}
        isOwner={isOwner}
      />
      <TabPanel
        value={value}
        index={3}
        handleTrendSelectInputChange={handleTrendSelectInputChange}
        trendSelectInputChange={trendSelectInputChange}
        listItems={listItems}
        viewAllLink={viewAllLink}
        trendingType={trendingType}
        userAssetsData={userAssets}
        isOwner={isOwner}
      />
    </Box>
  );
};

export default UserAssets;
