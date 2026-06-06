import { Outlet } from 'react-router-dom';
import NavbarLayout from './NavbarLayout';
import FooterLayout from './FooterLayout';
import SmoothScroll from '../../utils/SmoothScroll.jsx';
import ScrollToTop from '../ScrollToTop.jsx';

const RootLayout = () => {
  return (
    <>
      <NavbarLayout />


      <SmoothScroll>
        <ScrollToTop />
        <main>
          <Outlet />
        </main>
      </SmoothScroll>

      <footer>
        <FooterLayout />
      </footer>
    </>
  );
};

export default RootLayout;
