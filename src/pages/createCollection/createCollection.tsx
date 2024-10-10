/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  StepButton,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Unstable_Grid2';
import React, { FC, useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import { TokenId } from '@hashgraph/sdk';

import MobileStepper from '@mui/material/MobileStepper';
import { useMediaQuery } from 'react-responsive';

import Avatar from '@mui/joy/Avatar';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import './createCollection.scss';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Switch, { SwitchProps } from '@mui/material/Switch';
import DynamicKeyPairForm from '../../components/dynamicKeyPairForm/dynamicKeyPairForm';
import UploadImage from '../../components/fileUpload/fileUpload';
import { createCollection } from '../../services/collectionServices';
import { useStore } from '../../store/store';
import FieldInfo from '../../components/fieldInfo/fieldInfo';
import CollectionFeatures from '../../components/collectionFeatures/collectionFeatures';
import IOSSwitch from '../../components/iosSwitch/iosSwitch';
import ft from '../../assets/ft-website.jpg';
import nft from '../../assets/nft-website.jpg';
import sbt from '../../assets/sbt-website.jpg';
import kycImage from '../../assets/collection-features/kyc-required.jpg';
import immutable from '../../assets/collection-features/immutable.jpg';
import pause from '../../assets/collection-features/pause.jpg';
import freeze from '../../assets/collection-features/freeze.jpg';
import wipe from '../../assets/collection-features/wipe.jpg';
import royalty from '../../assets/collection-features/royalty.png';
import useHederaWallets from '../../hooks/useHederaWallets';
import { AdditionalDetails } from '../../utils/entity/AdditionalDetails';
import { CollectionInitialStateType } from '../../utils/entity/CollectionInitialState';
import { basicPlanSteps, silverPlusPlanSteps, sbtSteps, fieldValidations } from '../../utils/const/CollectionConstants';
import { formatValidationErrors } from '../../utils/helpers/validateFormData';

const CreateCollection = () => {
  const errors: { fieldName: string; validation: string }[] = [];
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const [steps, setSteps] = React.useState(basicPlanSteps);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [visitedSteps, setVisitedSteps] = React.useState<{
    [k: number]: boolean;
  }>({ 0: true });
  const { hashConnectState } = useHederaWallets();
  const [message, setMessage] = useState('Click next to proceed');
  const tokenTypeDesc = [
    {
      type: 'Non fungible token (NFT)',
      image: 'nft',
      description:
        'NFTs can really be anything digital (such as drawings, music, your brain downloaded and turned into an AI); it’s unique and can’t be replaced with something else.',
    },
    {
      type: 'Fungible token (FT)',
      image: 'ft',
      description:
        'Fungible tokens or assets are divisible and non-unique. The most common examples of fungible assets refer to currency and money. For example $5 bill can be exchanged with another.',
    },
    {
      type: 'Soul bound token (SBT)',
      image: 'sbt',
      description:
        "A soulbound token is a publicly verifiable and non-transferable nonfungible token (NFT) that represents an individual's credentials, affiliations and commitments.",
    },
  ];

  const [state] = useStore();
  const { user, walletAddress, walletType } = state;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const collectionInitialState: CollectionInitialStateType = {
    name: '',
    images: {},
    royaltyStatus: false,
    royaltyPercent: '',
    defaultFreezeStatus: false,
    socialMedia: [],
    description: '',
    tags: '',
    maxSupply: '',
    initialSupply: '',
    additionalDetails: [],
    kycKey: false,
    freezeKey: false,
    wipeKey: false,
    customFeeKey: false,
    pauseKey: false,
    immutable: false,
    tokenType: '',
    symbol: '',
    tokenCategory: '',
    contactName: '',
    contactEmail: '',
    saleVolume: '',
    salePrice: '',
    saleExpiresAt: null,
    sendToMarketplace: false,
    walletType: '',
    walletAddress: '',
    decimal: 0,
  };
  const [collectionState, setCollectionState] = useState(collectionInitialState);
  const [socialMediaInfo, setSocialMediaInfo] = useState<any>([]);
  const [additionalInfo, setAdditionalInfo] = useState<any>([]);
  const [displayPicAfterCrop, setDisplayPicAfterCrop] = useState('');
  const [coverPicAfterCrop, setCoverPicAfterCrop] = useState('');
  const [displayPicURLAfterCrop, setDisplayPicURLAfterCrop] = useState<any>('');
  const [coverPicURLAfterCrop, setCoverPicURLAfterCrop] = useState<any>('');

  // const queryClient = new QueryClient();
  useEffect(() => {
    console.log('state changed', collectionState);
  }, [collectionState]);

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

  useEffect(() => {
    if (!collectionState.tokenType) setMessage('Select a type to proceed');
    else if (collectionState.tokenType !== 'Non fungible token (NFT)') {
      if (user?.subscriptionType === 'basic' || user?.subscriptionType === 'silver') {
        setMessage(
          'You need a subscription level of Gold/Diamond to access SBT/FT. Click here to upgrade your subscription'
        );
      } else if (user?.verified !== 2) {
        setMessage('You have to verify before creating a SBT or FT');
      } else setMessage('Click Next to proceed');
    } else setMessage('Click Next to proceed');
  }, [user, collectionState.tokenType]);

  const handleInputChange = (ev: any) => {
    setCollectionState({
      ...collectionState,
      [ev.target.name]: ev.target.value === 'on' ? ev.target.checked : ev.target.value,
    });
  };

  const handleDateChange = (date: React.SetStateAction<null>) => {
    setCollectionState({
      ...collectionState,
      saleExpiresAt: date,
    });
  };

  const successOperation = (tokenId: string) => {
    enqueueSnackbar('Created the collection', { variant: 'success' });
    setCollectionState(collectionInitialState);
    setDisplayPicAfterCrop('');
    setCoverPicAfterCrop('');
    setDisplayPicURLAfterCrop('');
    setCoverPicURLAfterCrop('');
    setAdditionalInfo([]);
    setSocialMediaInfo([]);
    navigate(`/collection/${tokenId}/home`);
  };

  const clearData = () => {
    setCollectionState(collectionInitialState);
    setDisplayPicAfterCrop('');
    setCoverPicAfterCrop('');
    setDisplayPicURLAfterCrop('');
    setCoverPicURLAfterCrop('');
    setAdditionalInfo([]);
    setSocialMediaInfo([]);
    setActiveStep(0);
    setCompletedSteps({});
    setVisitedSteps({ 0: true });
  };

  const { mutate, isLoading } = useMutation(createCollection, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        successOperation(data.tokenId);
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleNext = () => {
    if (activeStep === 0 && user) {
      if (collectionState.tokenType === 'Non fungible token (NFT)') {
        if (user.subscriptionType === 'basic') {
          setSteps(basicPlanSteps);
        } else setSteps(silverPlusPlanSteps);
      } else if (collectionState.tokenType === 'Fungible token (FT)') {
        if (user.subscriptionType === 'basic') {
          setSteps([...basicPlanSteps, 'Send to marketplace']);
        } else setSteps([...silverPlusPlanSteps, 'Send to marketplace']);
      } else if (collectionState.tokenType === 'Soul bound token (SBT)') {
        setSteps(sbtSteps);
      }
    }
    if (activeStep === 1) {
      /* Validation start */
      const exemptedForNonFT = ['symbol'];
      const exemptedForSBT = ['tokenCategory'];
      fieldValidations.forEach(
        ({ fieldName, label, validations }: { fieldName: string; label: string; validations: any }) => {
          if (collectionState.tokenType !== 'Fungible token (FT)' && exemptedForNonFT.indexOf(fieldName) !== -1) {
            return;
          }
          if (collectionState.tokenType === 'Soul bound token (SBT)' && exemptedForSBT.indexOf(fieldName) !== -1) {
            return;
          }
          if (fieldName === 'displayPic' && !displayPicAfterCrop) {
            errors.push({ fieldName: label, validation: 'required' });
          }
          validations.forEach((validationCondition: any) => {
            if (validationCondition.type === 'required' && !collectionState[fieldName as keyof CollectionInitialStateType]) {
              errors.push({ fieldName: label, validation: validationCondition.type });
            } else if (
              validationCondition.type === 'number' &&
              collectionState[fieldName as keyof CollectionInitialStateType]
            ) {
              const fieldValue = collectionState[fieldName as keyof CollectionInitialStateType];
              if (!/^\d+$/.test(fieldValue)) errors.push({ fieldName: label, validation: validationCondition.type });
            }
          });
        }
      );
      if (errors.length > 0) {
        const formattedError = formatValidationErrors(errors);
        if (formattedError.required.length > 0)
          enqueueSnackbar(`${formattedError.required.join(', ')} are required fields`, { variant: 'error' });
        if (formattedError.number.length > 0)
          enqueueSnackbar(`${formattedError.number.join(', ')} should have number values`, { variant: 'error' });
        if (formattedError.format_regex.length > 0)
          enqueueSnackbar(`${formattedError.required.join(', ')} is out of format`, { variant: 'error' });
        return;
      }
      /* Validation end */
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

  const handleCreate = async (ev: any, draft: boolean) => {
    ev.preventDefault();
    /* Validation start */
    const exemptedForNonFT = ['symbol'];
    const exemptedForSBT = ['tokenCategory'];
    const errorMessageAdd = ' Please click on step 2 to edit.';
    if (collectionState.tokenType === 'Fungible token (FT)') {
      let errorFoundForFt = false;
      if (!collectionState.salePrice) {
        errorFoundForFt = true;
        enqueueSnackbar(`Sales price is required.`, {
          variant: 'error',
        });
      }
      if (collectionState.salePrice && !/^\d+$/.test(collectionState.salePrice)) {
        errorFoundForFt = true;
        enqueueSnackbar(`Sales price should have number values.`, {
          variant: 'error',
        });
      }
      if (!collectionState.initialSupply) {
        errorFoundForFt = true;
        enqueueSnackbar(`Initial supply is required.`, {
          variant: 'error',
        });
      }
      if (collectionState.initialSupply && !/^\d+$/.test(collectionState.initialSupply)) {
        errorFoundForFt = true;
        enqueueSnackbar(`Initial supply should have number values.`, {
          variant: 'error',
        });
      }
      if (collectionState.decimal && !/^\d+$/.test(collectionState.decimal as any)) {
        errorFoundForFt = true;
        enqueueSnackbar(`Decimal should have number values.`, {
          variant: 'error',
        });
      }
      if (errorFoundForFt) return;
    }

    fieldValidations.forEach(({ fieldName, label, validations }: { fieldName: string; label: string; validations: any }) => {
      if (collectionState.tokenType !== 'Fungible token (FT)' && exemptedForNonFT.indexOf(fieldName) !== -1) {
        return;
      }
      if (collectionState.tokenType === 'Soul bound token (SBT)' && exemptedForSBT.indexOf(fieldName) !== -1) {
        return;
      }
      if (fieldName === 'displayPic' && !displayPicAfterCrop) {
        errors.push({ fieldName: label, validation: 'required' });
      }
      validations.forEach((validationCondition: any) => {
        if (validationCondition.type === 'required' && !collectionState[fieldName as keyof CollectionInitialStateType]) {
          errors.push({ fieldName: label, validation: validationCondition.type });
        } else if (validationCondition.type === 'number' && collectionState[fieldName as keyof CollectionInitialStateType]) {
          const fieldValue = collectionState[fieldName as keyof CollectionInitialStateType];
          if (!/^\d+$/.test(fieldValue)) errors.push({ fieldName: label, validation: validationCondition.type });
        }
      });
    });
    if (errors.length > 0) {
      const formattedError = formatValidationErrors(errors);
      if (formattedError.required.length > 0)
        enqueueSnackbar(`${formattedError.required.join(', ')} are required fields.${errorMessageAdd}`, {
          variant: 'error',
        });
      if (formattedError.number.length > 0)
        enqueueSnackbar(`${formattedError.number.join(', ')} should have number values.${errorMessageAdd}`, {
          variant: 'error',
        });
      if (formattedError.format_regex.length > 0)
        enqueueSnackbar(`${formattedError.required.join(', ')} is out of format.${errorMessageAdd}`, { variant: 'error' });
      return;
    }
    /* Validation end */
    const payload = { ...collectionState };
    payload.userId = user?.user_id;
    payload.walletAddress = walletAddress;
    payload.treasuryAccount = walletAddress;
    payload.walletType = walletType;
    payload.topic = hashConnectState?.topic;
    if (additionalInfo)
      payload.additionalDetails = additionalInfo.filter((item: AdditionalDetails) => item.attribute && item.value);
    if (socialMediaInfo)
      payload.socialMedia = socialMediaInfo
        .filter((item: AdditionalDetails) => item.attribute && item.value)
        .map((item: AdditionalDetails) => {
          return { media: item.attribute, url: item.value };
        });
    mutate({ payload, displayPicAfterCrop, coverPicAfterCrop });
  };

  return (
    <div className="create-collection-outer-container">
      <div className="leftview" />
      <section className="create-collection-container mint-nft-container">
        <span className="page-header">create collection</span>
        <p className="form-info">All fields marked with * are required</p>
        {/* <Button className="view-my-drafts mint-nft-button">
          <Link to="/drafts/view">View my drafts</Link>
        </Button> */}
        {!isTabletOrMobile && (
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
          <div>
            <Grid container>
              <Grid md={12}>
                <h4 className="titlehead">Choose the collection type:</h4>
                <div className="toptext">
                  <p className="choosetext">{message}</p>
                </div>
                <Grid container>
                  <Grid>
                    <RadioGroup
                      className="cardouter"
                      aria-label="platform"
                      defaultValue="Website"
                      overlay
                      name="tokenType"
                      value={collectionState.tokenType}
                      onChange={handleInputChange}
                      sx={{
                        flexDirection: 'row',
                        gap: 2,
                        [`& .${radioClasses.checked}`]: {
                          [`& .${radioClasses.action}`]: {
                            inset: -1,
                            border: '3px solid',
                            borderColor: 'primary.500',
                          },
                        },
                        [`& .${radioClasses.radio}`]: {
                          display: 'contents',
                          '& > svg': {
                            zIndex: 2,
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            bgcolor: 'background.surface',
                            borderRadius: '50%',
                          },
                        },
                      }}
                    >
                      {tokenTypeDesc.map((collectionType) => (
                        <Sheet
                          className="cardview"
                          key={collectionType.type}
                          variant="outlined"
                          sx={{
                            borderRadius: 'md',
                            boxShadow: 'sm',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 2,
                            minWidth: 120,
                          }}
                        >
                          <Radio
                            id={collectionType.type}
                            value={collectionType.type}
                            checkedIcon={<CheckCircleRoundedIcon />}
                          />
                          <div className="imageview">
                            {collectionType.image === 'nft' && <img src={nft} alt="" />}
                            {collectionType.image === 'ft' && <img src={ft} alt="" />}
                            {collectionType.image === 'sbt' && <img src={sbt} alt="" />}
                          </div>
                          <FormLabel className="labeltext" data-cy={collectionType.type} htmlFor={collectionType.type}>
                            {collectionType.type}
                          </FormLabel>
                          <Typography component="span">{collectionType.description}</Typography>
                        </Sheet>
                      ))}
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Name:<sup>*</sup>
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-basic"
                    name="name"
                    data-cy="collection-name"
                    onChange={handleInputChange}
                    value={collectionState.name}
                    variant="outlined"
                  />
                </div>
              </Grid>
            </Grid>
            {collectionState.tokenType === 'Fungible token (FT)' && (
              <Grid container className="outerfield">
                <Grid xs={12} sm={6}>
                  Symbol:<sup>*</sup>
                </Grid>
                <Grid xs={12} sm={6}>
                  <div className="inputfield">
                    <TextField
                      id="outlined-basic"
                      name="symbol"
                      data-cy="collection-symbol"
                      onChange={handleInputChange}
                      value={collectionState.symbol}
                      variant="outlined"
                    />
                  </div>
                </Grid>
              </Grid>
            )}
            {collectionState.tokenType !== 'Soul bound token (SBT)' && (
              <Grid container className="outerfield">
                <Grid xs={12} sm={6}>
                  Token Category:<sup>*</sup>
                </Grid>
                <Grid xs={12} sm={6}>
                  {collectionState.tokenType === 'Fungible token (FT)' ? (
                    <Select
                      className="additional-fields"
                      id="nft-type"
                      name="tokenCategory"
                      onChange={handleInputChange}
                      value={collectionState.tokenCategory}
                    >
                      {['Utility tokens', 'Platform tokens', 'Governance tokens', 'Others'].map((item: any) => (
                        <MenuItem value={item} key={item}>
                          <span className="dropdown-menu">{item}</span>
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      className="additional-fields"
                      id="nft-type"
                      name="tokenCategory"
                      onChange={handleInputChange}
                      value={collectionState.tokenCategory}
                    >
                      {['Photography', 'Digital Art'].map((item: any) => (
                        <MenuItem value={item} key={item}>
                          <span className="dropdown-menu">{item}</span>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
              </Grid>
            )}
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Upload display Picture:<sup>*</sup>
              </Grid>
              <Grid xs={12} sm={6}>
                <UploadImage
                  setImgAfterCrop={setDisplayPicAfterCrop}
                  previewResult={displayPicURLAfterCrop}
                  setPreviewResult={setDisplayPicURLAfterCrop}
                  aspectRatio={1 / 1}
                />
              </Grid>
            </Grid>
            <Grid container className="outerfield">
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
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Max supply:
                <FieldInfo info="Maximum number of NFTs that can be minted. You can set a maximum of 1000, if left empty it will default as INFINITE" />
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-basic"
                    name="maxSupply"
                    data-cy="collection-maxsupply"
                    onChange={handleInputChange}
                    value={collectionState.maxSupply}
                    variant="outlined"
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Description:<sup>*</sup>
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-textarea"
                    className="description-collection"
                    name="description"
                    data-cy="description-create"
                    onChange={handleInputChange}
                    value={collectionState.description}
                    multiline
                    maxRows={4}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        )}
        {steps.indexOf('Royalty details') === activeStep && (
          <div>
            <CollectionFeatures
              header="Royalty details"
              message="Fees to charge during a token transfer transaction that transfers units of this token. If you opt this, give the percent also."
              ariaLabel="royalty status"
              name="royaltyStatus"
              stateHandler={handleInputChange}
              state={collectionState.royaltyStatus}
              image={royalty}
            >
              <Grid container className="collection-feature-child">
                {collectionState.royaltyStatus && (
                  <Grid className="inputsection" container xs={12}>
                    <Grid container justifyContent="flex-start" alignItems="center" xs={12} sm={3}>
                      Royalty Percent
                    </Grid>
                    <Grid xs={12} sm={9} container justifyContent="center" alignItems="center">
                      <div className="inputfield">
                        <TextField
                          className="input-field-recent"
                          id="outlined-basic"
                          name="royaltyPercent"
                          data-cy="royalty-percent"
                          onChange={handleInputChange}
                          value={collectionState.royaltyPercent}
                          variant="outlined"
                        />
                      </div>
                    </Grid>
                  </Grid>
                )}
                <Grid className="collection-view" container xs={6}>
                  <Grid className="infoview" container justifyContent="flex-start" alignItems="center" xs={12} sm={6}>
                    Ability to change fee schedule:
                    <FieldInfo info="Custom fee schedule token without a fee schedule key is immutable" />
                  </Grid>
                  <Grid className="toogleswitch" xs={12} sm={6}>
                    <FormControlLabel
                      className="toggle-btn"
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          data-cy="switch ability change fee schedule"
                          checked={collectionState.customFeeKey}
                          onChange={handleInputChange}
                          inputProps={{ 'aria-label': 'custom fee', name: 'customFeeKey' }}
                        />
                      }
                      label=""
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CollectionFeatures>
          </div>
        )}
        {steps.indexOf('Immutability') === activeStep && (
          <CollectionFeatures
            header="Immutable"
            message="Once created, you won’t be able to update or delete the token, however you can mint tokens"
            ariaLabel="immutable status"
            name="immutable"
            stateHandler={handleInputChange}
            state={collectionState.immutable}
            image={immutable}
          />
        )}
        {steps.indexOf('Freeze Capability') === activeStep && (
          <CollectionFeatures
            header="Freeze capability"
            message="You can freeze or unfreeze an account for token transactions. If disabled, freezing is not possible"
            ariaLabel="freeze status"
            name="freezeKey"
            stateHandler={handleInputChange}
            state={collectionState.freezeKey}
            image={freeze}
          >
            <Grid container>
              <Grid xs={12} sm={9}>
                <h1>Default freeze status::</h1>
                <h4>
                  The default Freeze status (frozen or unfrozen) of accounts relative to this token. If true, an account must
                  be unfrozen before it can receive the token
                </h4>
              </Grid>
              <Grid className="toogleswitch" xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      data-cy="switch default freeze"
                      checked={collectionState.defaultFreezeStatus}
                      onChange={handleInputChange}
                      inputProps={{ 'aria-label': 'freeze status', name: 'defaultFreezeStatus' }}
                    />
                  }
                  label=""
                />
              </Grid>
            </Grid>
          </CollectionFeatures>
        )}
        {steps.indexOf('KYC Status') === activeStep && (
          <CollectionFeatures
            header="KYC Required"
            message="You can grant or revoke KYC of an account for the tokens transactions. If disabled, KYC is not required,
          and KYC grant or revoke operations are not possible"
            ariaLabel="kyc status"
            name="kycKey"
            stateHandler={handleInputChange}
            state={collectionState.kycKey}
            image={kycImage}
          />
        )}
        {steps.indexOf('Pause Capability') === activeStep && (
          <CollectionFeatures
            header="Pause capability"
            message="You can Pause or unpause any token transactions. If disabled, you wont be able to access this feature"
            ariaLabel="pause status"
            name="pauseKey"
            stateHandler={handleInputChange}
            state={collectionState.pauseKey}
            image={pause}
          />
        )}
        {steps.indexOf('Wipe Capability') === activeStep && (
          <CollectionFeatures
            header="Wipe capability"
            message="You can wipe the token balance of an account. If disabled, wipe is not possible"
            ariaLabel="wipe status"
            name="wipeKey"
            stateHandler={handleInputChange}
            state={collectionState.wipeKey}
            image={wipe}
          />
        )}
        {steps.indexOf('Additional details') === activeStep && (
          <div className="create-collection-fields-container">
            <Grid container>
              <Grid xs={12} sm={6}>
                Social Media links:
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <DynamicKeyPairForm
                    formValues={socialMediaInfo}
                    setFormValues={setSocialMediaInfo}
                    maxFields={5}
                    options={socialMediaFormOptions}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={6}>
                Tags:
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-textarea"
                    className="tags-collection"
                    data-cy="tags-create"
                    name="tags"
                    onChange={handleInputChange}
                    value={collectionState.tags}
                    multiline
                    maxRows={4}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} sm={6}>
                Properties:
              </Grid>
              <Grid xs={12} sm={6}>
                <DynamicKeyPairForm
                  formValues={additionalInfo}
                  setFormValues={setAdditionalInfo}
                  options={additionalDetailsForm}
                />
              </Grid>
            </Grid>
          </div>
        )}
        {steps.indexOf('Send to marketplace') === activeStep && (
          <div>
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Initial Supply:<sup>*</sup>
                <FieldInfo info="Specify the initial supply of fungible tokens to be put in circulation." />
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-basic"
                    name="initialSupply"
                    data-cy="collection-initialSupply"
                    onChange={handleInputChange}
                    value={collectionState.initialSupply}
                    variant="outlined"
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Decimal places
                <FieldInfo info="The number of decimal places a token is divisible by. If decimal not equal to zero, is given then for all process it will treated based on decimal only. For example, if initial supply given is 1 and decimal is 2, then total supply will be considered as 100." />
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-basic"
                    name="decimal"
                    data-cy="collection-decimal"
                    onChange={handleInputChange}
                    value={collectionState.decimal}
                    variant="outlined"
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Sale price
                <FieldInfo info="Once token is created, you won’t be able to update the sale price" />
              </Grid>
              <Grid xs={12} sm={6}>
                <div className="inputfield">
                  <TextField
                    id="outlined-basic"
                    name="salePrice"
                    data-cy="collection-salePrice"
                    onChange={handleInputChange}
                    value={collectionState.salePrice}
                    variant="outlined"
                  />
                </div>
              </Grid>
            </Grid>

            {/* <Grid container className="outerfield">
              <Grid xs={12} sm={6}>
                Wish to send marketplace after creating?
              </Grid>
              <Grid xs={12} sm={6}>
                <Switch
                  checked={collectionState.sendToMarketplace}
                  onChange={handleInputChange}
                  inputProps={{ 'aria-label': 'sendToMarketplace', name: 'sendToMarketplace' }}
                />
              </Grid>
            </Grid> */}

            {collectionState.sendToMarketplace && (
              <Grid container className="outerfield">
                <Grid xs={12} sm={6}>
                  Volume to send
                </Grid>
                <Grid xs={12} sm={6}>
                  <div className="inputfield">
                    <TextField
                      id="outlined-basic"
                      name="saleVolume"
                      data-cy="saleVolume-percent"
                      onChange={handleInputChange}
                      value={collectionState.saleVolume}
                      variant="outlined"
                    />
                  </div>
                </Grid>
              </Grid>
            )}
          </div>
        )}
        {!isTabletOrMobile && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} className="backbtn">
              <ArrowBackIosIcon /> Back
            </Button>
            <Button disabled={isLoading} className="discard-button" onClick={clearData}>
              Reset
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <>
                {isLoading && (
                  <LoadingButton loading variant="outlined">
                    Submit
                  </LoadingButton>
                )}
                {!isLoading && (
                  <Button
                    className="create-button create-btn-view"
                    disabled={isLoading}
                    onClick={(ev) => handleCreate(ev, false)}
                  >
                    Create
                  </Button>
                )}
              </>
            ) : (
              <Button
                className="nextbtn"
                data-cy="next-button"
                disabled={
                  !collectionState.tokenType ||
                  (collectionState.tokenType !== 'Non fungible token (NFT)' &&
                    (user?.verified !== 2 || user?.subscriptionType === 'basic' || user?.subscriptionType === 'silver'))
                }
                onClick={handleNext}
              >
                Next
                <ArrowForwardIosIcon />
              </Button>
            )}
            {/* <Button disabled={isLoading} className="save-draft" onClick={(ev) => handleCreate(ev, true)}>
            Save draft
          </Button> */}
          </Box>
        )}

        {isTabletOrMobile && (
          <MobileStepper
            className="stepper-mobile"
            variant="progress"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
              activeStep === steps.length - 1 ? (
                <>
                  {isLoading && (
                    <LoadingButton loading variant="outlined">
                      Submit
                    </LoadingButton>
                  )}
                  {!isLoading && (
                    <Button
                      className="create-button create-btn-view"
                      disabled={isLoading}
                      onClick={(ev) => handleCreate(ev, false)}
                    >
                      Create
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  size="small"
                  data-cy="next-button"
                  onClick={handleNext}
                  disabled={
                    !collectionState.tokenType ||
                    (collectionState.tokenType !== 'Non fungible token (NFT)' &&
                      (user?.verified !== 2 || user?.subscriptionType === 'basic' || user?.subscriptionType === 'silver'))
                  }
                >
                  Next
                  <ArrowForwardIosIcon />
                </Button>
              )
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

export default CreateCollection;
