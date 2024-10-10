/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React, { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import Divider from '@mui/material/Divider';
import CheckBoxIcon from '../../assets/approved.png';
import axios from '../../api/axios';
import ImageStack from '../../components/imageStack/imageStack';
import SocialMediaLinks from '../../components/socialMediaLinks/socialMediaLinks';
import UserAssets from './userAssets';
import UserAssetsOnSale from './userAssetsOnSale';
import UserActivity from './userActivity';
import StatisticsBasic from '../../components/statisticsBasic/statisticsBasic';
import LoadingComponent from '../../components/loadingComponent/loadingComponent';
import ErrorComponent from '../../components/errorComponent/errorComponent';
import { useStore } from '../../store/store';
import blobStorageService from '../../utils/variables';
import './userProfile.module.scss';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const { userId: profileUserId } = useParams();
  const [store] = useStore();
  const { user } = store;
  const loggedUserId = user?.user_id;
  const userLoggedIn = !!user?.user_id;
  // eslint-disable-next-line eqeqeq
  const selfView = loggedUserId == profileUserId;
  const {
    isLoading,
    isError,
    data: profileData,
  } = useQuery({
    queryKey: ['profileData'],
    queryFn: () => axios.get(`/v1/user/${profileUserId}?loggedUserId=${loggedUserId}`).then((res) => res.data),
  });

  const basicStatistics = useQuery({
    queryKey: ['userStatistics'],
    queryFn: () => axios.get(`/v1/user/${profileUserId}/stats`).then((res) => res.data),
  });

  const [userInteractionState, setUserInteractionState] = useState({
    follow: false,
  });

  // eslint-disable-next-line no-unused-vars
  const [userInteractionCount, setUserInteractionCount] = useState({
    views: 1,
    follow: 0,
  });

  const [userInteractionButtonState, setUserInteractionButtonState] = useState({
    follow: false,
  });

  useEffect(() => {
    if (!isLoading && !isError && userLoggedIn) {
      setUserInteractionCount({
        views: profileData.count.UserView + 1,
        follow: profileData.count.userFollowers,
      });
      setUserInteractionState({
        follow: profileData?.userActions?.follow,
      });
    }
  }, [isLoading]);

  const handleFollow = async () => {
    // To set count
    setUserInteractionCount({
      ...userInteractionCount,
      follow: userInteractionState.follow ? userInteractionCount.follow - 1 : userInteractionCount.follow + 1,
    });
    // To set followed or not
    setUserInteractionState({ ...userInteractionState, follow: !userInteractionState.follow });
    // To disable button for 2 seconds
    setUserInteractionButtonState({ ...userInteractionButtonState, follow: true });
    const { status } = await axios.post('v1/followings', {
      userId: loggedUserId,
      userTo: profileUserId,
      follow: !userInteractionState.follow,
    });
    if (status === 200) setUserInteractionButtonState({ ...userInteractionButtonState, follow: false });
  };

  useEffect(() => {
    if (loggedUserId && !selfView) {
      axios.put('/v1/misc/view', {
        userId: loggedUserId,
        userProfileId: profileUserId,
      });
    }
  }, []);

  if (isError) return <ErrorComponent />;
  if (isLoading) return <LoadingComponent />;
  return (
    <div className="user-profile-container">
      <div className="collection-home-container">
        <div className="coverpic-outer">
          {profileData.image?.display_pic && profileData.image?.cover_pic ? (
            <ImageStack
              dp={`${blobStorageService.hostname}/public/uploads/user/${profileUserId}/display_pic/${profileUserId}.jpeg${blobStorageService.sas}`}
              cover={`${blobStorageService.hostname}/public/uploads/user/${profileUserId}/cover_pic/${profileUserId}.jpeg${blobStorageService.sas}`}
            />
          ) : (
            profileData.image?.display_pic &&
            !profileData.image?.cover_pic && (
              <div className="profilepicture">
                <img
                  src={`${blobStorageService.hostname}/public/uploads/user/${profileUserId}/display_pic/${profileUserId}.jpeg${blobStorageService.sas}`}
                  className="profile-photo"
                  alt="user-cover"
                />
              </div>
            )
          )}
        </div>

        <div className="user-profile-header">
          <div className="userlistview">
            <div className="user-name-date">
              <div className="user-name-containver">
                <div className="namesec">
                  <div className="username-section">
                    <span className="user-name">
                      {profileData.user_name}
                      <span className="image-approved">
                        <img className="follower-count-icon" src={CheckBoxIcon} alt="" />
                      </span>
                      {/* {selfView && user?.user_name.verified && <CheckBoxIcon className="follower-count-icon" />} */}
                    </span>

                    {!selfView && userLoggedIn && (
                      <span className="button-follow-container">
                        <Button
                          onClick={handleFollow}
                          className={
                            userInteractionState.follow || userInteractionButtonState.follow ? 'button' : 'following'
                          }
                        >
                          {(userInteractionState.follow || userInteractionButtonState.follow) && <span>Unfollow</span>}
                          {!(userInteractionState.follow || userInteractionButtonState.follow) && <span>Follow</span>}
                        </Button>
                      </span>
                    )}
                  </div>

                  <div className="btnsecview">
                    {selfView && (
                      <div className="action-wrapper">
                        <Button className="create-collection-button">
                          <Link to="/collection/create">Create Collection</Link>
                        </Button>
                        <Button className="mint-nft-button">
                          <Link to="/nft/mint">Mint</Link>
                        </Button>
                        <Button className="assosiate-token-button mint-nft-button">
                          <Link to="/collection/actions/token/token-associate">Associate Collection</Link>
                        </Button>
                        <Button className="dissociate-token-button mint-nft-button">
                          <Link to="/collection/actions/token/token-dissociate">Dissociate Collection</Link>
                        </Button>
                        {/* <Button className="edit-profile mint-nft-button">
                      <Link to="/profile/edit">Edit</Link>
                    </Button> */}
                        <Button className="upgrade-profile mint-nft-button">
                          <Link to="/profile/sub-change">Change subscription</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="date-sec">
                    <span className="user-id">{profileData.Wallet[0].wallet_address}</span>

                    {/* {!selfView && userLoggedIn && (
                    <span className="button-follow-container">
                      <Button onClick={handleFollow} className="button">
                        {(userInteractionState.follow || userInteractionButtonState.follow) && <span>Unfollow</span>}
                        {!(userInteractionState.follow || userInteractionButtonState.follow) && <span>Follow</span>}
                      </Button>
                    </span>
                  )} */}
                    <span className="user-joining-date">
                      Joined on {moment(profileData.timestamp).format('MMMM Do YYYY')}
                    </span>
                  </div>
                  {profileData.SocialMedia && (
                    <div className="sociallinks">
                      <SocialMediaLinks mediaLinks={profileData.SocialMedia} />
                    </div>
                  )}
                </div>
                <Grid className="nft-name-date-share" container columnSpacing={2}>
                  <div className="socialmediaicons">
                    <div className="followsec">
                      <span className="follower-count">{userInteractionCount.follow}</span>
                      <IconButton className="user-like-button no-pointer">
                        <Diversity1Icon className="follower-count-icon" />
                      </IconButton>
                      <span className="nft-view">{userInteractionCount.views}</span>
                      <IconButton className="user-like-button no-pointer">
                        <VisibilityIcon className="nft-view-icon" />
                      </IconButton>
                    </div>
                  </div>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="stat-container">
        <StatisticsBasic basicStatistics={basicStatistics} />
      </section>
      <section className="user-assets-action-section">
        <div className="user-assets-onsale">
          <UserAssetsOnSale userId={profileUserId} isOwner={selfView} />
        </div>
        <Divider />

        {selfView && (
          <div className="user-assets-section profile">
            <UserAssets userId={profileUserId} isOwner={selfView} />
          </div>
        )}

        {!selfView && (
          <>
            <div className="user-assets-section profile recentactivity">
              <UserAssets userId={profileUserId} isOwner={selfView} />
            </div>
            <div className="recentactivity">
              <UserActivity userId={profileUserId} />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
