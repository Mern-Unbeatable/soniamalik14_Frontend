import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { MapPin, Calendar, Clock, Lock } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

const FindSportCard = ({ item }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Card
      className="p-5 h-full flex flex-col justify-between border  rounded-2xl"
      style={{ backgroundColor: '#E7F1F180' }}
    >
      <div className="flex-1 flex flex-col">
        <div className="relative">
          <div className="absolute top-3 left-3">
            <span className="bg-[#E7F1F1] text-[#0F766E] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{item.type}</span>
          </div>

          <div className="h-44 sm:h-56 bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-gray-400">Image</div>
            )}
          </div>
        </div>

        <h3
          className="text-[#0B2F2C] font-bold text-xl sm:text-2xl mb-3"
          style={{
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

        {!isAuthenticated && (
          <div className="bg-[#E7F1F1] rounded-lg p-6 text-center mt-auto min-h-[110px]">
            <div className="flex flex-col items-center justify-center gap-3">
              <Lock className="w-6 h-6 text-emerald-700" />
              <span className="font-medium text-[#0B2F2C]">Login to see contact details & ability requirements</span>
              <Link to="/signin" className="w-full">
                <Button variant="primary" className="mx-auto mt-3 w-4/5 rounded-lg bg-btn-primary text-white hover:bg-[#0d655d]">
                  Login to view
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <Link to={`/find-sport/${item.id}`} state={{ item }}>
          <Button variant="primary" className="w-full rounded-lg bg-btn-primary text-white hover:bg-[#0d655d]">
            View Details
          </Button>
        </Link>
      ) : null}
    </Card>
  );
};

export default FindSportCard;
