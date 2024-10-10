import * as React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const FieldInfo = ({ info }: { info: string }) => {
  return (
    <Tooltip title={info}>
      <IconButton>
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FieldInfo;
