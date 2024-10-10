/* eslint-disable */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Button, MenuItem, Select, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FC, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import CounterInput from 'react-counter-input';
import './mintNFT.scss';
import axios from '../../api/axios';
import DynamicKeyPairForm from '../../components/dynamicKeyPairForm/dynamicKeyPairForm';
import UploadImage from '../../components/fileUpload/fileUpload';
import PreviewNFT from '../../components/previewNFT/previewNFT';
import { mintNft } from '../../services/nftServices';
import { useStore } from '../../store/store';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import useHederaWallets from '../../hooks/useHederaWallets';
import RedirectTo from '../../components/redirectTo/redirectTo';
import FieldInfo from '../../components/fieldInfo/fieldInfo';

interface MintNFTProps {}

interface NftInitialStateType {
  tokenId: string;
  userId?: number;
  name: string;
  tags: any;
  description: any;
  images: any;
  socialMedia: any;
  additionalDetails: any;
  nftId?: string;
  serialNumber?: string;
  metadata?: string;
  walletAddress: string;
  walletType: string;
  topic?: any;
  volume?: any;
  tokenType: any;
}

const MintNFT: FC<MintNFTProps> = () => {
  const [state] = useStore();
  const { tokenType } = useParams();
  // const tokenType = 'nft';
  // const state=  { user: {user_id: 1}, walletAddress: '0.0.1', walletType: 'hashpack'};
  const { user, walletAddress, walletType } = state;
  const { hashConnectState } = useHederaWallets();
  // const hashConnectState = { topic: '1'};
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentToken = searchParams.get('parentTokenId') || '';
  // const parentToken = '0.0.11';
  const { enqueueSnackbar } = useSnackbar();
  const nftInitialState: NftInitialStateType = {
    name: '',
    images: {},
    socialMedia: [],
    description: '',
    tags: '',
    additionalDetails: [],
    tokenId: parentToken,
    walletType: '',
    walletAddress: '',
    tokenType,
    volume: 0,
  };

  const [navigateToCollectionCreation, setNavigateToCollectionCreation] = useState(false);
  const [nftState, setNftState] = useState(nftInitialState);
  const [displayPicAfterCrop, setDisplayPicAfterCrop] = useState('');
  const [coverPicAfterCrop, setCoverPicAfterCrop] = useState('');
  const [nftArtifact, setNftArtifact] = useState('');
  const [displayPicURLAfterCrop, setDisplayPicURLAfterCrop] = useState<any>('');
  const [coverPicURLAfterCrop, setCoverPicURLAfterCrop] = useState<any>('');
  const [nftURLAfterCrop, setnftURLAfterCrop] = useState<any>('');
  const [socialMediaInfo, setSocialMediaInfo] = useState<any>([]);
  const [additionalInfo, setAdditionalInfo] = useState<any>([]);
  const socialMediaLinksInitialState = [
    {
      text: 'Instagram',
      value: 'insta',
      disabled: false,
    },
    {
      text: 'Twitter',
      value: 'twitter',
      disabled: false,
    },
    {
      text: 'Facebook',
      value: 'fb',
      disabled: false,
    },
    {
      text: 'Discord',
      value: 'discord',
      disabled: false,
    },
    {
      text: 'YouTube',
      value: 'yt',
      disabled: false,
    },
  ];
  const [socialMediaLinks, setSocialMediaLinks] = useState(socialMediaLinksInitialState);

  const socialMediaFormOptions = {
    firstFieldDropdown: true,
    firstFieldDropdownInitialState: socialMediaLinksInitialState,
    firstFieldDropdownState: socialMediaLinks,
    firstFieldDropdownSetState: setSocialMediaLinks,
  };
  const additionalDetailsForm = {
    firstFieldDropdown: false,
  };

  const successOperation = (nftId: string) => {
    enqueueSnackbar('NFT Minted', { variant: 'success' });
    let navigateLink = `/nft/${nftId}/home`;
    if (nftState.tokenType === 'ft') {
      navigateLink = `/collection/${nftState.tokenId}/home`;
    }
    setNftState(nftInitialState);
    setDisplayPicAfterCrop('');
    setCoverPicAfterCrop('');
    setDisplayPicURLAfterCrop('');
    setCoverPicURLAfterCrop('');
    setAdditionalInfo([]);
    setSocialMediaInfo([]);
    navigate(navigateLink);
  };

  const {
    isLoading: prereqDataLoading,
    isError: prereqDataError,
    data: prereqData,
  } = useQuery({
    queryKey: ['mintNFTReqs'],
    refetchOnWindowFocus: false,
    enabled: !!user,
    queryFn: () => {
      return axios.get(`/v1/user/${user?.user_id}/assets?collectionsOwned=true`).then((res) => res.data);
    },
  });

  const handleInputChange = (ev: any) => {
    if (ev.target.name === 'tokenId') {
      const [itemSelected] = prereqData.collectionsOwned.filter((x: any) => x.token_id === ev.target.value);
      setNftState({
        ...nftState,
        tokenType: itemSelected.token_type,
        tokenId: itemSelected.token_id,
      });
    } else if (ev.target.name === 'defaultFreezeStatus') {
      setNftState({
        ...nftState,
        [ev.target.name]: ev.target.checked,
      });
    } else {
      setNftState({
        ...nftState,
        [ev.target.name]: ev.target.value,
      });
    }
  };

  useEffect(() => {
    if (prereqData?.collectionsOwned.length === 0) {
      setNavigateToCollectionCreation(true);
      setTimeout(() => {
        navigate(`/collection/create`);
      }, 5000);
    }
  }, [prereqData]);

  const clearData = () => {
    setNftState(nftInitialState);
    setDisplayPicAfterCrop('');
    setCoverPicAfterCrop('');
    setDisplayPicURLAfterCrop('');
    setCoverPicURLAfterCrop('');
    setAdditionalInfo([]);
    setSocialMediaInfo([]);
  };

  const { mutate, isLoading } = useMutation(mintNft, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        successOperation(data.nftId);
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleCreate = async (ev: any) => {
    ev.preventDefault();
    const fieldValidations = [
      {
        fieldName: 'name',
        label: 'NFT Name',
        validations: [
          {
            type: 'required',
          },
        ],
      },
      {
        fieldName: 'description',
        label: 'Description',
        validations: [
          {
            type: 'required',
          },
        ],
      },
      {
        fieldName: 'displayPic',
        label: 'Display Picture',
        validations: [
          {
            type: 'image',
            imageState: 'displayPicAfterCrop',
          },
        ],
      },
      {
        fieldName: 'nftArtifact',
        label: 'NFT artifact',
        validations: [
          {
            type: 'image',
            imageState: 'nftArtifact',
          },
        ],
      },
    ];
    const errors: { fieldName: string; validation: string }[] = [];
    fieldValidations.forEach(({ fieldName, label, validations }: { fieldName: string; label: string; validations: any }) => {
      if (fieldName === 'displayPic' && !displayPicAfterCrop) {
        errors.push({ fieldName: label, validation: 'required' });
      }
      if (fieldName === 'nftArtifact' && !nftArtifact) {
        errors.push({ fieldName: label, validation: 'required' });
      }
      validations.forEach((validationCondition: any) => {
        if (validationCondition.type === 'required' && !nftState[fieldName as keyof NftInitialStateType]) {
          errors.push({ fieldName: label, validation: validationCondition.type });
        } else if (validationCondition.type === 'number' && nftState[fieldName as keyof NftInitialStateType]) {
          const fieldValue = nftState[fieldName as keyof NftInitialStateType];
          if (!/^\d+$/.test(fieldValue)) errors.push({ fieldName: label, validation: validationCondition.type });
        }
      });
    });
    if (errors.length > 0 && nftState.tokenType !== 'ft') {
      const formattedError: { required: string[]; number: string[]; format_regex: string[] } = {
        required: [],
        number: [],
        format_regex: [],
      };
      errors.forEach(({ fieldName, validation }: { fieldName: string; validation: string }) => {
        switch (validation) {
          case 'required':
            formattedError.required.push(fieldName);
            break;
          case 'number':
            formattedError.number.push(fieldName);
            break;
          case 'format_regex':
            formattedError.format_regex.push(fieldName);
            break;
          default:
            break;
        }
      });
      if (formattedError.required.length > 0)
        enqueueSnackbar(`${formattedError.required.join(', ')} are required fields`, { variant: 'error' });
      if (formattedError.number.length > 0)
        enqueueSnackbar(`${formattedError.number.join(', ')} should have number values`, { variant: 'error' });
      if (formattedError.format_regex.length > 0)
        enqueueSnackbar(`${formattedError.required.join(', ')} is out of format`, { variant: 'error' });
      return;
    }
    if (nftState.tokenType === 'ft') {
      if (nftState.volume === 0) {
        enqueueSnackbar('Volume to mint should be greater than 0', { variant: 'error' });
        return;
      }
    }
    const payload = { ...nftState };
    if (additionalInfo)
      payload.additionalDetails = additionalInfo.filter(
        (item: { attribute: any; value: any }) => item.attribute && item.value
      );
    if (socialMediaInfo)
      payload.socialMedia = socialMediaInfo
        .filter((item: { attribute: any; value: any }) => item.attribute && item.value)
        .map((item: { attribute: any; value: any }) => {
          return { media: item.attribute, url: item.value };
        });

    const metadata = {
      name: nftState.name,
      description: nftState.description,
      type: 'Photography',
      properties: {
        additionalDetails: payload.additionalDetails,
      },
    };
    payload.userId = user?.user_id;
    payload.walletAddress = walletAddress;
    payload.walletType = walletType;
    payload.topic = hashConnectState?.topic;
    mutate({ payload, displayPicAfterCrop, coverPicAfterCrop, nftArtifact, metadata });
  };

  if (prereqDataError) return <ErrorComponent />;
  if (prereqDataLoading) return <LoadingComponent />;
  return (
    <div className="mint-nft-outer-container">
      <div className="leftview" />
      {navigateToCollectionCreation && (
        <RedirectTo
          link="/collection/create"
          header="No collection created"
          message="Please create a collection first to start minting NFTs. You will be redirected to create collection page in 5 seconds"
        />
      )}
      {!navigateToCollectionCreation && (
        <section className="mint-nft-container">
          <span className="page-header">mint {tokenType}</span>
          <p className="form-info">All fields marked with * are required</p>
          {!parentToken && !nftState.tokenId && <p className="form-info">Select the collection first to proceed</p>}
          <div className="mint-nft-fields-container">
            {!parentToken && (
              <Grid container>
                <Grid xs={12} sm={6}>
                  Collection:<sup>*</sup>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Select
                    className="additional-fields"
                    id="collection-list-user"
                    data-cy="nft-mint-select-collection"
                    name="tokenId"
                    onChange={handleInputChange}
                    value={nftState.tokenId}
                  >
                    {prereqData?.collectionsOwned.map((item: any) => (
                      <MenuItem value={item.token_id} key={item.token_id}>
                        <span className="dropdown-menu">{`${item.name} (${
                          item.token_id
                        } - ${item.token_type?.toUpperCase()})`}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            )}
            {nftState.tokenId &&
              (nftState.tokenType === 'ft' ? (
                <Grid container>
                  <Grid xs={12} sm={6}>
                    Volume to mount:<sup>*</sup>
                  </Grid>
                  <Grid data-cy="CounterInput-container" xs={12} sm={6}>
                    <CounterInput
                      data-cy="CounterInput-ft"
                      min={0}
                      onCountChange={(count: number) =>
                        setNftState({
                          ...nftState,
                          volume: count,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Name:<sup>*</sup>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        id="outlined-basic"
                        data-cy="nft-mint-nft-name"
                        onChange={handleInputChange}
                        name="name"
                        value={nftState.name}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  {/* <Grid container>
                    <Grid xs={12} sm={6}>
                      Upload NFT:<sup>*</sup>
                      <FieldInfo info="The image you upload will be uploaded as Non fungible token. Also a prompt will come for cropping for profile picture." />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <PreviewNFT nftArtifact={nftArtifact} setNftArtifact={setNftArtifact} />
                    </Grid>
                  </Grid> */}
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Upload NFT:<sup>*</sup>
                      <FieldInfo info="The image you upload will be uploaded as Non fungible token. Also a prompt will come for cropping for profile picture." />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <UploadImage
                        setImgAfterCrop={setDisplayPicAfterCrop}
                        previewResult={displayPicURLAfterCrop}
                        setPreviewResult={setDisplayPicURLAfterCrop}
                        aspectRatio={1 / 1}
                        previewNFT
                        nftArtifact={nftArtifact}
                        setNftArtifact={setNftArtifact}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Upload cover Picture:
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <UploadImage
                        setImgAfterCrop={setCoverPicAfterCrop}
                        previewResult={coverPicURLAfterCrop}
                        setPreviewResult={setCoverPicURLAfterCrop}
                        aspectRatio={4 / 1}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Social Media links:
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <DynamicKeyPairForm
                        formValues={socialMediaInfo}
                        setFormValues={setSocialMediaInfo}
                        maxFields={5}
                        options={socialMediaFormOptions}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Description:<sup>*</sup>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        id="outlined-textarea"
                        className="description-collection"
                        name="description"
                        data-cy="description-mint"
                        onChange={handleInputChange}
                        value={nftState.description}
                        multiline
                        maxRows={4}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Tags:
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        id="outlined-textarea"
                        className="tags-collection"
                        data-cy="tags-mint"
                        name="tags"
                        onChange={handleInputChange}
                        value={nftState.tags}
                        multiline
                        maxRows={4}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Additional details:
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <DynamicKeyPairForm
                        formValues={additionalInfo}
                        setFormValues={setAdditionalInfo}
                        options={additionalDetailsForm}
                      />
                    </Grid>
                  </Grid>
                </>
              ))}
          </div>
          <div className="mint-nft-action-button">
            <Button disabled={isLoading} className="discard-button" onClick={clearData}>
              Clear
            </Button>
            {isLoading ? (
              <LoadingButton loading variant="outlined">
                Submit
              </LoadingButton>
            ) : (
              <Button className="create-button" disabled={isLoading} onClick={handleCreate}>
                Mint
              </Button>
            )}
          </div>
        </section>
      )}
      <div className="rightview" />
    </div>
  );
};

export default MintNFT;
