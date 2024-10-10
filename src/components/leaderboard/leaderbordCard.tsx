import Grid from '@mui/material/Unstable_Grid2';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import blobStorageService from '../../utils/variables';

interface LeaderboardCardProps {
  userDetails: any;
  rank: number;
}

const LeaderboardCard: FC<LeaderboardCardProps> = ({ userDetails, rank }) => {
  return (
    <Grid className="leaderboardlist" xs={12} sm={6}>
      <div className="leaderbordcard">
        <Grid className="leaderboardhead" container spacing={2} data-cy="leaderbordcard">
          <Grid className="leaderboardview" xs={8}>
            <div className="leaderlist">
              <span className="leaderno">{rank}</span>
              <Link to={`user/${userDetails.user_id}/profile`}>
                <span className="leaderpic">
                  {userDetails.image && userDetails.image?.icon && (
                    <img
                      src={`${blobStorageService.hostname}/public/uploads/user/${userDetails.user_id}/icon/${userDetails.user_id}.jpeg${blobStorageService.sas}`}
                      alt="profile"
                    />
                  )}
                </span>
              </Link>
              <Link to={`user/${userDetails.user_id}/profile`}>
                <p data-cy="leaderboard-card-name">{userDetails.user_name}</p>
              </Link>
            </div>
          </Grid>
          <Grid container direction="row" alignItems="center" justifyContent="center" xs={4}>
            <div className="leaderlistcount">
              {userDetails.followerCount !== 0 && (
                <p className="asset" data-cy="leaderboard-follower-count">
                  Followers: {userDetails.followerCount}
                </p>
              )}
              {userDetails.assets !== 0 && (
                <p className="asset" data-cy="leaderboard-assets-count">
                  Assets: {userDetails.assets}
                </p>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};
export default LeaderboardCard;
