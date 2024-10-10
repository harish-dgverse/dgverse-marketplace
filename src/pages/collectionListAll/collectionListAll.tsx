import React, { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import Filter from '../../components/filter/filter';
import Sort from '../../components/sort/sort';
import CarousalGroup from '../../components/carousalGroup/carousalGroup';
import { getPaginatedData } from '../../utils/pagination';
import {
  collectionFilterInitialState,
  sortCollectionOptions,
  filterCollectionOptions,
  paginationLimit,
} from '../../helpers/filterSortOptions';
import { CollectionOptionsInterface } from '../../helpers/interfaceHelpers';
import Loader from '../../components/loader/loader';
import ErrorOccured from '../../components/errorOccured/errorOccured';

interface CollectionListAllProps {
  favoriteOnly?: boolean;
}

const CollectionListAll: FC<CollectionListAllProps> = ({ favoriteOnly = false }) => {
  const { userId: filterByUser } = useParams();
  const filterOptionsInitialState: CollectionOptionsInterface = collectionFilterInitialState;
  const [sortOrder, setSortOrder] = React.useState<string>(sortCollectionOptions[0].value);
  const [searchParams] = useSearchParams();
  const trendType = searchParams.get('trendType') || '';
  const onSale = searchParams.get('onSale') || '';
  const [filterOptionState, setFilterOptionState] = useState<CollectionOptionsInterface>(filterOptionsInitialState);
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
    queryKey: ['filteredDataCollection', 'infinte'],
    getNextPageParam: (prevData: any) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedData('token', pageParam, filterOptionState, sortOrder, paginationLimit, filterByUser, '', favoriteOnly),

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [sortOrder]);

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

  useEffect(() => {
    if (trendType) {
      if (trendType === 'ft') {
        if (onSale === 'true') {
          setFilterOptionState({
            ...filterOptionsInitialState,
            saletype: { on_sale: true, not_on_sale: false },
            tokenType: { ft: true, nftc: false, sbt: false },
          });
        } else {
          setFilterOptionState({ ...filterOptionsInitialState, tokenType: { ft: true, nftc: false, sbt: false } });
        }
      } else if (trendType === 'nft') {
        setFilterOptionState({ ...filterOptionsInitialState, tokenType: { ft: false, nftc: true, sbt: false } });
      } else if (trendType === 'sbt') {
        setFilterOptionState({ ...filterOptionsInitialState, tokenType: { ft: false, nftc: false, sbt: true } });
      }
      setTimeout(() => {
        refetch();
      }, 200);
    }
  }, [trendType]);

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

  return (
    <div>
      <section className="content">
        <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} sortOptions={sortCollectionOptions} />
        <div className="filterpart">
          <Grid className="p-0" container spacing={2}>
            <Grid className="p-0" xs={12} md={2}>
              <Filter
                applyFilterData={applyFilterData}
                filterOptionState={filterOptionState}
                setFilterOptionState={setFilterOptionState}
                clearFilterData={clearFilterData}
                filterOptions={filterCollectionOptions}
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
                  trendingType="collection"
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

export default CollectionListAll;
