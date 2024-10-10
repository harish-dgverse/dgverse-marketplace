import { Button, Grid, TextField } from '@mui/material';
import { FC, useState } from 'react';
import './collectionActions.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { associateToken } from '../../services/collectionServices';
import useHederaWallets from '../../hooks/useHederaWallets';
import AutofillCard from '../autofillCard/autofillCard';

interface TokenAssociateProps {
  selectedAction: string;
}

const TokenAssociate: FC<TokenAssociateProps> = ({ selectedAction }) => {
  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [tokenId, setTokenId] = useState('');

  const handleTokenIdChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTokenId(ev.target.value);
  };

  const successOperation = () => {
    enqueueSnackbar(`Account ${selectedAction} successfully`, { variant: 'success' });
    navigate(`/user/${user?.user_id}/profile`);
  };

  const { mutate, isLoading } = useMutation(associateToken, {
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

  const handleTokenAssociate = async () => {
    if (!/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(tokenId)) {
      enqueueSnackbar(`Please enter a valid wallet address to freeze`, { variant: 'error' });
      return;
    }

    const payload: any = {
      tokenId,
      userId: user.user_id,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutate({ payload, selectedAction });
  };

  return (
    <div className="token-associate-outer-container">
      <div className="leftview" />
      <section className="token-associate-container">
        {selectedAction === 'associate' && <span className="page-header">Associate Collection</span>}
        {selectedAction === 'dissociate' && <span className="page-header">Dissociate Collection</span>}
        <div className="token-associate-fields-container">
          <Grid container>
            <Grid item xs={12} sm={6}>
              Collection ID:
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField id="token-id" value={tokenId} onChange={handleTokenIdChange} />
              {tokenId && tokenId.length > 8 && <AutofillCard autoFillKey={tokenId} filterFlag="token" />}
            </Grid>
          </Grid>
        </div>
        <div className="token-associate-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="token-associate-button" disabled={isLoading} onClick={handleTokenAssociate}>
              {selectedAction === 'associate' && <span>Associate</span>}
              {selectedAction === 'dissociate' && <span>Dissociate</span>}
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default TokenAssociate;
