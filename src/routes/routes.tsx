/* eslint-disable no-unused-vars */
import { createBrowserRouter } from 'react-router-dom';

import Home from '../pages/home/home';
import NftListAll from '../pages/nftListAll/nftListAll';
import CollectionListAll from '../pages/collectionListAll/collectionListAll';
import NftHomePage from '../pages/nftHomePage/nftHomePage';
import MintNFT from '../pages/mintNFT/mintNFT';
import CreateCollection from '../pages/createCollection/createCollection';
import CollectionHomePage from '../pages/collectionHomePage/collectionHomePage';
import UserProfile from '../pages/userProfile/userProfile';
import ViewAllNotifications from '../pages/viewAllNotifications/viewAllNotifications';
import UploadImage from '../pages/uploadImage/uploadImage';
import FreeTransfer from '../pages/freeTransfer/freeTransfer';
import AddUserDetails from '../pages/addUserDetails/addUserDetails';
import FaqPage from '../pages/faqPage/faqPage';
import TutorialPage from '../pages/tutorial/tutorial';
import TutorialDetailsPage from '../pages/tutorialDetailsPage/tutorialDetailsPage';
import ProductTnC from '../pages/productTnC/productTnC';
import AboutProduct from '../pages/aboutProduct/aboutProduct';
import PartnerWithUs from '../pages/partnerWithUs/partnerWithUs';
import CompanyProfile from '../pages/companyProfile/companyProfile';
import PrivacyAndPolicies from '../pages/privacyAndPolicies/privacyAndPolicies';
import CollectionActions from '../pages/collectionActions/collectionActions';
import AdminDashboard from '../pages/adminDashboard/adminDashboard';
import Unauthorized from '../pages/unauthorized/unauthorized';
import RequireAuth from '../components/requireAuth/requireAuth';
import Layout from '../layout/layout';
import SendToMarketplace from '../pages/sendToMarketplace/sendToMarketplace';
import SBTtest from '../pages/sbttest/sbttest';
import ContactUs from '../pages/contactUs/contactUs';
import Feedback from '../pages/feedback/feedback';

const ROLES = {
  User: 1,
  Admin: 2,
};

const router = createBrowserRouter([
  // integration done
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'admin/dashboard',
        element: (
          <RequireAuth allowedRoles={[ROLES.Admin]}>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
      {
        path: ':tokenType/mint',
        element: <MintNFT />,
      },
      {
        path: 'nft/:userId',
        element: <NftListAll />,
      },
      {
        path: 'nft',
        element: <NftListAll />,
      },
      {
        path: 'nft/:nftId/home',
        element: <NftHomePage />,
      },
      {
        path: 'nft/favorites/:userId',
        element: <NftListAll favoriteOnly />,
      },
      {
        path: ':tokenType/:identifier/transfer/send-to-marketplace',
        element: <SendToMarketplace />,
      },
      {
        path: ':tokenType/:nftId/transfer',
        element: <FreeTransfer />,
      },
      {
        path: 'collection/:userId',
        element: <CollectionListAll />,
      },
      {
        path: 'collection',
        element: <CollectionListAll />,
      },
      {
        path: 'collection/:tokenId/home',
        element: <CollectionHomePage />,
      },
      {
        path: 'collection/favorites/:userId',
        element: <CollectionListAll favoriteOnly />,
      },
      {
        path: 'collection/create',
        element: <CreateCollection />,
      },
      {
        path: 'drafts/view',
        element: <CreateCollection />,
      },
      {
        path: 'collection/actions/:tokenType/:action',
        element: <CollectionActions />,
      },
      {
        path: 'user/:userId/profile',
        element: <UserProfile />,
      },
      {
        path: 'user/notification',
        element: <ViewAllNotifications />,
      },
      {
        path: 'profile/:operation',
        element: <AddUserDetails />,
      },
      // dev route
      {
        path: 'upload/:type/:id/:cover',
        element: <UploadImage />,
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
      {
        path: 'faq',
        element: <FaqPage />,
      },
      {
        path: 'tutorials',
        element: <TutorialPage />,
      },
      {
        path: 'tutorials/:tutorialId',
        element: <TutorialDetailsPage />,
      },
      {
        path: 'contact-us',
        element: <ContactUs />,
      },
      {
        path: 'feedback',
        element: <Feedback />,
      },
      {
        path: 'about',
        // element: <AboutProduct />,
        children: [
          {
            index: true,
            element: <AboutProduct />,
          },
          {
            path: 'tnc',
            element: <ProductTnC />,
          },
          {
            path: 'company',
            children: [
              {
                index: true,
                element: <CompanyProfile />,
              },
              {
                path: 'partner-with-us',
                element: <PartnerWithUs />,
              },
              {
                path: 'pnp',
                element: <PrivacyAndPolicies />,
              },
            ],
          },
        ],
      },
    ],
  },
  // Testnet route for SBT access
  {
    path: 'university-lorem-ipsum',
    element: <SBTtest />,
  },
]);

export default router;
