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

  const { showModal, setModalContent } = useContext(ModalContext);
  const handleSignInModal = () => {
    setShowSignInModal(true);
  };

  const handleClose = () => {
    setShowSignInModal(false);
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
        }
      })();
    } else handleClose();
  }, [walletAddress]);

  return (
    <section className="navsection">
      <div className="header">
        <Dialog open={showSignInModal} onClose={handleClose}>
          <DialogTitle>Integrate Wallet</DialogTitle>
          <DialogContent>{hts && <PairWallet />}</DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          <Grid container direction="row">
            <Grid className="navseacrh" xs={12} sm={3} />
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" xs={12} sm={9}>
              <Grid container direction="row" justifyContent="flex-end" alignItems="center" xs={12} sm={9} md={8}>
                {!user ? (
                  <Grid className="btnsec">
                    <IconButton className="intergrate-wallet" aria-label="integrate wallet" onClick={handleSignInModal}>
                      <AccountBalanceWalletIcon />
                    </IconButton>
                  </Grid>
                ) : (
                  <span>Logged in</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    </section>
  );
};
export default Navbar;
