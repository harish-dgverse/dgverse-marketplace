import { Button, Grid, TextField } from '@mui/material';
import { FC, useState } from 'react';
import './collectionActions.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/store';
import { freezeStatus } from '../../services/nftServices';
import useHederaWallets from '../../hooks/useHederaWallets';
import AutofillCard from '../autofillCard/autofillCard';

interface FreezeAccountProps {
  selectedAction: string;
}

const FreezeAccount: FC<FreezeAccountProps> = ({ selectedAction }) => {
  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentToken = searchParams.get('parentTokenId') || '';

  const { enqueueSnackbar } = useSnackbar();
  const [accountId, setAccountId] = useState('');

  const handleAccountIdChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(ev.target.value);
  };

  const successOperation = () => {
    enqueueSnackbar(`Account ${selectedAction} successfully`, { variant: 'success' });
    navigate(`/collection/${parentToken}/home`);
  };

  const { mutate, isLoading } = useMutation(freezeStatus, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        successOperation();
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) enqueueSnackbar(`Account is already ${selectedAction}d`, { variant: 'info' });
      else enqueueSnackbar(`${err}`, { variant: 'error' });
    },
  });

  const handleFreezeStatus = async () => {
    if (!/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(accountId)) {
      enqueueSnackbar(`Please enter a valid wallet address to freeze`, { variant: 'error' });
      return;
    }

    const payload: any = {
      accountId,
      tokenId: parentToken,
      userId: user.user_id,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutate({ payload, selectedAction });
  };

  return (
    <div className="freeze-account-outer-container">
      <div className="leftview" />
      <section className="freeze-account-container">
        {selectedAction === 'freeze' && <span className="page-header">Freeze Account</span>}
        {selectedAction === 'unfreeze' && <span className="page-header">Un-Freeze Account</span>}
        <div className="freeze-account-fields-container">
          <Grid container>
            <Grid container alignContent="center" xs={12} sm={6}>
              <span>Wallet Id:</span>
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                id="account-id"
                placeholder="Please Enter Wallet ID"
                value={accountId}
                onChange={handleAccountIdChange}
              />
            </Grid>
          </Grid>
          {accountId && accountId.length > 8 && <AutofillCard autoFillKey={accountId} filterFlag="user" />}
        </div>
        <div className="freeze-account-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="freeze-button" disabled={isLoading} onClick={handleFreezeStatus}>
              {selectedAction === 'freeze' && <span>Freeze Account</span>}
              {selectedAction === 'unfreeze' && <span>Unfreeze Account</span>}
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
      {/* </div> */}
    </div>
  );
};

export default FreezeAccount;
