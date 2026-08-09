import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import LoginModal from './LoginModal';
import {
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const LISTING_PLACEHOLDER = '/recruitment-placeholder.png';

const resolveSportLabel = (item = {}) => {
  const fromSport = String(item.sport || '').trim();
  if (fromSport && fromSport.toLowerCase() !== 'others') return fromSport;

  const sports = Array.isArray(item.sports) ? item.sports.filter(Boolean) : [];
  if (sports.length > 0) return sports[0];

  const fromType = String(item.type || '').trim();
  return fromType || '';
};

const DiscoverCard = ({ item }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const sportLabel = useMemo(() => resolveSportLabel(item), [item]);

  const imageSrc = resolveImageUrl(
    pickImageSource(item.image, item.logo, item.thumbnail),
    LISTING_PLACEHOLDER
  );

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/discover/${item.id}`, { state: { item } });
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate('/signin');
  };

  return (
    <Card
      className="flex h-full flex-col justify-between rounded-2xl border border-[#CDE1DF] p-5"
      style={{ backgroundColor: '#E7F1F180' }}
    >
      <div className="flex flex-1 flex-col">
        <div className="relative mb-4 h-44 overflow-hidden rounded-lg bg-gray-200 sm:h-56">
          <img
            src={imageSrc}
            alt={item.title || 'Listing'}
            className="h-full w-full object-cover"
            onError={(e) => handleImageLoadError(e, LISTING_PLACEHOLDER)}
          />
          {sportLabel ? (
            <span className="absolute bottom-3 left-3 z-10 rounded-full bg-[#E7F1F1] px-3 py-1 text-sm font-semibold text-[#0F766E] shadow-sm">
              {sportLabel}
            </span>
          ) : null}
        </div>

        <h3
          className="mb-3 text-lg font-bold sm:text-xl"
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

        <div className="mb-2 flex items-center gap-3 text-base text-[#363636]">
          <MapPin className="h-4 w-4 shrink-0 text-[#363636]" />
          <span className="line-clamp-2">{item.location}</span>
        </div>

        <div className="mb-4 space-y-2 text-base text-[#363636]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-[#363636]" />
            <span>{item.day}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-[#363636]" />
            <span>{item.time}</span>
          </div>
        </div>
      </div>

      <Link
        to={isAuthenticated ? `/discover/${item.id}` : '#'}
        onClick={handleViewDetails}
      >
        <Button
          variant="primary"
          className="w-full rounded-lg bg-[#0F766E] text-white hover:bg-[#0d655d]"
        >
          View details
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
