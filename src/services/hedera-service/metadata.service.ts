/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import axios from '../../api/axios';

export const uploadMetadata = async (nftState: any, displayPic: any) => {
  try {
    return await axios.put(`/v1/ipfs/metadata`, { ...nftState, imageBlob: displayPic }).then((res) => res.data);
  } catch (error) {
    return error;
  }
};
