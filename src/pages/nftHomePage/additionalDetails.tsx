import { FC } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AdditionalDetailsProps {
  additionalInfo: any;
}

const AdditionalDetails: FC<AdditionalDetailsProps> = ({ additionalInfo }) => {
  return (
    <Grid className="additional-details-nft" item xs={12}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <div className="content-headers">Additional Details</div>
        </AccordionSummary>
        <AccordionDetails>
          {additionalInfo?.length > 0 &&
            additionalInfo.map((item: any) => (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {item.attribute}
                </Grid>
                <Grid item xs={6}>
                  {item.value}
                </Grid>
              </Grid>
            ))}
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default AdditionalDetails;
