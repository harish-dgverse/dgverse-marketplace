import { FC } from 'react';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import aboutus from '../../assets/banner.svg';
import './companyProfile.scss';

interface CompanyProfilePageProps {}

const CompanyProfilePage: FC<CompanyProfilePageProps> = () => {
  return (
    <section className="company-profile-page-outer-container">
      <Grid container>
        {/* <Grid sm={12}>
          <h1 className="abouttxt">Company Profile</h1>
        </Grid> */}
        <Grid xs={12} sm={3}>
          <div className="imageview">
            <img src={aboutus} alt="Terms And Condetions" />
          </div>
        </Grid>
        {/* <div className="contentsec"> */}
        <Grid className="content-part" xs={12} sm={9}>
          <div className="contentsec">
            <h4 className="header-view">About Us</h4>
            <h1 className="header-text">DgVerse, NFT Technology and Services</h1>
            <p className="paragraph-text">
              dgVerse is a leading provider of innovative NFT technology and services, empowering individuals, artists,
              businesses, and brands to harness the full potential of Non-Fungible Tokens (NFTs). Built on cutting-edge
              blockchain technology, dgVerse offers a comprehensive suite of solutions to create, manage, and trade NFTs
              seamlessly.
            </p>
            <p className="paragraph-text">
              <span className="vision-txt">Our Vision:</span>At dgVerse, our vision is to revolutionize the digital asset
              landscape by unlocking new possibilities through NFTs. We aim to empower creators, businesses, and brands to
              embrace the limitless potential of NFTs as a transformative force in the digital world.
            </p>
            <h4 className="header-view">Our Services</h4>
            <p className="paragraph-text">
              <span className="vision-txt">NFT Creation and Management:</span>dgVerse provides a user-friendly platform for
              creating and managing NFTs, allowing artists and creators to showcase their digital artworks and unique
              collectibles to a global audience.
            </p>
            <p className="paragraph-text">
              <span className="vision-txt">NFT Marketplace:</span>Our secure and scalable marketplace enables users to buy,
              sell, and trade NFTs, connecting creators, collectors, and enthusiasts in a vibrant ecosystem.
            </p>
            <p className="paragraph-text">
              <span className="vision-txt">NFT-as-a-Service:</span>dgVerse offers NFT-as-a-Service solutions for businesses
              and brands seeking to leverage NFTs for branding, marketing, and customer engagement. We provide tailored
              strategies and tools to unlock the potential of NFTs in driving growth and value.
            </p>
            <p className="paragraph-text">
              <span className="vision-txt">Enhanced Security and Scalability:</span>Built on advanced blockchain technology,
              dgVerse ensures the utmost security, scalability, and speed for NFT transactions, protecting the integrity and
              authenticity of digital assets.
            </p>
            <h4 className="header-view">Our Commitment</h4>
            <p className="paragraph-text">
              dgVerse is committed to providing exceptional user experiences, fostering innovation, and supporting the growth
              of the NFT ecosystem. We strive to deliver cutting-edge solutions, maintain industry-leading standards, and
              cultivate a vibrant community of creators and users.
            </p>
            <h4 className="header-view">Join dgVerse</h4>
            <p className="paragraph-text">
              We welcome creators, businesses, and enthusiasts to join dgVerse and be part of the NFT revolution. Whether you
              are an artist looking to showcase your talent, a brand seeking to engage customers, or an individual passionate
              about digital assets, dgVerse offers the tools and resources to unlock your full potential.
            </p>
          </div>
          <div className="btn-sec">
            <Link to="/contact-us">
              <Button className="btn-view-more" variant="contained">
                contact us
              </Button>
            </Link>
          </div>

          {/* <p>Company Name: dgVerse</p>
          <p>Industry: NFT Technology and Services Founded: 2023</p>
          <p>Headquarters: Trivandrum</p>
          <p>
            About dgVerse: dgVerse is a leading provider of innovative NFT technology and services, empowering individuals,
            artists, businesses, and brands to harness the full potential of Non-Fungible Tokens (NFTs). Built on
            cutting-edge blockchain technology, dgVerse offers a comprehensive suite of solutions to create, manage, and
            trade NFTs seamlessly.
          </p>
          <p>
            Our Vision: At dgVerse, our vision is to revolutionize the digital asset landscape by unlocking new possibilities
            through NFTs. We aim to empower creators, businesses, and brands to embrace the limitless potential of NFTs as a
            transformative force in the digital world.
          </p>
          <p>
            Key Services and Offerings
            <ol>
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
                NFTs for branding, marketing, and customer engagement. We provide tailored strategies and tools to unlock the
                potential of NFTs in driving growth and value.
              </li>
              <li>
                Enhanced Security and Scalability: Built on advanced blockchain technology, dgVerse ensures the utmost
                security, scalability, and speed for NFT transactions, protecting the integrity and authenticity of digital
                assets.
              </li>
            </ol>
          </p>
          <p>
            Our Commitment: dgVerse is committed to providing exceptional user experiences, fostering innovation, and
            supporting the growth of the NFT ecosystem. We strive to deliver cutting-edge solutions, maintain
            industry-leading standards, and cultivate a vibrant community of creators and users.
          </p>
          <p>
            Join dgVerse: We welcome creators, businesses, and enthusiasts to join dgVerse and be part of the NFT revolution.
            Whether you are an artist looking to showcase your talent, a brand seeking to engage customers, or an individual
            passionate about digital assets, dgVerse offers the tools and resources to unlock your full potential.
          </p>
          <p>
            To learn more about dgVerse, explore our services, or get in touch with our team, please{' '}
            <Link to="/contact-us">contact us</Link> directly.
          </p> */}
        </Grid>
        {/* </div> */}
      </Grid>
    </section>
  );
};

export default CompanyProfilePage;
