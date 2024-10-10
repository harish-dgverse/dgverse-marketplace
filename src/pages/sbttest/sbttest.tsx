/* eslint-disable no-unused-vars */
import { Button, TextField, TextFieldProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Grid from '@mui/material/Unstable_Grid2';
import React, { FC, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
// import CounterInput from 'react-counter-input';
import { sendToMarketplace } from '../../services/nftServices';
import { useStore } from '../../store/store';
import axios from '../../api/axios';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import Navbar from '../../components/navbarSBT/navbar';

interface SendToMarketplaceProps {}

const SBTtest: FC<SendToMarketplaceProps> = () => {
  const [state] = useStore();
  const { user } = state;
  const loggedUserId = user?.user_id;
  const userLoggedIn = !!user?.user_id;
  const {
    isLoading: tokenItemLoading,
    isError: tokenItemError,
    data: tokenItemsData,
  } = useQuery({
    queryKey: ['tokenHomeItems'],
    enabled: userLoggedIn,
    queryFn: () => axios.get(`/v1/user/${loggedUserId}/check-token/0.0.4529779`).then((res) => res.data),
  });

  if (userLoggedIn && tokenItemError) return <ErrorComponent />;
  if (userLoggedIn && tokenItemLoading) return <LoadingComponent />;
  return (
    <div className="send-to-marketplace-outer-container">
      <Navbar hts />
      {!userLoggedIn && <h3>Connect your wallet to see whether you can avail any discount.</h3>}
      {!userLoggedIn && (
        <h3>NB: You can avail discount if you are a graduage of BA in design from university of Lorem Ipsum.</h3>
      )}
      {userLoggedIn && tokenItemsData.status && <h2>Hey you have access</h2>}
      {userLoggedIn && !tokenItemsData.status && <h2>Hey you dont have access</h2>}
    </div>
  );
};

export default SBTtest;
