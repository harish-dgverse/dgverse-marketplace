import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useMutation } from '@tanstack/react-query';
import { FC, useState, useEffect } from 'react';
import CounterInput from 'react-counter-input';
import './collectionActions.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MultiSelect } from 'react-multi-select-component';
import axios from '../../api/axios';
import { useStore } from '../../store/store';
import { burnNft } from '../../services/nftServices';
import useHederaWallets from '../../hooks/useHederaWallets';
import MirrorNode from '../../services/hedera-service/mirrorNode';

interface BurnNftProps {
  tokenType: any;
}

const BurnNft: FC<BurnNftProps> = ({ tokenType }) => {
  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentToken = searchParams.get('parentTokenId') || '';
  const [options, setNftOptions] = useState<{ label: string; value: string; serial: number }[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const nfts = await MirrorNode.fetchAllNFTs(walletAddress, parentToken);

        const nftNameIds = nfts.map((nft: any) => `${nft.token_id}.${nft.serial_number}`);

        const response = await axios.get(`/v1/nft/nftNames/${nftNameIds}`);
        const optionsNew = nfts.map((nft: any) => {
          const concatenatedKey = `${nft.token_id}.${nft.serial_number}`;
          const nftName = response.data[concatenatedKey] || 'N/A';
          return {
            label: `Serial: ${nft.serial_number}, NFT Name: ${nftName}`,
            value: `${nft.token_id}.${nft.serial_number}`,
            serial: nft.serial_number,
          };
        });
        setNftOptions(optionsNew);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, [walletAddress, parentToken]);

  const { enqueueSnackbar } = useSnackbar();
  const [nftIds, setNftIds] = useState<any>([]);
  const [volume, setVolume] = useState<any>(1);

  const successOperation = () => {
    enqueueSnackbar('NFT burned successfully', { variant: 'success' });
    setNftIds([]);
    navigate(`/collection/${parentToken}/home`);
  };

  const { mutate, isLoading } = useMutation(burnNft, {
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

  const handleBurn = async (ev: any) => {
    ev.preventDefault();
    if (tokenType === 'nft' && nftIds.length === 0) {
      enqueueSnackbar(`Please select NFT to burn`, { variant: 'error' });
      return;
    }
    if (volume === 0 && tokenType === 'ft') {
      enqueueSnackbar(`Please enter volume to burn`, { variant: 'error' });
      return;
    }
    const nftIdArray = nftIds.map((item: any) => item?.value);
    const serials = nftIds.map((item: any) => item?.serial);
    const payload: any = {
      serials,
      tokenType,
      userId: user.user_id,
      nftIds: nftIdArray,
      volume,
      tokenId: parentToken,
      walletAddress,
      walletType,
      topic: hashConnectState?.topic,
    };
    mutate(payload);
  };

  return (
    <div className="burn-nft-outer-container">
      <div className="leftview" />
      <section className="burn-nft-container">
        <span className="page-header">Burn {tokenType.toUpperCase()}</span>
        {tokenType === 'nft' && (
          <p className="form-info">Please enter NFT ids to be burned off. Seperate by comma if multiple NFTs</p>
        )}
        <div className="burn-nft-fields-container">
          {tokenType === 'nft' && (
            <Grid container>
              <Grid xs={12} sm={6}>
                NFT Id:
              </Grid>
              <Grid xs={12} sm={6}>
                <MultiSelect
                  options={options}
                  hasSelectAll={false}
                  value={nftIds}
                  onChange={setNftIds}
                  labelledBy="Select"
                  overrideStrings={{ allItemsAreSelected: 'All NFTs are selected' }}
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
        <div className="burn-nft-action-button">
          <Button disabled={isLoading} className="discard-button" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="burn-button" disabled={isLoading} onClick={handleBurn}>
              Burn Token
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default BurnNft;
