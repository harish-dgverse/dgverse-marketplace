import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import faqContent from '../../constants/faq.json';

interface FaqPageProps {}

const FaqPage: FC<FaqPageProps> = () => {
  return (
    <div className="faq-page-outer-container">
      <section className="faq-section">
        <Grid container spacing={2}>
          {faqContent.map((item: any) => (
            <Grid key={`faq-item-${item.slno}`} xs={12}>
              <AccordionSummary className="faq-text-list-question" aria-controls="panel1a-content" id="panel1a-header">
                <Typography className="faq-text" component="span">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="faq-text-list">
                <Typography className="faq-text-content" component="span">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Grid>
          ))}
        </Grid>
      </section>
    </div>
  );
};

export default FaqPage;
