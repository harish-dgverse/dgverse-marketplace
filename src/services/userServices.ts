import axios from '../api/axios';
import { removeEmptyValues } from '../utils/commonUtils';

/* eslint-disable import/prefer-default-export */
export const addUserDetails = async (data: any) => {
  const payload = removeEmptyValues(data);
  const response = await axios.patch('/v1/user/details', payload, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
  return response;
};
