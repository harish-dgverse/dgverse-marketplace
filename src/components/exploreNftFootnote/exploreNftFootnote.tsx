// import Button from '@mui/material/Button';
// import { Link } from 'react-router-dom';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Grid from '@mui/system/Unstable_Grid';

const ExploreNftFootnote = () => {
  return (
    <div className="collectnft">
      <div className="readyastro" />
      <div className="readypic" />
      <h1>Be ready to get into the world of digital assets</h1>
      <Grid className="services-provided-container">
        <span className="service-text">Token launchpad</span>
        <span className="divider-dot">
          <FiberManualRecordIcon />
        </span>
        <span className="service-text">web3 as a service</span>
        <span className="divider-dot">
          <FiberManualRecordIcon />
        </span>
        <span className="service-text">Soul bound token</span>
        <span className="divider-dot">
          <FiberManualRecordIcon />
        </span>
        <span className="service-text">NFT/FT platform development</span>
        <span className="divider-dot">
          <FiberManualRecordIcon />
        </span>
        <span className="service-text">Consulting and support</span>
      </Grid>
      {/* <div className="getabtn">
        <Button className="explore" variant="contained">
          <Link to="/collection">Explore Now</Link>
        </Button>
      </div> */}
    </div>
  );
};
export default ExploreNftFootnote;
