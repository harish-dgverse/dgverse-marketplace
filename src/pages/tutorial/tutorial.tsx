import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import turtorialimage from '../../assets/nft-website.jpg';

interface TutorialPageProps {}

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

const TutorialPage: FC<TutorialPageProps> = () => {
  const [currentDate] = useState(getDate());
  return (
    <div className="tutorial-page-outer-container faq-page-outer-container">
      <section className="aboutpageouter faq-section">
        <Grid container>
          <Grid sm={12}>
            <h1 className="abouttxt">Tutorials</h1>
          </Grid>
          {/* <div className="contentsec"> */}
          <Grid container xs={12} sm={12}>
            <Grid className="tutorial-outer" container xs={12}>
              <Grid xs={3}>
                <div className="image-turtorial">
                  <img src={turtorialimage} alt="turtorial" />
                </div>
              </Grid>
              <Grid container xs={9}>
                <div className="turtorial-list-view">
                  <h1 className="header-tutorial">Lorem Ipsum</h1>
                  <p className="paragraph-turtorial">
                    At dgVerse, we take your privacy seriously and are committed to protecting your personal information.
                    This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you access and
                    use dgVerse services. By using dgVerse, you agree to the terms and practices described in this policy.
                  </p>
                  <Grid xs={6}>
                    <p className="date-turtorial">Date: {currentDate}</p>
                  </Grid>
                  <Grid xs={6}>
                    <div className="btn-sec">
                      <Link to="/tutorials/1">
                        <Button className="btn-view-more" variant="contained">
                          View More
                        </Button>
                      </Link>
                    </div>
                  </Grid>
                </div>
              </Grid>
            </Grid>

            <Grid className="tutorial-outer" container xs={12}>
              <Grid xs={3}>
                <div className="image-turtorial">
                  <img src={turtorialimage} alt="turtorial" />
                </div>
              </Grid>
              <Grid container xs={9}>
                <div className="turtorial-list-view">
                  <h1 className="header-tutorial">Lorem Ipsum</h1>
                  <p className="paragraph-turtorial">
                    At dgVerse, we take your privacy seriously and are committed to protecting your personal information.
                    This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you access and
                    use dgVerse services. By using dgVerse, you agree to the terms and practices described in this policy.
                  </p>
                  <Grid xs={6}>
                    <p className="date-turtorial">Date: {currentDate}</p>
                  </Grid>
                  <Grid xs={6}>
                    <div className="btn-sec">
                      <Link to="/tutorials/2">
                        <Button className="btn-view-more" variant="contained">
                          View More
                        </Button>
                      </Link>
                    </div>
                  </Grid>
                </div>
              </Grid>
            </Grid>

            <p className="note">
              <span className="note-txt">Note:</span> Turtorials
            </p>
          </Grid>
        </Grid>
      </section>
    </div>
  );
};

export default TutorialPage;
