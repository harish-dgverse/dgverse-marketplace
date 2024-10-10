import React, { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import Filter from '../../components/filter/filter';
import Sort from '../../components/sort/sort';
import CarousalGroup from '../../components/carousalGroup/carousalGroup';
import './nftListAll.module.scss';
import { getPaginatedData } from '../../utils/pagination';
import { nftFilterInitialState, sortNFTOptions, filterNFTOptions, paginationLimit } from '../../helpers/filterSortOptions';
import { FilterOptionsInterface } from '../../helpers/interfaceHelpers';
import Loader from '../../components/loader/loader';
import ErrorOccured from '../../components/errorOccured/errorOccured';

interface NftListAllProps {
  favoriteOnly?: boolean;
}

const NftListAll: FC<NftListAllProps> = ({ favoriteOnly = false }) => {
  const { userId: filterByUser } = useParams();
  const [searchParams] = useSearchParams();
  const trendType = searchParams.get('trendType') || '';
  const onSale = searchParams.get('onSale') || '';
  const filterOptionsInitialState: FilterOptionsInterface = nftFilterInitialState;
  const [sortOrder, setSortOrder] = React.useState<string>(sortNFTOptions[0].value);
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
    queryKey: ['filteredDataNft', 'infinte'],
    getNextPageParam: (prevData: any) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedData('nft', pageParam, filterOptionState, sortOrder, paginationLimit, filterByUser, '', favoriteOnly),
    refetchOnWindowFocus: false,
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

  useEffect(() => {
    if (trendType) {
      if (trendType === 'nft') {
        if (onSale === 'true') {
          setFilterOptionState({
            ...filterOptionsInitialState,
            saletype: { on_sale: true, not_on_sale: false },
            tokenType: { sbt: false, nft: true },
          });
        } else {
          setFilterOptionState({ ...filterOptionsInitialState, tokenType: { sbt: false, nft: true } });
        }
      }
      if (trendType === 'sbt') {
        setFilterOptionState({ ...filterOptionsInitialState, tokenType: { sbt: true, nft: false } });
      }
      setTimeout(() => {
        refetch();
      }, 200);
    }
  }, [trendType]);

  return (
    <div>
      <section className="content">
        <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} sortOptions={sortNFTOptions} />
        <div className="filterpart">
          <Grid className="p-0" container spacing={2}>
            <Grid className="p-0" xs={12} md={2}>
              <Filter
                applyFilterData={applyFilterData}
                filterOptionState={filterOptionState}
                setFilterOptionState={setFilterOptionState}
                clearFilterData={clearFilterData}
                filterOptions={filterNFTOptions}
              />
            </Grid>
            <Grid xs={12} md={10}>
              {(isLoading || isFetching) && <Loader />}
              {isError && !isFetching && !isLoading && <ErrorOccured />}
              {!isLoading && !isError && !isFetching && filteredData?.pages?.[0].empty && (
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
    </div>
  );
};
export default NftListAll;
