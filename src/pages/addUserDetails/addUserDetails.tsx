/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  MenuItem,
  Select,
  Step,
  StepButton,
  Stepper,
  Switch,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  FormLabel,
  Typography,
} from '@mui/material';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Unstable_Grid2';
import { FC, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import './addUserDetails.scss';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MobileStepper from '@mui/material/MobileStepper';
import { useMediaQuery } from 'react-responsive';
import DynamicKeyPairForm from '../../components/dynamicKeyPairForm/dynamicKeyPairForm';
import UploadImage from '../../components/fileUpload/fileUpload';
import { addUserDetails } from '../../services/userServices';
import { uploadBlobToStorage } from '../../services/fileUploadService';
import { useStore } from '../../store/store';
import { userUpdate, userLogin } from '../../store/action';
import FieldInfo from '../../components/fieldInfo/fieldInfo';
import RedirectTo from '../../components/redirectTo/redirectTo';

interface userDetailsInitialStateType {
  userName?: string;
  email?: string;
  walletAddress?: string;
  subscriptionType: string;
  operation: any;
  images?: any;
  socialMedia?: any;
  userId?: number;
  targetAudience?: string;
  ftAudience?: string;
  ftAudienceOthers?: string;
  website?: string;
  teamSize?: string;
  source?: string;
  sourceOthers?: string;
  verified?: number;
}

const AddUserDetails = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { operation } = useParams();
  const [state, dispatch] = useStore();
  const { user, walletAddress } = state;
  const [steps, setSteps] = useState(['Subscription', 'Details']);
  const [redirectionMessage, setRedirectionMessage] = useState(false);
  const [navigationLink, setNavigationLink] = useState('');
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const subscriptionTypeDesc = [
    {
      type: 'basic',
      label: 'Basic plan',
      image: 'basic',
      description: 'With basic plan, you can create and mint tokens, sell your token and buy.',
      content: [
        {
          pros: true,
          text: 'Create and mint tokens to your collection',
        },
        {
          pros: true,
          text: 'Access to marketplace',
        },
      ],
    },
    {
      type: 'silver',
      label: 'Silver plan',
      image: 'silver',
      description: 'With this plan, you can create. mint and manage your tokens.',
      content: [
        {
          pros: true,
          text: 'Mint and manage your tokens',
        },
        {
          pros: true,
          text: 'Additional services like Freeze, Wipe etc',
        },
      ],
    },
    {
      type: 'gold',
      label: 'Gold plan',
      image: 'gold',
      description: 'With this plan, you can indulge in the world of SBTs and FTs.',
      content: [
        {
          pros: true,
          text: 'Mint and manage your tokens',
        },
        {
          pros: true,
          text: 'Access to Fungible tokens and soul bound tokens',
        },
      ],
    },
    {
      type: 'platinum',
      label: 'Platinum plan',
      image: 'platinum',
      description:
        'With this plan, you can avail our exclusive services that are tailor made for you to enhance your SBT/FT usecase.',
      content: [
        {
          pros: true,
          text: 'Access to Fungible tokens and soul bound tokens',
        },
        {
          pros: true,
          text: 'Access to our dedicated support and services',
        },
      ],
    },
  ];
  const [subscriptionTypes, setSubscriptionTypes] = useState<any>(subscriptionTypeDesc);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<{
    [k: number]: boolean;
  }>({});
  const [visitedSteps, setVisitedSteps] = useState<{
    [k: number]: boolean;
  }>({ 0: true });

  useEffect(() => {
    if (operation === 'sub-change') {
      const { subscriptionType: currentSubscriptionType } = user;
      const subscriptionTypeDescNew = subscriptionTypeDesc.filter((x) => x.type !== currentSubscriptionType);
      setSubscriptionTypes(subscriptionTypeDescNew);
    }
  }, [user]);

  // const user?.user_id = user?.user_id;
  // TODO: Get user id, tokenId from store and populate while submission
  const userDetailsInitialState: userDetailsInitialStateType = {
    userName: '',
    email: '',
    walletAddress: '',
    subscriptionType: 'basic',
    operation,
    images: {},
    socialMedia: [],
    targetAudience: '',
    ftAudience: '',
    ftAudienceOthers: '',
    website: '',
    teamSize: '',
    source: '',
    sourceOthers: '',
    verified: 0,
  };
  const [userDetailsState, setUserDetailsState] = useState(userDetailsInitialState);
  const [socialMediaInfo, setSocialMediaInfo] = useState<any>([]);
  const [displayPicAfterCrop, setDisplayPicAfterCrop] = useState('');
  const [displayPicURLAfterCrop, setDisplayPicURLAfterCrop] = useState<any>('');
  const [coverPicAfterCrop, setCoverPicAfterCrop] = useState('');
  const [coverPicURLAfterCrop, setCoverPicURLAfterCrop] = useState<any>('');
  // const queryClient = new QueryClient();

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

  const handleInputChange = (ev: any) => {
    setUserDetailsState({
      ...userDetailsState,
      [ev.target.name]: ev.target.value,
    });
  };

  const successOperation = async (data: any) => {
    enqueueSnackbar(operation === 'add' ? 'Added details' : 'Updated details', { variant: 'success' });
    setUserDetailsState(userDetailsInitialState);
    setDisplayPicAfterCrop('');
    setCoverPicAfterCrop('');
    setDisplayPicURLAfterCrop('');
    setCoverPicURLAfterCrop('');
    setSocialMediaInfo([]);
    const userId = data.user.user_id;
    // const dataToUpdate: any = {
    //   userName: userDetailsState.userName,
    //   image_icon: `${userId}.jpeg`,
    //   subscriptionType: data.subscriptionType,
    //   verified: data.verified,
    // };
    // dispatch(userUpdate(dataToUpdate));
    setRedirectionMessage(true);
    setNavigationLink(`/user/${userId}/profile`);
    const picName = `${userId}.jpeg`;
    if (displayPicAfterCrop) {
      const displayPicLocation = `public\\uploads\\user\\${userId}\\display_pic\\${picName}`;
      await uploadBlobToStorage(displayPicAfterCrop, displayPicLocation);
      const iconPicLocation = `public\\uploads\\user\\${userId}\\icon\\${picName}`;
      await uploadBlobToStorage(displayPicAfterCrop, iconPicLocation);
      const thumbPicLocation = `public\\uploads\\user\\${userId}\\thumbnail\\${picName}`;
      await uploadBlobToStorage(displayPicAfterCrop, thumbPicLocation);
    }
    if (coverPicAfterCrop) {
      const coverPicLocation = `public\\uploads\\user\\${userId}\\cover_pic\\${picName}`;
      await uploadBlobToStorage(coverPicAfterCrop, coverPicLocation);
    }
    dispatch(userLogin({ user: data.user, accessToken: data?.accessToken }));
    // navigate(`/user/${userId}/profile`);
    setTimeout(() => {
      navigate(`/user/${userId}/profile`);
    }, 5000);
  };

  const clearData = () => {
    setUserDetailsState(userDetailsInitialState);
    setDisplayPicAfterCrop('');
    setCoverPicAfterCrop('');
    setDisplayPicURLAfterCrop('');
    setCoverPicURLAfterCrop('');
    setSocialMediaInfo([]);
    setActiveStep(0);
    setCompletedSteps({});
    setVisitedSteps({ 0: true });
  };

  const { mutate, isLoading } = useMutation(addUserDetails, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        successOperation(data.data);
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleNext = () => {
    if (activeStep === 0) {
      if (operation === 'sub-change') {
        setSteps(['Subscription', 'Area of expertise']);
      } else if (userDetailsState.subscriptionType === 'gold' || userDetailsState.subscriptionType === 'platinum') {
        setSteps(['Subscription', 'Details', 'Area of expertise']);
      } else setSteps(['Subscription', 'Details']);
    }
    if (operation === 'add' && activeStep === 1) {
      if (userDetailsState.userName === '' && !displayPicAfterCrop) {
        enqueueSnackbar(`Username and profile picture are required fields`, { variant: 'error' });
        return;
      }
      if (userDetailsState.userName === '') {
        enqueueSnackbar(`Username is required`, { variant: 'error' });
        return;
      }
      if (!displayPicAfterCrop) {
        enqueueSnackbar(`Profile picture is required`, { variant: 'error' });
        return;
      }
      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (userDetailsState.email && !emailRegex.test(userDetailsState.email)) {
        enqueueSnackbar(`Email address is out of format`, { variant: 'error' });
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

  const handleCreate = async (ev: any) => {
    ev.preventDefault();
    if (userDetailsState.subscriptionType !== 'silver' && userDetailsState.subscriptionType !== 'basic') {
      const requiredQnFields = ['targetAudience', 'ftAudience', 'teamSize'];
      const errorFields = Object.entries(userDetailsState).filter(([key, value]) => {
        if (requiredQnFields.indexOf(key) !== -1 && !value) {
          return true;
        }
        return false;
      });
      if (errorFields.length > 0) {
        enqueueSnackbar(`Please fill the fields that are marked as required in step 3`, { variant: 'error' });
        return;
      }
    }
    if (operation === 'add') {
      const errorMessageAdd =
        userDetailsState.subscriptionType === 'silver' || userDetailsState.subscriptionType === 'basic'
          ? ' Please click on step 2 to edit.'
          : '';
      if (userDetailsState.userName === '' && !displayPicAfterCrop) {
        enqueueSnackbar(`Username and profile picture are required fields.`, {
          variant: 'error',
        });
        return;
      }
      if (userDetailsState.userName === '') {
        enqueueSnackbar(`Username is required.`, { variant: 'error' });
        return;
      }
      if (!displayPicAfterCrop) {
        enqueueSnackbar(`Profile picture is required.${errorMessageAdd}`, { variant: 'error' });
        return;
      }
      const payload = { ...userDetailsState };
      payload.walletAddress = walletAddress;
      if (userDetailsState.subscriptionType !== 'silver' && userDetailsState.subscriptionType !== 'basic')
        payload.verified = 2;
      if (socialMediaInfo)
        payload.socialMedia = socialMediaInfo
          .filter((item: { attribute: any; value: any }) => item.attribute && item.value)
          .map((item: { attribute: any; value: any }) => {
            return { media: item.attribute, url: item.value };
          });
      if (displayPicAfterCrop) {
        payload.images = { display_pic: 'exists', icon: 'exists', thumbnail: 'exists' };
      }
      if (coverPicAfterCrop) {
        payload.images = { ...payload.images, cover_pic: 'exists' };
      }
      mutate(payload);
    } else {
      const payload = {
        operation,
        subscriptionType: userDetailsState.subscriptionType,
        userId: user?.user_id,
      };
      mutate(payload);
    }
  };

  if (redirectionMessage)
    return <RedirectTo link={navigationLink} message="You will be redirected to your home page in 5 seconds" />;
  return (
    <div className="add-user-details-outer-container">
      <div className="leftview" />
      <section className="add-user-details-container">
        <span className="page-header">Please choose your subscription package</span>
        <p className="form-info">
          <span>Add some extra details also to help us verify your identity</span>
          <FieldInfo info="Only verified users can create SBT or FTs" />
        </p>
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

        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
            </Box>
          </>
        ) : (
          <>
            {activeStep === 0 && (
              <div>
                <Grid container className="outerlayout">
                  <Grid className="layoutcard" xs={12} sm={6}>
                    Choose the subscription package:
                    <p className="ourteammsg">
                      {userDetailsState.subscriptionType !== 'silver' && userDetailsState.subscriptionType !== 'basic' && (
                        <span>Our team will contact you shortly based on the responses provided</span>
                      )}
                    </p>
                    {/* {userDetailsState.subscriptionType !== 'silver' && userDetailsState.subscriptionType !== 'basic' && (
                      <p>Our team will contact you shortly based on the responses provided</p>
                    )} */}
                    <RadioGroup
                      className="layoutcardview"
                      aria-label="platform"
                      defaultValue="Website"
                      overlay
                      name="subscriptionType"
                      value={userDetailsState.subscriptionType}
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
                      {subscriptionTypes.map((subType: any) => (
                        <Grid xs={12} sm={6} md={3} className="cardlist-outer">
                          <Sheet
                            className={subType.type}
                            key={subType.type}
                            variant="outlined"
                            sx={{
                              borderRadius: 'md',
                              boxShadow: 'sm',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              p: 2,
                            }}
                          >
                            <Radio
                              className="cardinner"
                              id={subType.type}
                              value={subType.type}
                              checkedIcon={<CheckCircleRoundedIcon />}
                            />
                            <FormLabel htmlFor={subType.label}>{subType.label}</FormLabel>
                            {/* {subType.image === 'basic' && (
                            <img style={{ width: '100px', height: '100px' }} src={basic} alt="" />
                          )}
                          {subType.image === 'silver' && (
                            <img style={{ width: '100px', height: '100px' }} src={silver} alt="" />
                          )}
                          {subType.image === 'gold' && <img style={{ width: '100px', height: '100px' }} src={gold} alt="" />}
                          {subType.image === 'platinum' && (
                            <img style={{ width: '100px', height: '100px' }} src={platinum} alt="" />
                          )} */}
                            <Typography className="contentsec" component="span">
                              {subType.description}
                            </Typography>
                            <p className="cardtext">
                              <span className="price">$</span>0
                            </p>
                            {/* <div className="btnsec-subscription">
                              <Button onClick={handleNext} className="btnview get-started-button" variant="contained">
                                Get Started
                              </Button>
                            </div> */}
                            <div className="checkdetails">
                              <p className="checkcircleicon">
                                <span className="checkcircle">
                                  <CheckCircleIcon />
                                </span>{' '}
                                100 request per day
                              </p>
                              <p className="checkcircleicon">
                                <span className="checkcircle">
                                  <CheckCircleIcon />
                                </span>{' '}
                                Free trial feature access
                              </p>
                            </div>
                          </Sheet>
                        </Grid>
                      ))}
                    </RadioGroup>
                  </Grid>
                </Grid>
              </div>
            )}
            {activeStep === 1 && operation === 'add' && (
              <div className="add-user-details-fields-container">
                <Grid container>
                  <Grid sm={6} xs={12}>
                    User Name:<sup>*</sup>
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <TextField
                      id="outlined-basic"
                      data-cy="add-user-details-name"
                      name="userName"
                      onChange={handleInputChange}
                      value={userDetailsState.userName}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid sm={6} xs={12}>
                    Email:
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <div className="inputfield">
                      <TextField
                        id="outlined-basic"
                        data-cy="add-user-details-name"
                        name="email"
                        onChange={handleInputChange}
                        value={userDetailsState.email}
                        variant="outlined"
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid sm={6} xs={12}>
                    Upload display Picture:<sup>*</sup>
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <UploadImage
                      setImgAfterCrop={setDisplayPicAfterCrop}
                      previewResult={displayPicURLAfterCrop}
                      setPreviewResult={setDisplayPicURLAfterCrop}
                      aspectRatio={1 / 1}
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid sm={6} xs={12}>
                    Upload cover Picture:
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <UploadImage
                      setImgAfterCrop={setCoverPicAfterCrop}
                      previewResult={coverPicURLAfterCrop}
                      setPreviewResult={setCoverPicURLAfterCrop}
                      aspectRatio={4 / 1}
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid sm={6} xs={12}>
                    Social Media links:
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <DynamicKeyPairForm
                      formValues={socialMediaInfo}
                      setFormValues={setSocialMediaInfo}
                      maxFields={5}
                      options={socialMediaFormOptions}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            {(activeStep === 2 || (operation === 'sub-change' && activeStep === 1)) && (
              <div className="subscription-view">
                <Grid container>
                  <Grid xs={12} sm={6}>
                    How did you hear about us
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <div className="inputfield">
                      <Select
                        className="additional-fields"
                        name="source"
                        data-cy="input-dynamic-key-pair-key-select"
                        id="social-media-add-dropdown"
                        value={userDetailsState.source}
                        onChange={handleInputChange}
                      >
                        {['Social Media', 'Google/Search engine', 'Referral', 'Others'].map((item: any) => (
                          <MenuItem value={item} key={item}>
                            <span className="dropdown-menu">{item}</span>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                </Grid>
                {userDetailsState.source === 'Others' && (
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Please specify the other value:
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        id="outlined-basic"
                        name="sourceOthers"
                        onChange={handleInputChange}
                        value={userDetailsState.sourceOthers}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container>
                  <Grid xs={12} sm={6}>
                    Who are you creating tokens for:<sup>*</sup>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <div className="inputfield">
                      <Select
                        className="additional-fields"
                        name="ftAudience"
                        data-cy="input-dynamic-key-pair-key-select"
                        id="social-media-add-dropdown"
                        value={userDetailsState.ftAudience}
                        onChange={handleInputChange}
                      >
                        {['Myself', 'Another Individual', 'An Organization', 'Platform', 'Others'].map((item: any) => (
                          <MenuItem value={item} key={item}>
                            <span className="dropdown-menu">{item}</span>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                </Grid>
                {userDetailsState.ftAudience === 'Others' && (
                  <Grid container>
                    <Grid xs={12} sm={6}>
                      Please specify the other value:
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        id="outlined-basic"
                        name="ftAudienceOthers"
                        onChange={handleInputChange}
                        value={userDetailsState.ftAudienceOthers}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container>
                  <Grid xs={12} sm={6}>
                    How big is your team<sup>*</sup>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <div className="inputfield">
                      <Select
                        className="additional-fields"
                        name="teamSize"
                        data-cy="input-dynamic-key-pair-key-select"
                        id="social-media-add-dropdown"
                        value={userDetailsState.teamSize}
                        onChange={handleInputChange}
                      >
                        {['1 - 5', '6 - 10', '11 - 20', '21+'].map((item: any) => (
                          <MenuItem value={item} key={item}>
                            <span className="dropdown-menu">{item} members</span>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs={12} sm={6}>
                    How large is your target audience or user base: <sup>*</sup>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <div className="inputfield">
                      <TextField
                        id="outlined-basic"
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={userDetailsState.targetAudience}
                        variant="outlined"
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs={12} sm={6}>
                    Link to your Website:
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <div className="inputfield">
                      <TextField
                        id="outlined-basic"
                        name="website"
                        onChange={handleInputChange}
                        value={userDetailsState.website}
                        variant="outlined"
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            )}
            {!isTabletOrMobile && (
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button className="backbtn" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  <ArrowBackIosIcon /> Back
                </Button>
                <Button disabled={isLoading} className="discard-button" onClick={clearData}>
                  Reset
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {/* {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )} */}
                {activeStep === steps.length - 1 ? (
                  <>
                    {isLoading && (
                      <LoadingButton loading variant="outlined">
                        Submit
                      </LoadingButton>
                    )}
                    {!isLoading && (
                      <Button className="create-button" disabled={isLoading} onClick={handleCreate}>
                        Create
                      </Button>
                    )}
                  </>
                ) : (
                  <Button className="nextbtn" onClick={handleNext}>
                    Next
                    <ArrowForwardIosIcon />
                  </Button>
                )}
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
                        <Button className="create-button" disabled={isLoading} onClick={handleCreate}>
                          Create
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button size="small" onClick={handleNext}>
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
          </>
        )}
      </section>
      <div className="rightview" />
    </div>
  );
};

export default AddUserDetails;
