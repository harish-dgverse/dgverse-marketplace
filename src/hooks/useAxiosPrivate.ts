import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefreshToken';
import { useStore } from '../store/store';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const [store] = useStore();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${store?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [store.user, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
