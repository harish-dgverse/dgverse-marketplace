import Grid from '@mui/material/Unstable_Grid2';
import list1 from '../../assets/dgverse-advantage/list1.svg';
import list2 from '../../assets/dgverse-advantage/list2.svg';
import list3 from '../../assets/dgverse-advantage/list3.svg';
import list4 from '../../assets/dgverse-advantage/list4.svg';
import list5 from '../../assets/dgverse-advantage/list5.svg';
import list6 from '../../assets/dgverse-advantage/list6.svg';

const WhyUs = () => {
  return (
    <section className="whydg">
      <h2>Why dgVerse?</h2>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4}>
          <div className="card">
            <p className="cardtitle">Streamlined Minting and Management</p>
            <span className="listimg">
              <img src={list3} alt="list" />
            </span>
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <div className="card">
            <p className="cardtitle">Green and Carbon Negative</p>
            <span className="listimg">
              <img src={list1} alt="list" />
            </span>
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <div className="card">
            <p className="cardtitle">10x Faster</p>
            <span className="listimg">
              <img src={list2} alt="list" />
            </span>
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <div className="card">
            <p className="cardtitle">Empowering Tokens</p>
            <span className="listimg">
              <img src={list4} alt="list" />
            </span>
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <div className="card">
            <p className="cardtitle">Explore the possibilities with SBTs</p>
            <span className="listimg">
              <img src={list5} alt="list" />
            </span>
          </div>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <div className="card">
            <p className="cardtitle">Cost-Effective Gas Fees</p>
            <span className="listimg">
              <img src={list6} alt="list" />
            </span>
          </div>
        </Grid>
      </Grid>
    </section>
  );
};
export default WhyUs;
