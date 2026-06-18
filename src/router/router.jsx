import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout.jsx';

import HomeView from '../pages/public/public_Home/HomeView';
import AboutView from '../pages/public/public_about/AboutView';
import DiscoverView from '../pages/public/public_discover/DiscoverView';
import DiscoverDetails from '../pages/public/public_discover/DiscoverDetails';
import CollaborateView from '../pages/public/public_collaborate/CollaborateView';

import SigninView from '../pages/public/public_login/SigninView.jsx';
import RegisterView from '../pages/public/public_login/SignUpView.jsx';
import VerifyEmailView from '../pages/public/public_login/VerifyEmailView.jsx';
import ForgotPasswordView from '../pages/public/public_login/ForgotPasswordView.jsx';
import OtpVerificationView from '../pages/public/public_login/OtpVerificationView.jsx';
import ResetPasswordView from '../pages/public/public_login/ResetPasswordView.jsx';
import CommunityView from '../pages/public/public_community/CommunityView';

import NotFound from '../pages/error/NotFound';
import Unauthorized from '../pages/error/Unauthorized';
import EventView from '../pages/public/public_event/EventView.jsx';
import EventDetailsPage from '../pages/public/public_event/EventDetails.jsx';

import ServiceView from '../pages/public/public_service/ServiceView.jsx';
import ServiceDetails from '../pages/public/public_service/ServiceDetails.jsx';

import NewsView from '../pages/public/public_news/NewsView';
import NewsDetails from '../pages/public/public_news/NewsDetails.jsx';
import TermsView from '../pages/public/public_terms/TermsView.jsx';
import PrivacyView from '../pages/public/public_privacy/PrivacyView.jsx';
import ContactView from '../pages/public/public_contact/ContactView.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import RequireAuth from '../components/auth/RequireAuth.jsx';
import { ROLES } from '../context/AuthContext.jsx';

// Dashboard Pages
import ProviderIndex from '../pages/dashboards/provider/ProviderIndex.jsx';
import ProviderEvent from '../pages/dashboards/provider/event/ProviderEvent.jsx';
import ProviderEventDetails from '../pages/dashboards/provider/event/EventDetails.jsx';
import ProviderEventAnalytics from '../pages/dashboards/provider/eventAnalytics/EventAnalytics.jsx';
import CoachIndex from '../pages/dashboards/coach/CoachIndex.jsx';
import Event from '../pages/dashboards/admin/event/Event.jsx';
import AdminIndex from '../pages/dashboards/admin/adminIndex/AdminIndex.jsx';
;
import CoachEvent from '../pages/dashboards/coach/event/CoachEvent.jsx';
import CoachEventDetails from '../pages/dashboards/coach/event/EventDetails.jsx';
import EventAnalytics from '../pages/dashboards/coach/eventAnalytics/EventAnalytics.jsx';
;
import EventAnallyticsDetails from '../pages/dashboards/shared/eventAnalytics/EventAnallyticsDetails.jsx';
import Enquiries from '../pages/dashboards/shared/eventAnalytics/Enquiries.jsx';

import Recruitment from '../pages/dashboards/coach/recruitment/Recruitment.jsx';
import RecruitmentDetails from '../pages/dashboards/coach/recruitment/RecruitmentDetails.jsx';
import EditProfile from '../pages/dashboards/coach/CoachIndex/EditProfile.jsx';
import ProviderService from '../pages/dashboards/provider/service/ProviderService.jsx';
import ProviderServiceDetails from '../pages/dashboards/provider/service/ServiceDetails.jsx';
import ServiceAnalytics from '../pages/dashboards/provider/serviceAnalytics/ServiceAnalytics.jsx';
import ProviderThread from '../pages/dashboards/provider/thread/ProviderThread.jsx';
import ProviderThreadDetails from '../pages/dashboards/provider/thread/ProviderThreadDetails.jsx';
import ProviderSettings from '../pages/dashboards/provider/settings/ProviderSettings.jsx';
import AddListing from '../pages/dashboards/provider/addListing/AddListing.jsx';
import AddListingDetails from '../pages/dashboards/provider/addListing/AddListingDetails.jsx';
import Insights from '../pages/dashboards/provider/insights/Insights.jsx';
import InsightsPreview from '../pages/dashboards/provider/insights/InsightsPreview.jsx';
import ProviderEnquiries from '../pages/dashboards/provider/enquiries/ProviderEnquiries.jsx';
import ProviderNotifications from '../pages/dashboards/provider/notifications/ProviderNotifications.jsx';


// Admin Dashboard Pages
import DashboardOverview from '../pages/dashboards/user/dashboardOverview/DashboardOverview.jsx';
import EventDetails from '../pages/dashboards/user/myEvents/EventDetails.jsx';
import UserNotifications from '../pages/dashboards/user/notifications/Notifications.jsx';
import MyEvents from '../pages/dashboards/user/myEvents/MyEvents.jsx';
import UserCommunity from '../pages/dashboards/user/community/Community.jsx';
import Saved from '../pages/dashboards/user/saved/Saved.jsx';

import AdminSettings from '../pages/dashboards/admin/settings/Settings.jsx';

