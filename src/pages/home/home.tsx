import React, { FC } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import WhyUs from '../../components/whyUs/whyUs';
import TrendingSection from '../../components/trendingSection/trendingSection';
import Leaderboard from '../../components/leaderboard/leaderboard';
import Faq from '../../components/faq/faq';
import ExploreNftFootnote from '../../components/exploreNftFootnote/exploreNftFootnote';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <div>
      <div className="homepage">
        <section className="banner-section">
          <div className="textsection">
            <h1>Mint and manage your digital assets</h1>
            <p>Cleaner. Greener. Faster</p>
          </div>
          <div className="explorebtn">
            <Link to="/collection">
              <Button className="explore" variant="contained">
                Explore Now
              </Button>
            </Link>
          </div>
        </section>
        <WhyUs />
        <TrendingSection />
        <section className="leadersection">
          <Leaderboard />
        </section>
        <section className="accordion">
          <Faq />
        </section>
        <section className="getreadysection">
          <ExploreNftFootnote />
        </section>
      </div>
    </div>
  );
};

export default Home;
