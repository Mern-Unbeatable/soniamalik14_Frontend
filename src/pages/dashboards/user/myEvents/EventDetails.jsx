


import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Medal, Calendar, Users } from 'lucide-react';
import Container from '../../../../components/layout/Container';


const EventDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item || {
    id,
    title: 'Weekly Women’s Cricket Nets Session',
    coach: 'John Doe',
    type: 'Recreational',
    sport: 'Cricket',
    suitableFor: 'New to the sport',
    womensOnly: 'Yes',
    location: 'Bashundhara turbo tough',
    postcode: '222300',
    town: 'London',
    day: 'Saturday',
    time: '10:00 - 12:00',
    image: '/images/detaisPage/detailsBanner.png', 
    avatar: '/images/detaisPage/coachAvatar.png', 
    mapImage: 'https://i.ibb.co.com/ZRNpWQng/1579279c93526af38385f21a2041e29aeb2f2ae5.png', 
    about: 'This weekly women’s cricket nets session is designed for players who want to improve their skills in a relaxed and supportive environment. Whether you’re completely new to cricket or returning after a break, this session provides a safe space to learn, practice, and enjoy the game at your own pace.',
    
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert('Message sent — demo only');
  };

  return (
    
  
        <div className="dashboardPy dashboardSpaceY">
          
          {/* Hero Banner Section */}
          <div className="relative mb-16">
            {/* Banner Image */}
            <div className="w-full h-62.5 md:h-150 rounded-2xl overflow-hidden shadow-sm">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>

            {/* Overlaid Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Overlaid Favorite/Heart Button */}
            <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all">
              <Heart className="w-4 h-4" />
            </button>

            {/* Overlaid Avatar Picture */}
            <div className="absolute -bottom-10 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#F8FAFC] overflow-hidden bg-gray-200">
              {item.avatar ? (
                <img src={item.avatar} alt={item.coach} className="w-full h-full object-cover" />
              ) : (
                <img src={item.image} alt="fallback" className="w-full h-full object-cover" /> // fallback
              )}
            </div>
          </div>

          {/* Title & Coach Info */}
          <div className="px-2 md:px-4 mb-8">
            <h1 className="text-2xl md:text-[32px] font-bold text-[#0B544E] leading-tight">
              {item.title}
            </h1>
            <p className="text-[#33383F] mt-2 text-base">
              Coach: <span className="font-bold">{item.coach || item.headCoach}</span>
            </p>
          </div>

          {/* Session Details Card */}
          <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#000000] mb-3">Session Details</h2>
            <div className="text-[#272727]  text-base md:max-w-7xl">  
              {item.about}
            </div>

            <div className='text-base mt-4'>
              <p>No trials. No pressure. Just cricket.</p>
            </div>
          </div>

          {/* 3-Column Grid for Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Column 1: Session Overview */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Session Overview</h3>
              <div className="space-y-3 mb-6">
                
                {/* Info Row: Sport */}
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Medal className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Sport</p>
                    <p className="text-base  text-[#4A5565]">{item.sport || 'Cricket'}</p>
                  </div>
                </div>

                {/* Info Row: Session Type */}
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Session Type</p>
                    <p className="text-base  text-[#4A5565]">{item.type}</p>
                  </div>
                </div>

                {/* Info Row: Suitable For */}
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Suitable For</p>
                    <p className="text-base  text-[#4A5565]">{item.suitableFor}</p>
                  </div>
                </div>

                {/* Info Row: Women's only */}
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Women's only</p>
                    <p className="text-base  text-[#4A5565]">{item.womensOnly}</p>
                  </div>
                </div>

              </div>
              
              
            </div>

            {/* Column 2: Location & Timing. */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Location & Timing.</h3>
              <div className="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-6 min-h-0 flex-1 space-y-3">
                  <p className="flex text-base">
                    <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Venue Name:</span>
                    <span className="truncate text-[#1A1D1F]">{item.location}</span>
                  </p>
                  <p className="flex text-base">
                    <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Postcode:</span>
                    <span className="text-[#1A1D1F]">{item.postcode}</span>
                  </p>
                  <p className="flex text-base">
                    <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Town/City:</span>
                    <span className="text-[#1A1D1F]">{item.town}</span>
                  </p>
                  <p className="flex text-base">
                    <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Day of session:</span>
                    <span className="text-[#1A1D1F]">{item.day}</span>
                  </p>
                  <p className="flex text-base">
                    <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Session Time:</span>
                    <span className="text-[#1A1D1F]">{item.time}</span>
                  </p>
                </div>

                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  {item.mapImage ? (
                    <img
                      src={item.mapImage}
                      alt="Map View"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Map Image
                    </div>
                  )}
                </div>
              </div>
            </div>

        

          </div>
        </div>
     
  
  );
};

export default EventDetails;