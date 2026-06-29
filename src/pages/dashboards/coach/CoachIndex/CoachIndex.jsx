import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import CreateRecruitmentModal from '../../../../components/ui/CreateRecruitmentModal';
import EventModal from '../../../../components/ui/EventModal';
import ProfileHeader from './components/ProfileHeader';
import RecruitmentAds from './components/RecruitmentAds';
import EventsList from './components/EventsList';
import RecentPlayerActivity from './components/RecentPlayerActivity';

const CoachIndex = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  return (
    <div className="dashboardPy dashboardSpaceY">
      {/* Profile header (moved to component) */}
      <Card className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 md:p-6">
        <ProfileHeader />
        <div className="self-stretch lg:self-auto flex items-center justify-end w-full lg:w-auto">
          <Link to="/coach/settings" className="w-full lg:w-auto lg:ml-2">
            <Button className="w-full lg:w-auto px-4 py-2 rounded-lg" variant="primary">Edit Profile</Button>
          </Link>
        </div>
      </Card>

      {/* Two column area (Same as your code) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Ads (moved to component) */}
        <Card className="p-2 md:p-2">
          <RecruitmentAds onPost={() => setIsPostModalOpen(true)} />
        </Card>

        {/* Events (moved to component) */}
        <Card className="p-2 md:p-2">
          <EventsList onCreateEvent={() => setIsEventModalOpen(true)} />
        </Card>
      </div>

  
      
        <RecentPlayerActivity />
    
  

      <CreateRecruitmentModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} mode="create" />
    </div>
  );
};

export default CoachIndex;