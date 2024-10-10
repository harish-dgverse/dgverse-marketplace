/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import axios from '../api/axios';

export const getPaginatedData = (
  resource: string,
  page: any,
  filterOptions: any,
  sortOrder: string,
  limit: number,
  filterByUser?: string,
  filterByToken?: string,
  favoriteOnly?: boolean
) => {
  return axios
    .get(`/v1/artifact/listing/${resource}`, {
      params: {
        filterOptions: JSON.stringify(filterOptions),
        sortOrder,
        limit,
        page,
        filterByUser,
        filterByToken,
        favoriteOnly,
      },
    })
    .then((res) => {
      const hasNext = page * limit < res.data.totalCount;
      return {
        nextPage: hasNext ? page + 1 : undefined,
        previousPage: page > 1 ? page - 1 : undefined,
        empty: res.data.paginatedData?.length === 0,
        nft: res.data.paginatedData,
      };
    });
};
