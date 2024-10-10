/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Grid, MenuItem, Select } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';
import CarousalGroup from '../carousalGroup/carousalGroup';

import Loader from '../loader/loader';
import ErrorOccured from '../errorOccured/errorOccured';

const TrendingSection = () => {
  const [trendSelectInputChange, setTrendSelectInputChange] = useState('NFT and Social token collections');

  const [trendingData, setTrendingData] = useState([]);
  const [trendingType, setTrendingType] = React.useState('collection');

  const { isLoading, isError, data } = useQuery({
    queryKey: ['trendingData'],
    queryFn: () => axios.get('/v1/analytics/trend').then((res) => res.data),
  });

  useEffect(() => {
    if (data) {
      setTrendingData(data.token);
    }
  }, [data]);

  const handleTrendSelectInputChange = (ev: any) => {
    setTrendSelectInputChange(ev.target.value);
    // setValue(newValue);
    if (ev.target.value === 'NFT Collections') {
      setTrendingData(data.nftc);
      setTrendingType('nftc');
    } else if (ev.target.value === 'Social tokens') {
      setTrendingData(data.ft);
      setTrendingType('ft');
    } else if (ev.target.value === 'NFT') {
      setTrendingData(data.nft);
      setTrendingType('nft');
    } else {
      setTrendingData(data.token);
      setTrendingType('collection');
    }
  };
  if (isLoading) return <Loader />;
  if (isError) return <ErrorOccured />;
  return (
    <section className="collection">
      <div className="astronut" />
      <Grid container justifyContent="space-between" alignItems="baseline" className="textview">
        <h1>Trending Collections</h1>
        <Grid>
          <Select
            className="trendingCollectionsOptions"
            id="nft-type"
            name="tokenCategory"
            onChange={handleTrendSelectInputChange}
            value={trendSelectInputChange}
          >
            {['NFT and Social token collections', 'NFT Collections', 'Social tokens', 'NFT'].map((item: any) => (
              <MenuItem value={item} key={item}>
                <span className="dropdown-menu">{item}</span>
              </MenuItem>
            ))}
          </Select>
          <Link to={`/collection?trendType=${trendingType}`}>
            <Button className="more" variant="outlined">
              See more
            </Button>
          </Link>
        </Grid>
      </Grid>
      <CarousalGroup carousal trendingData={trendingData} trendingType={trendingType} />
      {data.nftOnSale?.length > 0 && (
        <>
          <Grid container justifyContent="space-between" alignItems="baseline" className="textview">
            <h1>Hot NFTs in market</h1>
            <Grid>
              <Link to="/nft">
                <Button className="more" variant="outlined">
                  See more
                </Button>
              </Link>
            </Grid>
          </Grid>
          <CarousalGroup carousal trendingData={data.nftOnSale} trendingType="nft" />
        </>
      )}
      {data.ftOnSale?.length > 0 && (
        <>
          <Grid container justifyContent="space-between" alignItems="baseline" className="textview">
            <h1>Trending Social tokens in market</h1>
            <Grid>
              <Link to="/collection?trendType=ft&onSale=true">
                <Button className="more" variant="outlined">
                  See more
                </Button>
              </Link>
            </Grid>
          </Grid>
          <CarousalGroup carousal trendingData={data.ftOnSale} trendingType="ft" />
        </>
      )}
    </section>
  );
};
export default TrendingSection;
