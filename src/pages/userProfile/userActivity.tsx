import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Add, ThumbUpAlt, MoveUp, People, CancelScheduleSend, TimerOff, MonetizationOn } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import axios from '../../api/axios';
import Loader from '../../components/loader/loader';

interface UserActivityProps {
  userId: string | undefined;
}

const UserActivity: FC<UserActivityProps> = ({ userId }) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: () => axios.get(`/v1/user/${userId}/recent-activity`).then((res) => res.data),
  });
  if (isLoading) return <Loader />;
  if (isError) return <h4 data-cy="error-message-return">An error has occurred</h4>;
  return (
    <div className="user-action-public-view">
      <div className="user-action-content">
        Recent Activity
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
        >
          {data.map((activity: any) => {
            return (
              <div data-cy="recent-activity-cy" key={`div-ua-${activity.tsh_id}`}>
                <ListItem key={`index-${activity.tsh_id}`}>
                  <ListItemAvatar>
                    <Avatar>
                      {(activity.type === 'mint' || activity.type === 'create') && <Add />}
                      {activity.type === 'like' && <ThumbUpAlt />}
                      {activity.type === 'transfer' && <MoveUp />}
                      {activity.type === 'follow' && <People />}
                      {activity.type === 'On sale' && <MonetizationOn />}
                      {activity.type === 'Sale cancelled' && <CancelScheduleSend />}
                      {activity.type === 'Sale expired' && <TimerOff />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={activity.type} secondary={activity.description} />
                </ListItem>
                <Divider className="dividerline" variant="inset" component="li" />
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
};

export default UserActivity;
