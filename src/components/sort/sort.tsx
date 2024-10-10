import { FC, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import './sort.module.scss';
import sort from '../../assets/sort.svg';

interface SortProps {
  sortOrder: any;
  setSortOrder: any;
  sortOptions: any;
}

const Sort: FC<SortProps> = ({ sortOrder, setSortOrder, sortOptions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (sortMenuItem: string) => {
    setSortOrder(sortMenuItem);
    setAnchorEl(null);
  };

  return (
    <div className="listtextpart">
      <Grid container spacing={2}>
        <Grid xs={12} md={9}>
          <h1>BROWSE OUR LAUNCHPAD</h1>
          <p>Browse through a wide collection NFTs</p>
        </Grid>
        <Grid className="sortbtn" xs={12} sm={3}>
          <Button
            id="sort-positioned-button"
            aria-controls={open ? 'sort-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="explore"
            variant="contained"
          >
            <img src={sort} alt="sort" />
            <span className="sort-button-label">Sort: {sortOrder}</span>
          </Button>
          <Menu
            id="sort-positioned-menu"
            aria-labelledby="sort-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose('trending')}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {sortOptions.map((option: any) => (
              <MenuItem key={option.key} onClick={() => handleClose(option.value)}>
                <span className="dropdown-menu">{option.label}</span>
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>
    </div>
  );
};

export default Sort;
