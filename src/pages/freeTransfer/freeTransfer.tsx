/* eslint-disable no-unused-vars */
import Grid from '@mui/material/Unstable_Grid2';
import React, { FC, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CounterInput from 'react-counter-input';
import { Box, Button, Step, Stepper, StepButton, TextField, TextFieldProps, Typography } from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import { freeTransfer, freezeStatus } from '../../services/nftServices';
import MirrorNode from '../../services/hedera-service/mirrorNode';
import './freeTransfer.scss';
import { useStore } from '../../store/store';
import { splitNftId } from '../../services/hedera-service/utils/htsUtils';
import useHederaWallets from '../../hooks/useHederaWallets';
import AutofillCard from '../../components/autofillCard/autofillCard';

interface FreeTransferProps {}

const FreeTransfer: FC<FreeTransferProps> = () => {
  const { nftId, tokenType } = useParams();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  let tokenId: any;
  if (tokenType === 'ft') tokenId = nftId;
  else {
    const splitRx = splitNftId(nftId as string);
    if (splitRx) tokenId = splitRx.tokenId;
  }
  const navigate = useNavigate();
  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const loggedUserId = user?.user_id;
  const { enqueueSnackbar } = useSnackbar();
  const [receiverWalletAddress, setReceiverWalletAddress] = useState('');
  const [volume, setVolume] = useState(0);
  const steps = ['Receiver details', 'Unfreeze the account', 'Transfer', 'Freeze the account'];
  const [activeStep, setActiveStep] = React.useState(tokenType === 'sbt' ? 0 : -1);
  const [completedSteps, setCompletedSteps] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [visitedSteps, setVisitedSteps] = React.useState<{
    [k: number]: boolean;
  }>({ 0: true });
  const [freezeStatusAccount, setFreezeStatusAccount] = useState('unfreeze');
  const [tokenNotAssociated, setTokenNotAssociated] = useState(false);

  // const {
  //   isLoading: tokenItemLoading,
  //   isError: tokenItemError,
  //   data: tokenItemsData,
  // } = useQuery({
  //   queryKey: ['tokenHomeItems'],
  //   queryFn: () => axios.get(`/v1/token/${tokenId}?loggedUserId=${loggedUserId}`).then((res) => res.data),
  // });

  const handleInputChange = (ev: any) => {
    const newValue = ev.target.value;
    setReceiverWalletAddress(newValue);
    MirrorNode.fetchAccountInfo(newValue)
      .then((accountInfo) => {
        if (accountInfo && accountInfo.balance) {
          const tokenIds = accountInfo.balance.tokens.map((token) => token.token_id);
          if (!tokenIds.includes(tokenId)) {
            setTokenNotAssociated(true);
          }
        }
      })
      .catch((error) => {
        // enqueueSnackbar(`Error Fetching Wallet Details`, { variant: 'error' });
      });
  };

  const handleNext = () => {
    if (activeStep === 0 && user) {
      if (!/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(receiverWalletAddress)) {
        enqueueSnackbar(`Please enter a valid wallet address to transfer`, { variant: 'error' });
        return;
      }
      if (tokenNotAssociated) {
        enqueueSnackbar(
          `Token is not associated with the provided wallet address. Please ask the wallet owner to associate this token first.`,
          { variant: 'error' }
        );
        return;
      }
    }
    const prevCompletedSteps = completedSteps;
    prevCompletedSteps[activeStep] = true;
    setCompletedSteps(prevCompletedSteps);
    const prevVisitedSteps = visitedSteps;
    prevVisitedSteps[activeStep + 1] = true;
    setVisitedSteps(prevVisitedSteps);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStep = (step: number) => () => {
    if (visitedSteps[step]) setActiveStep(step);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const transferMutate = useMutation(freeTransfer, {
    onSuccess: (data: any) => {
      if (data.status === 200) {
        // setReceiverWalletAddress('');
        if (tokenType === 'sbt') {
          enqueueSnackbar('Transferred, please continue', { variant: 'success' });
          handleNext();
        } else if (tokenType === 'nft') {
          enqueueSnackbar('Transferred succesfully', { variant: 'success' });
          navigate(`/nft/${nftId}/home`);
        } else {
          enqueueSnackbar('Transferred succesfully', { variant: 'success' });
          navigate(`/collection/${tokenId}/home`);
        }
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const freezeMutate = useMutation(freezeStatus, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        if (freezeStatusAccount === 'freeze') {
          navigate(`/nft/${nftId}/home`);
        } else {
          enqueueSnackbar('Account unfreezed. Please continue', { variant: 'success' });
        }
        handleNext();
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        enqueueSnackbar('Account modifield. Please continue', { variant: 'success' });
        handleNext();
      } else enqueueSnackbar(`${err}`, { variant: 'error' });
    },
  });

  const handleCreate = async (ev: any) => {
    ev.preventDefault();
    if (!/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(receiverWalletAddress) && tokenType === 'nft') {
      enqueueSnackbar(`Please enter a valid wallet address to transfer`, { variant: 'error' });
      return;
    }

    if (tokenType === 'ft') {
      if (!/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(receiverWalletAddress)) {
        enqueueSnackbar(`Please enter a valid wallet address to transfer`, { variant: 'error' });
        return;
      }
      if (volume === 0) {
        enqueueSnackbar(`Number of tokens to transfer should be greater than 0`, { variant: 'error' });
        return;
      }
    }

    const payload: any = {
      buyerWalletId: receiverWalletAddress,
      tokenId,
      identifier: tokenType === 'ft' ? tokenId : nftId,
      sellerId: user.user_id,
      walletAddress,
      walletType,
      tokenType,
      topic: hashConnectState?.topic,
      volume,
    };
    // handleNext();
    transferMutate.mutate(payload);
  };

  const handleFreeze = async (status: string) => {
    setFreezeStatusAccount(status);
    const payload: any = {
      accountId: receiverWalletAddress,
      tokenId,
      userId: user.user_id,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    // handleNext();
    freezeMutate.mutate({ payload, selectedAction: 'status' });
  };

  const clearData = () => {
    setReceiverWalletAddress('');
    setCompletedSteps({});
    setVisitedSteps({ 0: true });
    setActiveStep(0);
  };

  return (
    <div className="free-transfer-outer-container">
      <div className="leftview" />
      <section className="free-transfer-container">
        {(tokenType === 'nft' || tokenType === 'ft') && <span className="page-header">free transfer</span>}
        {tokenType === 'sbt' && (
          <div>
            <span className="page-header">transfer SBT</span>
            <p>
              You will be guided through a series of steps. First you have to unfreeze the receiver, then transfer and freeze
              again.
            </p>
          </div>
        )}
        <p className="form-info">All fields marked with * are required</p>
        {(tokenType === 'nft' || tokenType === 'ft') && (
          <div>
            <div className="free-transfer-fields-container">
              <Grid container>
                <Grid sm={6} xs={12}>
                  Wallet id of receiver:<sup>*</sup>
                </Grid>
                <Grid sm={6} xs={12}>
                  <TextField
                    id="outlined-basic"
                    data-cy="receiver-wallet-address"
                    onChange={handleInputChange}
                    name="receiverWalletAddress"
                    value={receiverWalletAddress}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {receiverWalletAddress && receiverWalletAddress.length > 8 && (
                <AutofillCard autoFillKey={receiverWalletAddress} filterFlag="user" />
              )}
              {tokenType === 'ft' && (
                <Grid container>
                  <Grid xs={12} sm={6}>
                    Volume to transfer:<sup>*</sup>
                  </Grid>
                  <Grid data-cy="CounterInput-container" xs={12} sm={6}>
                    <CounterInput min={0} onCountChange={(count: number) => setVolume(count)} />
                  </Grid>
                </Grid>
              )}
            </div>
            <div className="transfer-action-button">
              <Button disabled={transferMutate.isLoading} className="discard-button" onClick={() => navigate(-1)}>
                Back
              </Button>
              {transferMutate.isLoading ? (
                <LoadingButton loading variant="outlined">
                  Transfer
                </LoadingButton>
              ) : (
                <Button className="create-button" disabled={transferMutate.isLoading} onClick={handleCreate}>
                  Transfer
                </Button>
              )}
            </div>
          </div>
        )}
        {tokenType === 'sbt' && !isTabletOrMobile && (
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={label} completed={completedSteps[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
        )}
        {activeStep === 0 && (
          <div className="free-transfer-fields-container">
            <Grid container>
              <Grid sm={6} xs={12}>
                Wallet id of receiver:<sup>*</sup>
              </Grid>
              <Grid sm={6} xs={12}>
                <TextField
                  className="transfer-field"
                  id="outlined-basic"
                  data-cy="receiver-wallet-address"
                  onChange={handleInputChange}
                  name="receiverWalletAddress"
                  value={receiverWalletAddress}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {receiverWalletAddress && receiverWalletAddress.length > 8 && (
              <AutofillCard autoFillKey={receiverWalletAddress} filterFlag="user" />
            )}
          </div>
        )}
        {activeStep === 1 && (
          <div className="free-transfer-fields-container">
            <Grid className="content-outer" container>
              <div className="contentsec">
                <p className="text-part">Unfreeze the receiver account to continue</p>
                <p className="text-part light">
                  You have to unfreeze before you can transfer. Once you click the unfreeze button a notification will come
                  in your wallet
                </p>
              </div>
              <div className="transfer-action-button">
                {freezeMutate.isLoading ? (
                  <LoadingButton loading variant="outlined">
                    Unfreeze
                  </LoadingButton>
                ) : (
                  <Button
                    data-cy="sbt-transfer-unfreeze"
                    className="create-button"
                    disabled={freezeMutate.isLoading}
                    onClick={() => handleFreeze('unfreeze')}
                  >
                    Unfreeze
                  </Button>
                )}
              </div>
            </Grid>
          </div>
        )}
        {activeStep === 2 && (
          <div className="free-transfer-fields-container">
            <Grid className="content-outer" container>
              <div className="contentsec">
                <p className="text-part">Transfer the SBT to receiver</p>
                <p className="text-part light">
                  Here you are making the transfer. Once you click the transfer button a notification will come in your
                  wallet
                </p>
              </div>
              <div className="transfer-action-button">
                {transferMutate.isLoading ? (
                  <LoadingButton loading variant="outlined">
                    Transfer
                  </LoadingButton>
                ) : (
                  <Button
                    data-cy="sbt-transfer-transfer"
                    className="create-button"
                    disabled={transferMutate.isLoading}
                    onClick={handleCreate}
                  >
                    Transfer
                  </Button>
                )}
              </div>
            </Grid>
          </div>
        )}
        {activeStep === 3 && (
          <div className="free-transfer-fields-container">
            <Grid className="content-outer" container>
              <div className="contentsec">
                <p className="text-part">Freeze the receiver account to finish the process</p>
                <p className="text-part light">
                  You have to freeze to close off the process. Once you click the freeze button a notification will come in
                  your wallet
                </p>
              </div>
              <div className="transfer-action-button">
                {freezeMutate.isLoading ? (
                  <LoadingButton loading variant="outlined">
                    Freeze
                  </LoadingButton>
                ) : (
                  <Button
                    data-cy="sbt-transfer-freeze"
                    className="create-button"
                    disabled={freezeMutate.isLoading}
                    onClick={() => handleFreeze('freeze')}
                  >
                    Freeze
                  </Button>
                )}
              </div>
            </Grid>
          </div>
        )}
        {!isTabletOrMobile && activeStep > -1 && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIosIcon />
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === 0 && (
              <Button data-cy="next-button" className="next-btn" disabled={activeStep !== 0} onClick={handleNext}>
                Next
                <ArrowForwardIosIcon />
              </Button>
            )}
          </Box>
        )}

        {isTabletOrMobile && activeStep > -1 && (
          <MobileStepper
            className="stepper-mobile"
            variant="progress"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
              <Button
                data-cy="next-button"
                className="next-btn"
                size="small"
                onClick={handleNext}
                disabled={activeStep === 3}
              >
                Next
                <ArrowForwardIosIcon />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <ArrowBackIosIcon />
                Back
              </Button>
            }
          />
        )}
      </section>
      <div className="rightview" />
    </div>
  );
};

export default FreeTransfer;
