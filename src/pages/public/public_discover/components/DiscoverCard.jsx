import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import LoginModal from './LoginModal';

const DiscoverCard = ({ item }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/discover/${item.type}/${item.id}`, { state: { item } });
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate('/signin');
  };

  return (
    <Card
      className="p-5 h-full flex flex-col justify-between border  rounded-2xl"
      style={{ backgroundColor: '#E7F1F180' }}
    >
      <div className="flex-1 flex flex-col">
        <div className="relative">
          {/* <div className="absolute bottom-6 left-3">
            <span className="bg-[#E7F1F1] text-[#0F766E] px-3 py-1 rounded-full text-sm font-semibold shadow-sm">{item.type}</span>
          </div> */}

          <div className="h-44 sm:h-56 bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-gray-400">Image</div>
            )}
          </div>
        </div>

        <h3
          className="font-bold text-xl sm:text-2xl mb-3"
          style={{
            color: item.titleColor || '#0B2F2C',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </h3>

        <div className="text-base text-[#1f3a37] mb-2 flex items-center gap-3">
          <MapPin className="w-4 h-4 text-[#1f3a37]" />
          <span className="text-base text-gray-700">{item.location}</span>
        </div>

        <div className="text-base text-[#1f3a37] mb-4 space-y-2">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#1f3a37]" /> <span className="text-base text-gray-700">{item.day}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1f3a37]" /> <span className="text-base text-gray-700">{item.time}</span></div>
        </div>

      </div>

      <Link
        to={isAuthenticated ? `/discover/${item.type}/${item.id}` : '#'}
        onClick={handleViewDetails}
      >
        <Button variant="primary" className="w-full rounded-lg bg-btn-primary text-white hover:bg-[#0d655d]">
          View Details
        </Button>
      </Link>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginClick={handleLoginClick}
      />
    </Card>
  );
};

export default DiscoverCard;
