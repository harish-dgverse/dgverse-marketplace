/* eslint-disable import/prefer-default-export */
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

export const stringAvatar = (name: string) => {
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
};
