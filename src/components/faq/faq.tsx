import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import faqContent from '../../constants/faq.json';

const Faq = () => {
  return (
    <div className="faqouter">
      <div className="spacepic" />
      <div className="faqtxt">
        <h1>Frequently Asked Questions</h1>
        <p>Wanna Ask Something?</p>
      </div>
      <div className="accordiionouter">
        <Grid container spacing={2}>
          {faqContent.slice(0, 6).map((item: any) => (
            <Grid key={`faq-item-${item.slno}`} xs={12} sm={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography component="span">{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component="span">{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
        <section className="seemore">
          <Link to="/faq/">
            <Button className="more" variant="outlined">
              See more
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};
export default Faq;
