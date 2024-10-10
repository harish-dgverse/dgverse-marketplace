import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import './aboutProduct.scss';
import aboutus from '../../assets/banner.svg';

interface AboutProductPageProps {}

const AboutProductPage: FC<AboutProductPageProps> = () => {
  return (
    <div className="tutorial-page-outer-container">
      <section className="aboutpageouter company-profile-page-outer-container">
        <Grid container>
          {/* <Grid sm={12}>
            <h1 className="abouttxt">About Us</h1>
          </Grid> */}
          <Grid xs={12} sm={3}>
            <div className="imageview">
              <img src={aboutus} alt="Terms And Condetions" />
            </div>
          </Grid>

          <Grid className="content-part" xs={12} sm={9}>
            <div className="contentsec">
              <h4 className="header-view">About Us</h4>
              <h1 className="header-text">DgVerse, Vision</h1>
              <p className="paragraph-text">
                dgVerse NFT Launchpad is a cutting-edge platform built on the innovative Hedera Hashgraph blockchain network.
                We empower creators, businesses, and brands to unlock the full potential of Non-Fungible Tokens (NFTs) with
                ease, speed, and scalability. With dgVerse NFT Launchpad, you can effortlessly create, manage, and trade
                NFTs, opening new avenues for artistic expression, brand engagement, and revenue generation. Our
                user-friendly interface and powerful features make the entire process seamless and accessible to all.
              </p>
              <p className="paragraph-text">
                We provide a secure and reliable environment for NFT transactions. Leveraging the advanced capabilities of
                Hedera Hashgraph, dgVerse ensures unparalleled security, scalability, and speed, ensuring the integrity of
                your NFTs and transactions. Whether you are an artist looking to highlight your digital artworks, a brand
                looking to enhance customer experiences, or a business exploring innovative ways to engage your audience,
                dgVerse NFT Launchpad has the tools and infrastructure to bring your vision to life.
              </p>
              <p className="paragraph-text">
                Join us on this exciting journey of NFT innovation. Experience the future of NFTs with dgVerse NFT Launchpad
                and unlock new possibilities for creativity, growth, and success. Contact us to learn more about dgVerse NFT
                Launchpad or get early access to our platform. Together, let&#39;s redefine the NFT landscape and shape the
                future of digital assets.
              </p>
            </div>
            <div className="btn-sec">
              <Link to="/">
                <Button className="btn-view-more" variant="contained">
                  back
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
      </section>
    </div>
  );
};

export default AboutProductPage;
