import axios from '../api/axios';
import { removeEmptyValues } from '../utils/commonUtils';

/* eslint-disable import/prefer-default-export */
export const addEmailToNewletterList = async (data: any) => {
  const response = await axios.put('/v1/user/newletterlist', data);
  return response;
};

export const updateNotifctnReadFlag = async (ntfcnId: number) => {
  const response = await axios.patch(`/v1/user/notification/${ntfcnId}`);
  return response;
};

export const checkCurrentStatusUserToToken = async (payload: any) => {
  const response = await axios.post('/v1/token/freeze-kyc-status', payload);
  return response;
};

export const contactUsMail = async (data: any) => {
  const payload = removeEmptyValues(data);
  const response = await axios.post(`/v1/email`, payload);
  return response;
};
