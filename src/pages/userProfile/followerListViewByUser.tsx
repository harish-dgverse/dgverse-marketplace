import { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';

interface FollowerListProps {
  followerList: any;
}

interface AvatarProps {
  name: string;
  image: any;
}

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
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const ShowAvatar: FC<AvatarProps> = ({ name, image }) => {
  return (
    <div>{image?.thumb ? <Avatar alt={name} src="/static/images/avatar/1.jpg" /> : <Avatar {...stringAvatar(name)} />}</div>
  );
};

const FollowerList: FC<FollowerListProps> = ({ followerList }) => {
  return (
    <div className="followerlist-container">
      {followerList.slice(0, 50).map((element: any) => {
        const { name, image } = element;
        return <ShowAvatar name={name} image={image} />;
      })}
      {followerList?.length > 50 && (
        <Button className="more" variant="outlined">
          See more
        </Button>
      )}
    </div>
  );
};
export default FollowerList;
