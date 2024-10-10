import { FC } from 'react';
import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/loader/loader';
import ErrorOccured from '../../components/errorOccured/errorOccured';
import CarousalGroup from '../../components/carousalGroup/carousalGroup';
import './moreFromUser.module.scss';

interface MoreFromUserProps {
  userId: string | undefined;
  nftId: string | undefined;
}

const MoreFromUser: FC<MoreFromUserProps> = ({ userId, nftId }) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['moreFromUser'],
    queryFn: () =>
      axios
        .get(`/v1/artifact/listing/nft`, {
          params: {
            sortOrder: 'trending',
            limit: 10,
            page: 1,
            filterByUser: userId,
            favoriteOnly: false,
            excludeNft: nftId,
          },
        })
        .then((res) => res.data),
  });
  if (isLoading) return <Loader />;
  if (isError) return <ErrorOccured />;
  if (data.paginatedData.length === 0) return null;
  return (
    <Grid container className="more-from-user-container" columnSpacing={2}>
      <div className="more-headers">
        <span className="heading">More from user</span>
        <Link to={`/nft/${userId}`}>
          <Button className="more" variant="outlined">
            See more
          </Button>
        </Link>
      </div>
      <Grid className="more-from-user" item xs={10}>
        {!isLoading && !isError && <CarousalGroup carousal trendingType="nft" trendingData={data?.paginatedData} />}
      </Grid>
    </Grid>
  );
};

export default MoreFromUser;
