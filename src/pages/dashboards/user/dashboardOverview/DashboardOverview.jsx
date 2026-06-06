import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import UpcomingEvents from './components/UpcomingEvents';
import NotificationsList from './components/NotificationsList';
import { useAuth } from '../../../../context/AuthContext';

const DashboardOverview = () => {
  const { user } = useAuth();

  return (
    <section className=" dashboardPy dashboardSpaceY">
      <DashboardHeader userName={user?.name || undefined} />
      <UpcomingEvents />
      <NotificationsList />
    </section>
  );
};

export default DashboardOverview;