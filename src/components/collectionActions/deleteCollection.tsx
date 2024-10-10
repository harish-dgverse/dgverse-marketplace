import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import './collectionActions.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/store';
import { deleteToken } from '../../services/collectionServices';
import useHederaWallets from '../../hooks/useHederaWallets';

interface DeleteCollectionProps {}

const DeleteCollection: FC<DeleteCollectionProps> = () => {
  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentToken = searchParams.get('parentTokenId') || '';

  const { enqueueSnackbar } = useSnackbar();

  const successOperation = () => {
    enqueueSnackbar('TOKEN deleted successfully', { variant: 'success' });
    navigate(`/user/${user?.user_id}/profile`);
  };

  const { mutate, isLoading } = useMutation(deleteToken, {
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

  const handleDeleteToken = async (ev: any) => {
    ev.preventDefault();

    const payload: any = {
      tokenId: parentToken,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutate(payload);
  };

  return (
    <div className="delete-token-outer-container">
      <div className="leftview" />
      <section className="delete-token-container">
        <span className="page-header">DELETE TOKEN</span>
        <div className="delete-token-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="delete-token-button" disabled={isLoading} onClick={handleDeleteToken}>
              Delete Token
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default DeleteCollection;
