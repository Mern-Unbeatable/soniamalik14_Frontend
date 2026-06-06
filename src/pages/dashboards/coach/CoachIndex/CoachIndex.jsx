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

  // Mock Data for Table
  const playersActivity = [
    { name: "Devon Lane", phone: "(405) 555-0128", email: "jackson.graham@example.com", message: "Aliquam porta nisl dolor, molestie pellentesque elit molestie in. Morbi metus neque, elementum ullam", date: "12 Mar 26" },
    { name: "Wade Warren", phone: "(603) 555-0123", email: "alma.lawson@example.com", message: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl", date: "12 Mar 26" },
    { name: "Robert Fox", phone: "(209) 555-0104", email: "nevaeh.simmons@example.com", message: "Vestibulum eu quam nec neque pellentesque efficitur id eget nisl. Proin porta est convallis lacus bl", date: "12 Mar 26" },
    { name: "Cameron Williamson", phone: "(303) 555-0105", email: "tim.jennings@example.com", message: "Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat. Morbi in orci risus. Donec pretium f", date: "12 Mar 26" },
    { name: "Marvin McKinney", phone: "(704) 555-0127", email: "michael.mitc@example.com", message: "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat vo", date: "12 Mar 26" },
    { name: "Esther Howard", phone: "(239) 555-0108", email: "georgia.young@example.com", message: "Aliquam pulvinar vestibulum blandit. Donec sed nisl libero. Fusce dignissim luctus sem eu dapibus. P", date: "12 Mar 26" },
  ];

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

  
      
        <RecentPlayerActivity players={playersActivity} />
    
  

      <CreateRecruitmentModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} mode="create" />
    </div>
  );
};

export default CoachIndex;