import MarketPlaceView from '../pages/public/public_market/MarketPlaceView.jsx';
import Users from '../pages/dashboards/admin/Users/Users.jsx';
import ListingsManagement from '../pages/dashboards/admin/ListingsManagement/ListingsManagement.jsx';
import SportProviderListingDetails from '../pages/dashboards/admin/ListingsManagement/SportProviderListingDetails.jsx';
import ServiceProviderListingDetails from '../pages/dashboards/admin/ListingsManagement/ServiceProviderListingDetails.jsx';
import EventSingleDetails from '../pages/dashboards/admin/event/EventSingleDetails.jsx';
import Brand from '../pages/dashboards/admin/Brand/Brand.jsx';
import Demand from '../pages/dashboards/admin/Demand/Demand.jsx';
import Content from '../pages/dashboards/admin/Content/Content.jsx';
import Revenue from '../pages/dashboards/admin/Revenue/Revenue.jsx';
import Analytics from '../pages/dashboards/admin/Analytics/Analytics.jsx';
import AdminProfile from '../pages/dashboards/admin/profile/AdminProfile.jsx';
import Notifications from '../pages/dashboards/coach/Notifications/Notifications.jsx';
import AccountDetails from '../pages/dashboards/user/account/AccountDetails.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<SigninView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/forgot-password" element={<ForgotPasswordView />} />
      <Route path="/otp-verification" element={<OtpVerificationView />} />
      <Route path="/verify-email" element={<VerifyEmailView />} />
      <Route path="/reset-password" element={<ResetPasswordView />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomeView />} />
        <Route path="about" element={<AboutView />} />
        {/* <Route path="find-sport" element={<FindSport />} />
        <Route path="find-sport/:id" element={<FindSportDetails />} /> */}
        <Route path="discover" element={<DiscoverView />} />
        <Route path="discover/:type/:id" element={<DiscoverDetails />} />
        <Route path="community" element={<CommunityView />} />
        <Route path="collaborate" element={<CollaborateView />} />

        <Route path="events" element={<EventView />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="marketplace" element={<MarketPlaceView />} />
        {/* <Route path="marketplace/:id" element={<MarketplaceDetails />} /> */}
        {/* <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmed" element={<OrderConfirmed />} /> */}
        {/* <Route path="my-orders" element={<MyOrders />} /> */}
        <Route path="services" element={<ServiceView />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="news" element={<NewsView />} />
        <Route path="news/:id" element={<NewsDetails />} />
        <Route path="terms" element={<TermsView />} />
        <Route path="privacy" element={<PrivacyView />} />
        <Route path="contact" element={<ContactView />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Public Dashboard (no landing header) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="/dashboard/notifications" element={<UserNotifications />} />
        <Route path="/dashboard/my-events" element={<MyEvents />} />
        <Route path="/dashboard/my-events/:id" element={<EventDetails />} />
        <Route path="/dashboard/community" element={<UserCommunity />} />
        <Route path="/dashboard/saved" element={<Saved />} />
        <Route path="/dashboard/account" element={<AccountDetails />} />
      </Route>

      {/* Admin Dashboard - Protected */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminIndex />} />
        <Route path="event" element={<Event />} />
        <Route path="event/:id" element={<EventSingleDetails />} />


        <Route path="users" element={<Users />} />
        <Route path="listings" element={<ListingsManagement />} />
        <Route path="listings/sport-provider/:id" element={<SportProviderListingDetails />} />
        <Route path="listings/service-provider/:id" element={<ServiceProviderListingDetails />} />
        <Route path="brand" element={<Brand />} />
        <Route path="demand" element={<Demand />} />
        <Route path="content" element={<Content />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Provider Dashboard - Protected */}
      <Route
        path="/provider"
        element={
          <RequireAuth allowedRoles={[ROLES.PROVIDER]}>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<ProviderIndex />} />
        <Route path="add-listing" element={<AddListing />} />
        <Route path="add-listing/:id" element={<AddListingDetails />} />
        <Route path="event" element={<ProviderEvent />} />
        <Route path="event/:id" element={<ProviderEventDetails />} />
        <Route path="insights" element={<Insights />} />
        <Route path="insights/:id" element={<InsightsPreview />} />
        <Route path="enquiries" element={<ProviderEnquiries />} />
        <Route path="notifications" element={<ProviderNotifications />} />
        <Route path="event-analytics" element={<ProviderEventAnalytics />} />
        <Route path="event-analytics/event/:id" element={<EventAnallyticsDetails />} />
        <Route path="thread" element={<ProviderThread />} />
        <Route path="thread/:id" element={<ProviderThreadDetails />} />
        <Route path="service" element={<ProviderService />} />
        <Route path="service/:id" element={<ProviderServiceDetails />} />
        <Route path="service-analytics" element={<ServiceAnalytics />} />
        <Route path="settings" element={<ProviderSettings />} />
      </Route>

      {/* Coach Dashboard - Protected */}
      <Route
        path="/coach"
        element={
          <RequireAuth allowedRoles={[ROLES.COACH]}>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<CoachIndex />} />
        <Route path="events" element={<CoachEvent />} />
        <Route path="event/:id" element={<CoachEventDetails />} />
        <Route path="event-analytics" element={<EventAnalytics />} />
        <Route path="event-analytics/event/:id" element={<EventAnallyticsDetails />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="notifications" element={<Notifications />} />

        <Route path="recruitment" element={<Recruitment />} />
        <Route path="recruitment/:id" element={<RecruitmentDetails />} />
        <Route path="settings" element={<EditProfile />} />
      </Route>
    </>
  )
);

export default router;
