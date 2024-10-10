import { Outlet } from 'react-router-dom';
import Footer from '../components/footer/footer';
import Navbar from '../components/navbar/navbar';

const Layout = () => {
  return (
    <div className="app">
      {/* <Navbar hts /> */}
      <Navbar hts={false} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
