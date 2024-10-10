/* eslint-disable no-unused-vars */
import { Button, TextField, TextFieldProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Grid from '@mui/material/Unstable_Grid2';
import React, { FC, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import CounterInput from 'react-counter-input';
import './sendToMarketplace.scss';
import { sendToMarketplace } from '../../services/nftServices';
import { useStore } from '../../store/store';
import axios from '../../api/axios';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import useHederaWallets from '../../hooks/useHederaWallets';

interface SendToMarketplaceProps {}
interface onSaleType {
  identifier: string | undefined;
  sellerId?: number;
  tokenType: string | undefined;
  expiresAt: any;
  quotedPrice?: any;
  sellerWalletId?: any;
  volume: number;
  walletAddress: string;
  walletType: string;
  topic?: any;
}

const SendToMarketplace: FC<SendToMarketplaceProps> = () => {
  const navigate = useNavigate();
  const { identifier, tokenType } = useParams();
  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const loggedUserId = user?.user_id;
  const userLoggedIn = !!user?.user_id;
  const [socialTokenDetails, setSocialTokenDetails] = useState<any>({});
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();
  const onSaleInitialState: onSaleType = {
    identifier,
    tokenType,
    expiresAt: null,
    quotedPrice: '',
    volume: 0,
    walletType: '',
    walletAddress: '',
  };

  const [onSaleState, setOnSaleState] = useState(onSaleInitialState);

  const handleDateChange = (date: React.SetStateAction<null>) => {
    setOnSaleState({
      ...onSaleState,
      expiresAt: date,
    });
  };

  const handleVolumeChange = (count: number) => {
    setOnSaleState({
      ...onSaleState,
      volume: count,
    });
  };

  const handleInputChange = (ev: any) => {
    if (ev.target.name === 'allowCounter') {
      setOnSaleState({
        ...onSaleState,
        [ev.target.name]: ev.target.checked,
      });
    } else {
      setOnSaleState({
        ...onSaleState,
        [ev.target.name]: ev.target.value,
      });
    }
  };

  const successOperation = () => {
    enqueueSnackbar('Listed for sale', { variant: 'success' });
    setOnSaleState(onSaleInitialState);
    if (tokenType === 'nft') navigate(`/nft/${identifier}/home`);
    if (tokenType === 'ft') navigate(`/collection/${identifier}/home`);
    queryClient.invalidateQueries({ queryKey: ['tokenHomeItems'] });
  };

  const clearData = () => {
    setOnSaleState(onSaleInitialState);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: sendToMarketplace,
    onSuccess: (data: any) => {
      if (data.status === 200) {
        successOperation();
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const {
    isLoading: tokenItemLoading,
    isError: tokenItemError,
    data: tokenItemsData,
  } = useQuery({
    queryKey: ['tokenHomeItems'],
    enabled: tokenType === 'ft',
    queryFn: () => axios.get(`/v1/token/${identifier}`).then((res) => res.data),
  });

  const handleCreate = async (ev: any) => {
    ev.preventDefault();
    if (tokenType === 'nft' && onSaleState.quotedPrice === '') {
      enqueueSnackbar(`Please fill in all fields`, { variant: 'error' });
      return;
    }
    if (tokenType === 'ft' && onSaleState.volume === 0) {
      enqueueSnackbar(`Please fill in all fields`, { variant: 'error' });
      return;
    }
    const payload = { ...onSaleState };
    if (tokenType === 'ft') {
      payload.quotedPrice = tokenItemsData.ft_sales_price;
    }
    payload.sellerId = user?.user_id;
    payload.sellerWalletId = user?.wallet_address;
    payload.walletAddress = walletAddress;
    payload.walletType = walletType;
    payload.topic = hashConnectState?.topic;
    mutate(payload);
  };

  useEffect(() => {
    if (!tokenItemLoading && !tokenItemError && userLoggedIn) {
      if (tokenItemsData.token_type === 'ft') {
        const socialTokenPartitions = tokenItemsData.SocialToken;
        const socialTokenFiltered = socialTokenPartitions.filter((x: any) => x.volume > 0 && x.ownedBy === loggedUserId);
        if (socialTokenFiltered.length > 0) {
          setSocialTokenDetails(socialTokenFiltered[0]);
        }
      }
    }
  }, [tokenItemLoading]);

  if (tokenType === 'ft') {
    if (tokenItemError) return <ErrorComponent />;
    if (tokenItemLoading) return <LoadingComponent />;
  }
  return (
    <div className="send-to-marketplace-outer-container">
      <div className="leftview" />
      <section className="send-to-marketplace-container">
        <span className="page-header">send to marketplace</span>
        <p className="form-info">All fields marked with * are required</p>
        <div className="send-to-marketplace-fields-container">
          {tokenType === 'nft' && (
            <Grid container>
              <Grid sm={6} xs={12}>
                Sale Price:<sup>*</sup>
              </Grid>
              <Grid sm={6} xs={12}>
                <TextField
                  id="stm-base-amount"
                  data-cy="stm-base-amount"
                  onChange={handleInputChange}
                  name="quotedPrice"
                  value={onSaleState.quotedPrice}
                  placeholder="Please quoted price in Hbar"
                  label="Please quoted price in Hbar"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}
          {tokenType === 'ft' && (
            <Grid container>
              <Grid sm={6} xs={12}>
                Volume to put on sale:
              </Grid>
              <Grid sm={6} xs={12} data-cy="CounterInput-container" className="counter-input">
                <CounterInput min={0} max={socialTokenDetails.volume} onCountChange={handleVolumeChange} />
              </Grid>
            </Grid>
          )}
        </div>
        <div className="send-to-marketplace-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={clearData}>
            Clear
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="create-button" disabled={isLoading} onClick={handleCreate}>
              Submit
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default SendToMarketplace;
