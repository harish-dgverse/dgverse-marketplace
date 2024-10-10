import { Button, Grid, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import CounterInput from 'react-counter-input';
import './collectionActions.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { wipeNft } from '../../services/nftServices';
import useHederaWallets from '../../hooks/useHederaWallets';
import { useStore } from '../../store/store';
import AutofillCard from '../autofillCard/autofillCard';

interface WipeNftProps {
  tokenType: any;
}

const WipeNft: FC<WipeNftProps> = ({ tokenType }) => {
  const [state] = useStore();
  const navigate = useNavigate();
  const { walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const [searchParams] = useSearchParams();
  const parentToken = searchParams.get('parentTokenId') || '';

  const { enqueueSnackbar } = useSnackbar();
  const [accountId, setAccountId] = useState('');
  const [nftIds, setNftIds] = useState('');
  const [volume, setVolume] = useState<any>(1);

  const handleAccountIdChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(ev.target.value);
  };

  const handleInputChange = (ev: any) => {
    setNftIds(ev.target.value);
  };

  const successOperation = () => {
    enqueueSnackbar('NFT burned successfully', { variant: 'success' });
    setNftIds('');
    navigate(`/collection/${parentToken}/home`);
  };

  const { mutate, isLoading } = useMutation(wipeNft, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        successOperation();
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occurred: ${err}`, { variant: 'error' });
    },
  });

  const handleWipe = async (ev: any) => {
    ev.preventDefault();
    if (!/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(accountId)) {
      enqueueSnackbar(`Please enter a valid wallet address to wipe off`, { variant: 'error' });
      return;
    }
    if (!/^(([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+),?(\s)*)+$/.test(nftIds) && tokenType === 'nft') {
      enqueueSnackbar(`Please enter valid NFT ids to wipe`, { variant: 'error' });
      return;
    }
    if (volume === 0 && tokenType === 'ft') {
      enqueueSnackbar(`Please enter volume to burn`, { variant: 'error' });
      return;
    }
    const nftIdArray = nftIds.split(',').map((id) => id.trim());
    const serials = nftIdArray.map((id) => id.split('.')[3]);
    const payloadData: any = {
      wipeAccountId: accountId,
      serials,
      volume,
      tokenId: parentToken,
      nftIds: nftIdArray,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutate(payloadData);
  };

  return (
    <div className="wipe-nft-outer-container">
      <div className="leftview" />
      <section className="wipe-nft-container">
        <span className="page-header">WIPE {tokenType.toUpperCase()}</span>
        <p className="form-info">All fields marked with * are required</p>
        {tokenType === 'nft' && (
          <p className="form-info">Please enter NFT ids to be burned off. Seperate by comma if multiple NFTs</p>
        )}
        <div className="wipe-nft-fields-container">
          <Grid container>
            <Grid item xs={12} sm={6}>
              Wallet id:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                id="outlined-basic"
                data-cy="wallet-id"
                className="wallet-id"
                placeholder="Wallet id from tokens to wiped off"
                value={accountId}
                onChange={handleAccountIdChange}
              />
            </Grid>
          </Grid>
          {accountId && accountId.length > 8 && <AutofillCard autoFillKey={accountId} filterFlag="user" />}
          {tokenType === 'nft' && (
            <Grid container>
              <Grid xs={12} sm={6}>
                NFT Ids:<sup>*</sup>
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  id="outlined-basic"
                  data-cy="nft-ids-wipe"
                  onChange={handleInputChange}
                  value={nftIds}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}
          {tokenType === 'ft' && (
            <Grid container>
              <Grid xs={12} sm={6}>
                Volume:
              </Grid>
              <Grid data-cy="CounterInput-container" xs={12} sm={6}>
                <CounterInput min={1} onCountChange={(count: number) => setVolume(count)} />
              </Grid>
            </Grid>
          )}
        </div>
        <div className="wipe-nft-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="wipe-button" disabled={isLoading} onClick={handleWipe}>
              Wipe NFT
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default WipeNft;
