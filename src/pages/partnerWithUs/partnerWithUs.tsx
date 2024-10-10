import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';

interface PartnerWithUsPageProps {}

const PartnerWithUsPage: FC<PartnerWithUsPageProps> = () => {
  return (
    <div className="tutorial-page-outer-container faq-page-outer-container">
      <section className="faq-section aboutpageouter">
        <Grid container spacing={2}>
          <Grid sm={12}>
            <h1 className="abouttxt">Partner With us</h1>
          </Grid>
          <Grid xs={12} sm={12}>
            <p className="paragraph-list m-0">
              We welcome creators, businesses, and enthusiasts to join dgVerse and be part of the NFT revolution. Whether you
              are an artist looking to showcase your talent, a brand seeking to engage customers, or an individual passionate
              about digital assets, dgVerse offers the tools and resources to unlock your full potential.
            </p>
            <p>
              <h1 className="abouttxt">Key Services and Offerings</h1>
              <ol className="terms-list">
                <li>
                  NFT Creation and Management: dgVerse provides a user-friendly platform for creating and managing NFTs,
                  allowing artists and creators to showcase their digital artworks and unique collectibles to a global
                  audience.
                </li>
                <li>
                  NFT Marketplace: Our secure and scalable marketplace enables users to buy, sell, and trade NFTs, connecting
                  creators, collectors, and enthusiasts in a vibrant ecosystem.
                </li>
                <li>
                  NFT-as-a-Service: dgVerse offers NFT-as-a-Service solutions for businesses and brands seeking to leverage
                  NFTs for branding, marketing, and customer engagement. We provide tailored strategies and tools to unlock
                  the potential of NFTs in driving growth and value.
                </li>
                <li>
                  Enhanced Security and Scalability: Built on advanced blockchain technology, dgVerse ensures the utmost
                  security, scalability, and speed for NFT transactions, protecting the integrity and authenticity of digital
                  assets.
                </li>
              </ol>
            </p>

            <p className="paragraph-list note">
              <span className="note-txt">Note:</span> If you have any questions regarding or interested to partner with us,
              please <Link to="/contact-us">contact us</Link>.
            </p>

            <p className="note">
              <span className="note-txt">Note:</span> Please use the form below to drop us a mail, we will get back you
              shortly.
            </p>
          </Grid>
        </Grid>
      </section>
    </div>
  );
};

export default PartnerWithUsPage;
