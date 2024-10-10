import { Button } from '@mui/material';
import { FC } from 'react';
import './collectionActions.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pauseStatus } from '../../services/nftServices';
import { useStore } from '../../store/store';
import useHederaWallets from '../../hooks/useHederaWallets';

interface PauseCollectionProps {
  selectedAction: string;
}

const PauseCollection: FC<PauseCollectionProps> = ({ selectedAction }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentToken = searchParams.get('parentTokenId') || '';
  console.log(parentToken);
  const [state] = useStore();
  const { walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const { enqueueSnackbar } = useSnackbar();
  const successOperation = () => {
    enqueueSnackbar(`Account ${selectedAction} successfully`, { variant: 'success' });
    navigate(`/collection/${parentToken}/home`);
  };

  const { mutate, isLoading } = useMutation(pauseStatus, {
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

  const handlePauseStatus = async () => {
    const payload: any = {
      tokenId: parentToken,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutate({ payload, selectedAction });
  };

  return (
    <div className="pause-token-outer-container">
      <div className="leftview" />
      <section className="pause-token-container">
        {selectedAction === 'pause' && <span className="page-header">Pause Token</span>}
        {selectedAction === 'unpause' && <span className="page-header">Unpause Token</span>}
        <div className="pause-token-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="pause-button" disabled={isLoading} onClick={handlePauseStatus}>
              {selectedAction === 'pause' && <span>Pause Token</span>}
              {selectedAction === 'unpause' && <span>Unpause Token</span>}
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default PauseCollection;
