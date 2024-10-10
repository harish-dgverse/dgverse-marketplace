/* eslint-disable no-unused-vars */
import Grid from '@mui/material/Unstable_Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';
import './collectionFeatures.module.scss';
import IOSSwitch from '../iosSwitch/iosSwitch';

const CollectionFeatures = ({
  header,
  message,
  ariaLabel,
  name,
  stateHandler,
  state,
  image,
  children,
}: {
  header: string;
  message: string;
  ariaLabel: string;
  name: string;
  stateHandler: any;
  state: any;
  image: any;
  children?: any;
}) => {
  return (
    <div>
      <Grid className="collection-feature-section" container>
        <Grid className="collection-feature-header" xs={12} sm={6}>
          <h3 className="required-header"> {header}:</h3>
        </Grid>
        <Grid className="toogleswitch" xs={12} sm={6}>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                data-cy={`switch ${ariaLabel}`}
                checked={state}
                onChange={stateHandler}
                inputProps={{ 'aria-label': ariaLabel, name }}
              />
            }
            label=""
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <div className="imagesection-collection-feature">
            <img src={image} alt={name} />
          </div>
        </Grid>
        <Grid container justifyContent="flex-start" className="textcontainer" xs={12} sm={6}>
          <h3 className="collection-feature-text">{message}</h3>
          {/* <Grid>{children}</Grid> */}
          {children}
        </Grid>
      </Grid>
    </div>
  );
};
export default CollectionFeatures;
