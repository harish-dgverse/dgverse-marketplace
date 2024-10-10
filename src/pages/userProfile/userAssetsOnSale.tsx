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
  viewAllLink: any;
  trendingType: any;
  userAssetsData: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, viewAllLink, trendingType, userAssetsData } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
      {/* {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )} */}
      <Box sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" alignItems="baseline" className="textview">
          <Grid>
            {viewAllLink && (
              <Link to={viewAllLink}>
                <Button className="more" variant="outlined">
                  See more
                </Button>
              </Link>
            )}
          </Grid>
        </Grid>
        {userAssetsData && <CarousalGroup carousal trendingType={trendingType} trendingData={userAssetsData} />}
      </Box>
    </div>
  );
};

interface UserAssetsOnSaleProps {
  userId: string | undefined;
  isOwner: boolean;
}

const trendingTypeIndex = {
  nft: 'nft',
  collection: 'collection',
};

const UserAssetsOnSale: FC<UserAssetsOnSaleProps> = ({ userId, isOwner }) => {
  const [value, setValue] = React.useState(0);
  const [userAssetsOnSale, setUserAssetsOnSale] = useState([]);
  const [showSaleAssets, setShowSaleAssets] = useState(false);
  const [viewAllLink, setViewAllLink] = useState('');
  const [trendingType, setTrendingType] = React.useState(trendingTypeIndex.nft);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['userAssetsOnSale'],
    queryFn: () =>
      axios(`/v1/user/${userId}/assets`, {
        params: {
          ftOnSale: true,
          nftOnSale: true,
        },
      }).then((res) => res.data),
  });

  useEffect(() => {
    if (data) {
      if (data.nftOnSale?.length === 0 && data.ftOnSale.length) setShowSaleAssets(true);
      else setShowSaleAssets(false);
    }
  }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        if (data?.nftOnSale?.length > 0) {
          setUserAssetsOnSale(data.nftOnSale.slice(0, 10));
          setViewAllLink(`/nft/${userId}?trendType=nft&onSale=true`);
        } else {
          setUserAssetsOnSale(data.nftOnSale);
          setViewAllLink('');
        }
        setTrendingType(trendingTypeIndex.nft);
        break;
      case 1:
        if (data?.ftOnSale?.length > 0) {
          setUserAssetsOnSale(data.ftOnSale.slice(0, 3));
          setViewAllLink(`/collection/${userId}?trendType=ft&onSale=true`);
        } else {
          setUserAssetsOnSale(data.ftOnSale);
          setViewAllLink('');
        }
        setTrendingType(trendingTypeIndex.collection);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      let firstTab;
      if (data?.nftOnSale && data?.nftOnSale?.length !== 0) {
        firstTab = 'nftOnSale';
        setValue(0);
      } else if (data?.ftOnSale && data?.ftOnSale?.length !== 0) {
        firstTab = 'ftOnSale';
        setValue(1);
      }
      switch (firstTab) {
        case 'nftOnSale':
          if (data?.nftOnSale?.length > 0) {
            setUserAssetsOnSale(data.nftOnSale.slice(0, 3));
            setViewAllLink(`/nft/${userId}?trendType=nft&onSale=true`);
          } else {
            setUserAssetsOnSale(data.nftOnSale);
            setViewAllLink('');
          }
          break;
        case 'ftOnSale':
          if (data?.ftOnSale?.length > 0) {
            setUserAssetsOnSale(data.ftOnSale.slice(0, 3));
            setViewAllLink(`/collection/${userId}?trendType=ft&onSale=true`);
          } else {
            setUserAssetsOnSale(data.ftOnSale);
            setViewAllLink('');
          }
          setTrendingType(trendingTypeIndex.collection);
          break;
        default:
          break;
      }
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorOccured />;
  if (!showSaleAssets) return null;
  return (
    <Box className="user-assets-onsale-container" sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 0, borderColor: 'none' }}>
        <Tabs className="tabsection" value={value} onChange={handleChange} aria-label="user-asset-list">
          <Tab
            data-cy="user-assets-on-sale-p-colcol"
            disabled={isError || !data?.nftOnSale || data?.nftOnSale?.length === 0}
            label="NFTs on sale "
          />
          <Tab
            data-cy="user-assets-on-sale-p-colnft"
            disabled={isError || !data?.ftOnSale || data?.ftOnSale?.length === 0}
            label="Social tokens on sale"
          />
        </Tabs>
      </Box>
      <TabPanel
        value={value}
        index={0}
        viewAllLink={viewAllLink}
        trendingType={trendingType}
        userAssetsData={userAssetsOnSale}
      />
      <TabPanel
        value={value}
        index={1}
        viewAllLink={viewAllLink}
        trendingType={trendingType}
        userAssetsData={userAssetsOnSale}
      />
    </Box>
  );
};

export default UserAssetsOnSale;
