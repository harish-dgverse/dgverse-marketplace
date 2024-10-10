import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import Joi from 'joi';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import logo from '../../assets/bg-doodles/footer.svg';
import buildOnHedera from '../../assets/built-on-hedera.webp';
import { addEmailToNewletterList } from '../../services/miscServices';
import './footer.module.scss';
import SocialMediaLinks from '../socialMediaLinks/socialMediaLinks';

const Footer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [newsLetterInput, setNewsLetterInput] = useState('');
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleNewsletterInput = (e: any) => {
    setNewsLetterInput(e.target.value);
  };

  const { mutate } = useMutation(addEmailToNewletterList, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        setMailSent(true);
        enqueueSnackbar(`Mailed added to newletter list`, { variant: 'success' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleEmailSubmission = () => {
    console.log(newsLetterInput);
    setLoading(true);
    setMailSent(false);
    const emailValidationSchema = Joi.string().email({ tlds: false });
    const { error } = emailValidationSchema.validate(newsLetterInput);
    if (error) {
      enqueueSnackbar(`Invalid email`, { variant: 'error' });
      setLoading(false);
    } else {
      mutate({ email: newsLetterInput });
    }
  };

  return (
    <section className="footerview">
      <div className="footersec">
        <Grid className="footercontainer" container spacing={1} justifyContent="space-between">
          <Grid xs={12} sm={3} lg={4}>
            <div className="imagesection">
              <span className="logosec">
                <img src={logo} alt="logo" />
              </span>
              <p>An enterprise-grade platform for the creation and management of digital assets</p>
              {!mailSent && (
                <>
                  <p className="emailtitle">Join our newsletter mailing list</p>
                  <TextField
                    className="emailtext"
                    margin="dense"
                    onChange={handleNewsletterInput}
                    id="name"
                    label="Please enter your email address"
                    type="input"
                    fullWidth
                    variant="standard"
                    value={newsLetterInput}
                  />
                  <Grid container direction="row" justifyContent="start" alignItems="start" xs={12}>
                    <Button onClick={handleEmailSubmission} disabled={loading} className="joinbtn" variant="contained">
                      Join
                    </Button>
                  </Grid>
                </>
              )}
            </div>
          </Grid>
          <Grid xs={12} sm={2} lg={2}>
            <ul>
              <li className="title">About</li>
              <li>
                <Link to="about">Product</Link>
              </li>
              <li>
                <Link to="about/tnc">Term & Condition</Link>
              </li>
            </ul>
          </Grid>
          <Grid xs={12} sm={2} lg={2}>
            <ul>
              <li className="title">Company</li>
              <li>
                <Link to="about/company">Profile</Link>
              </li>
              <li>
                <Link to="about/company/partner-with-us">Partner With Us</Link>
              </li>
              <li>
                <Link to="about/company/pnp">Privacy & Policy</Link>
              </li>
            </ul>
          </Grid>
          <Grid xs={12} sm={2} lg={2}>
            <ul>
              <li className="title">Resources</li>
              <li style={{ display: 'none' }}>
                <Link to="tutorials">Tutorials</Link>
              </li>
              <li>
                <Link to="faq">FAQ</Link>
              </li>
            </ul>
          </Grid>
          <Grid xs={12} sm={3} lg={2}>
            <ul>
              <li className="title">
                <Link to="contact-us">Contact</Link>
              </li>
              <li>hello@dgverse.in</li>
              <li>
                <Link to="feedback">Feedback</Link>
              </li>
              <li className="socilalsec">
                <SocialMediaLinks
                  mediaLinks={[
                    {
                      media: 'yt',
                      url: 'https://www.youtube.com/@WerDgverse',
                    },
                    {
                      media: 'twitter',
                      url: 'https://twitter.com/dgverse1',
                    },
                    {
                      media: 'linkedin',
                      url: 'https://www.linkedin.com/company/dgverse/',
                    },
                  ]}
                />
              </li>
              <li />
              <li>
                <img className="buildOnHedera-img" src={buildOnHedera} alt="buildOnHedera" />
              </li>
            </ul>
          </Grid>
        </Grid>
      </div>
    </section>
  );
};
export default Footer;
