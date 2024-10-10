/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Unstable_Grid2';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContactIcon from '@mui/icons-material/PersonOutline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import logo2 from '../../assets/logo-mvp.png';
import Search from '../search/search';
import PairWallet from './pairWallet';
import './header.module.scss';
import axios from '../../api/axios';
import { useStore } from '../../store/store';
import { userLogin, userLogout, walletPaired } from '../../store/action';
import SearchResults from '../searchResults/searchResults';
import NotificationPanel from '../notificationPanel/notificationPanel';
import blobStorageService from '../../utils/variables';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useHashconnectService } from '../../services/hedera-service/hashconnect.service';
import useComponentVisible from '../../hooks/useComponentVisible';
import ConnectionModal from '../modals/ConnectionModal';
import useHederaWallets, { ConnectionStateType } from '../../hooks/useHederaWallets';
import { ModalContext } from '../../services/wallet-service/ModalContext';

const Navbar = ({ hts }: { hts: boolean }) => {
  const [store, dispatch] = useStore();
  const { user, walletAddress, accessToken, freshLogin } = store;
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [walletAddressTemp, setWalletAddress] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const [state, setState] = React.useState({
    left: false,
  });
  const [openside, setOpen] = React.useState(true);

  const handleClickSide = () => {
    setOpen(!openside);
  };

  const toggleDrawer = (anchor: any, open: boolean) => () => {
    setState({ ...state, [anchor]: open });
  };
  const list = (anchor: any) => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(anchor, true)}>
      <div className="searchmob">
        <Search
          setResults={setResults}
          setShowSearchResult={setIsComponentVisible}
          setSearchLoading={setSearchLoading}
          searchLoading={searchLoading}
        />
        <div className="searchlist">
          {isComponentVisible && <SearchResults results={results} setShowSearchResult={setIsComponentVisible} />}
        </div>
      </div>
      <List>
        <ListItemButton>
          <TravelExploreOutlinedIcon />
          <Link to="/collection" className="moblink">
            <ListItemText className="mobtext" primary="Explore" />
          </Link>
        </ListItemButton>
        {user && (
          <ListItemButton>
            <NoteAddOutlinedIcon />
            <Link to="/nft/mint" className="moblink">
              <ListItemText className="mobtext" primary="Create" />
            </Link>
          </ListItemButton>
        )}
        <ListItemButton onClick={handleClickSide}>
          <StickyNote2OutlinedIcon />
          <ListItemText className="mobtext" primary="Resources" />
          {openside ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openside} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton style={{ display: 'none' }} sx={{ pl: 4 }}>
              <PlaylistAddCheckOutlinedIcon />
              <Link to="/tutorials" className="moblink subtitle">
                <ListItemText className="mobtext" primary="Tutorials" />
              </Link>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <LiveHelpOutlinedIcon />
              <Link to="/faq" className="moblink subtitle">
                <ListItemText className="mobtext" primary="FAQs" />
              </Link>
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton>
          <ContactIcon />
          <Link to="/contact-us" className="moblink">
            <ListItemText className="mobtext" primary="Contact Us" />
          </Link>
        </ListItemButton>
      </List>
    </Box>
  );

  const navigate = useNavigate();

  const handleShowNotificationPanel = () => {
    setShowNotificationPanel(!showNotificationPanel);
  };

  const handleSignInModal = () => {
    setShowSignInModal(true);
  };

  const handleClose = () => {
    setShowSignInModal(false);
  };

  const { connectedWalletType, userWalletId, disconnect } = useHederaWallets();
  const { showModal, setModalContent } = useContext(ModalContext);

  const handleShowModal = useCallback(() => {
    console.log(1);
    setModalContent(<p>Hi</p>);
    showModal();
  }, [setModalContent, showModal]);

  const {
    isLoading: notificationDataLoading,
    isError: notificationDataError,
    data: notificationData,
    refetch,
  } = useQuery({
    queryKey: ['notificationData'],
    enabled: !!user,
    queryFn: async () => {
      return axios.get(`/v1/user/${user?.user_id}/notification`).then((res) => res.data);
    },
  });

  const handleSignIn = async () => {
    if (/^([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+)$/.test(walletAddressTemp)) {
      const { data, status } = await axios.patch(
        '/v1/auth/login',
        { walletAddress: walletAddressTemp },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      handleClose();
      if (status === 200) {
        // setUserDetails(data.user);
        dispatch(walletPaired({ walletAddress: walletAddressTemp, walletType: 'hashpack', freshLogin: false }));
        dispatch(userLogin({ user: data.user, accessToken: data?.accessToken }));
        navigate(`/`);
      }
      if (status === 204) {
        dispatch(walletPaired({ walletAddress: walletAddressTemp, walletType: 'hashpack', freshLogin: false }));
        navigate(`/profile/add`);
      }
    } else {
      alert('Invalid wallet id, please use format 0.0.ddddd, where d is digit betwenn 0-9');
    }
  };

  useEffect(() => {
    if (walletAddress && !accessToken) {
      (async () => {
        const { data, status } = await axios.patch(
          '/v1/auth/login',
          { walletAddress },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        handleClose();
        if (status === 200) {
          dispatch(userLogin({ user: data.user, accessToken: data?.accessToken }));
          // if (freshLogin) navigate(`/`);
          navigate(`/`);
        }
        if (status === 204) {
          navigate(`/profile/add`);
        }
      })();
    } else handleClose();
  }, [walletAddress]);

  useEffect(() => {
    console.log(store);
  }, [store]);

  const handleLogout = async () => {
    try {
      await axiosPrivate('/v1/auth/logout', {
        withCredentials: true,
      });
      dispatch(userLogout());
      if (hts) disconnect();
      navigate(`/`);
      // navigate(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWalletAddressChange = (e: any) => {
    setWalletAddress(e.target.value);
  };

  function stringToColor(string: string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }

  function stringAvatar(name: string) {
    const splitName = name.split(' ');
    let avatarChildren;
    if (splitName.length > 1) {
      avatarChildren = `${splitName[0][0]}${splitName[1][0]}`;
    } else avatarChildren = `${splitName[0][0]}${splitName[0][1]}`;
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 32,
        height: 32,
      },
      children: avatarChildren,
    };
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElResources, setAnchorElResources] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openResource = Boolean(anchorElResources);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickResources = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElResources(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorElResources(null);
  };

  useEffect(() => {
    if (results && results.length === 0) {
      setIsComponentVisible(false);
    } else setIsComponentVisible(true);
  }, [results]);

  const menuStyle = {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };

  return (
    <section className="navsection">
      <div className="header">
        <Dialog open={showSignInModal} onClose={handleClose}>
          {/* <DialogTitle>Integrate Wallet</DialogTitle> */}
          <DialogContent>
            {hts && <PairWallet />}
            {!hts && (
              <div className="sigin-temp-input">
                Temporary signup/login. If the wallet added is not available it will create a new userId if existing will
                return existing user id.
                <TextField
                  autoFocus
                  data-cy="wallet-address-input-dummy-login"
                  margin="dense"
                  onChange={handleWalletAddressChange}
                  id="name"
                  label="Wallet address"
                  type="input"
                  fullWidth
                  variant="standard"
                />
                <Button onClick={handleClose}>Cancel</Button>
                <Button data-cy="dummy-login-signin" onClick={handleSignIn}>
                  Sign In
                </Button>
              </div>
            )}
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions> */}
        </Dialog>

        <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
          <Grid container direction="row" xs={12} sm={12}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" xs={2} sm={2}>
              <div>
                {(['left'] as const).map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button className="menubtn" onClick={toggleDrawer(anchor, true)}>
                      <MenuOutlinedIcon />
                    </Button>
                    <Drawer
                      className="drawer-mobile"
                      anchor={anchor}
                      open={state[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                    >
                      {list(anchor)}
                    </Drawer>
                  </React.Fragment>
                ))}
              </div>
            </Grid>

            <Grid
              className="profilesec"
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              xs={6}
              sm={7}
              md={5}
            >
              <Grid className="logores" display={{ xs: 'flex', lg: 'none' }}>
                <Link to="/">
                  <span className="logoview">
                    <img src={logo2} alt="logo" />
                  </span>
                </Link>
              </Grid>
            </Grid>
            {!user ? (
              <Grid sm={3} xs={4} container justifyContent="flex-end" alignItems="center" className="btnsec">
                <IconButton className="intergrate-wallet" aria-label="integrate wallet" onClick={handleSignInModal}>
                  <AccountBalanceWalletIcon />
                </IconButton>
              </Grid>
            ) : (
              <Grid sm={3} xs={4} container justifyContent="flex-end" alignItems="center" direction="row">
                {notificationData && notificationData?.length > 0 && (
                  <div className="notifyouter">
                    <IconButton className="notification" onClick={handleShowNotificationPanel}>
                      <NotificationsIcon />
                      <span className="notification-count">{notificationData?.length}</span>
                    </IconButton>
                    {showNotificationPanel && (
                      <NotificationPanel
                        notificationData={notificationData}
                        setShowNotificationPanel={setShowNotificationPanel}
                        refetch={refetch}
                      />
                    )}
                  </div>
                )}
                <Grid className="avatar-outer" container direction="row" justifyContent="center" alignItems="center">
                  <IconButton
                    className="avatar-view"
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    {user?.image_icon ? (
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        alt={user?.user_name}
                        src={`${blobStorageService.hostname}/public/uploads/user/${user.user_id}/icon/${user?.user_id}.jpeg${blobStorageService.sas}`}
                      />
                    ) : (
                      <Avatar {...stringAvatar(user?.user_name)} />
                    )}
                  </IconButton>
                </Grid>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleCloseMenu}
                  onClick={handleCloseMenu}
                  PaperProps={menuStyle}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleCloseMenu}>
                    <Link to={`/user/${user?.user_id}/profile`}>Goto Profile</Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>
                    <Link to="/nft/mint">Create</Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>
                    <Link to={`/collection/${user?.user_id}`}>My Collections</Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>
                    <Link to={`/nft/${user?.user_id}`}>My NFTs</Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Grid>
            )}
            {/* <Grid className="testnet-banner" xs={12} sm={12}>
              <section className="section">
                <p className="marquee text-styling">Beta testing on testnet network</p>
              </section>
            </Grid> */}
          </Grid>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          <Grid container direction="row">
            <Grid className="navseacrh" xs={12} sm={3}>
              <Link to="/">
                <span className="logo">
                  <img src={logo2} alt="logo" />
                </span>
              </Link>
              {/* <div ref={wrapperRef}>{props.children}</div> */}
              <div ref={ref} className="searchouter">
                <Search
                  setResults={setResults}
                  setShowSearchResult={setIsComponentVisible}
                  setSearchLoading={setSearchLoading}
                  searchLoading={searchLoading}
                />
                <div className="searchlist">
                  {isComponentVisible && <SearchResults results={results} setShowSearchResult={setIsComponentVisible} />}
                </div>
              </div>
            </Grid>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" xs={12} sm={9}>
              <Grid container direction="row" justifyContent="flex-end" alignItems="center" xs={12} sm={9} md={8}>
                <Grid>
                  <Link to="/collection" className="menu-item menu-item-link">
                    Explore
                  </Link>
                </Grid>
                {user && (
                  <Grid>
                    <Link to="/nft/mint" className="menu-item menu-item-link">
                      Mint
                    </Link>
                  </Grid>
                )}
                <Grid container direction="row" justifyContent="center">
                  <Button
                    className="resourcebtn"
                    onClick={handleClickResources}
                    sx={{ ml: 2 }}
                    aria-controls={openResource ? 'resource-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openResource ? 'true' : undefined}
                  >
                    Resources
                  </Button>
                  <Menu
                    anchorEl={anchorElResources}
                    id="resource-menu"
                    open={openResource}
                    onClose={handleCloseMenu}
                    onClick={handleCloseMenu}
                    PaperProps={menuStyle}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem style={{ display: 'none' }} onClick={handleCloseMenu}>
                      <Link to="/tutorials">Tutorials</Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                      <Link to="/faq">FAQs</Link>
                    </MenuItem>
                  </Menu>
                </Grid>
                <Grid>
                  <Link to="/contact-us" className="menu-item menu-item-link">
                    Contact Us
                  </Link>
                </Grid>
                {!user ? (
                  <Grid className="btnsec">
                    <IconButton
                      data-cy="web-integrate-wallet"
                      className="intergrate-wallet"
                      aria-label="integrate wallet"
                      onClick={handleSignInModal}
                    >
                      <AccountBalanceWalletIcon />
                    </IconButton>
                  </Grid>
                ) : (
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    {!notificationDataLoading && !notificationDataError && notificationData?.length > 0 && (
                      <div className="notifyouter">
                        <IconButton className="notification" onClick={handleShowNotificationPanel}>
                          <NotificationsIcon />
                          <span className="notification-count">{notificationData?.length}</span>
                        </IconButton>
                        {showNotificationPanel && (
                          <NotificationPanel
                            notificationData={notificationData}
                            setShowNotificationPanel={setShowNotificationPanel}
                            refetch={refetch}
                          />
                        )}
                      </div>
                    )}
                    <Grid container direction="row" justifyContent="center" alignItems="center">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        {user?.image_icon ? (
                          <Avatar
                            sx={{ width: 32, height: 32 }}
                            alt={user?.user_name}
                            src={`${blobStorageService.hostname}/public/uploads/user/${user.user_id}/icon/${user.user_id}.jpeg${blobStorageService.sas}`}
                          />
                        ) : (
                          <Avatar {...stringAvatar(user?.user_name)} />
                        )}
                      </IconButton>
                    </Grid>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleCloseMenu}
                      onClick={handleCloseMenu}
                      PaperProps={menuStyle}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={handleCloseMenu}>
                        <Link to={`/user/${user?.user_id}/profile`}>Goto Profile</Link>
                      </MenuItem>
                      <MenuItem onClick={handleCloseMenu}>
                        <Link to="/collection/create">Create Collection</Link>
                      </MenuItem>
                      <MenuItem onClick={handleCloseMenu}>
                        <Link to="/nft/mint">Mint</Link>
                      </MenuItem>
                      <MenuItem onClick={handleCloseMenu}>
                        <Link to={`/collection/${user?.user_id}`}>My Collections</Link>
                      </MenuItem>
                      <MenuItem onClick={handleCloseMenu}>
                        <Link to={`/nft/${user?.user_id}`}>My NFTs</Link>
                      </MenuItem>
                      <Divider />
                      {/* <MenuItem onClick={handleCloseMenu}>
                        <Link to="/profile/edit">Edit profile</Link>
                      </MenuItem> */}
                      <MenuItem onClick={handleCloseMenu}>
                        <Link to="/profile/sub-change">Change Subscription</Link>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {/* <Grid className="testnet-banner" xs={12} sm={12}>
              <section className="section">
                <p className="marquee text-styling">Beta testing on testnet network</p>
              </section>
            </Grid> */}
          </Grid>
        </Box>
      </div>
    </section>
  );
};
export default Navbar;
