import { FC } from 'react';
import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';
import Loader from '../../components/loader/loader';
import ErrorOccured from '../../components/errorOccured/errorOccured';
import CarousalGroup from '../../components/carousalGroup/carousalGroup';
import './relatedNFT.module.scss';

interface RelatedNftProps {
  nftId: string;
}

const RelatedNFT: FC<RelatedNftProps> = ({ nftId }) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['relatedNft'],
    queryFn: () => axios.get(`/v1/analytics/related/${nftId}`).then((res) => res.data),
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorOccured />;
  if (data.length === 0) return null;
  return (
    <Grid className="related-nft-container" container columnSpacing={2}>
      <div className="more-headers">
        <span className="heading">Related NFTs</span>
      </div>
      <Grid item xs={12}>
        <CarousalGroup carousal trendingType="nft" trendingData={data} />
      </Grid>
    </Grid>
  );
};

export default RelatedNFT;
