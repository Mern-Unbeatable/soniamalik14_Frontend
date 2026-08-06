import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DUMMY_IMAGE_PATH, handleImageLoadError } from '../../../../../../utils/resolveImageUrl';

const EventHeroSection = ({ image, onBack }) => {
  const heroSrc = image || DUMMY_IMAGE_PATH;

  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm">
      <img
        src={heroSrc}
        alt="Event Banner"
        className="h-64 w-full object-cover md:h-96 lg:h-100 xl:h-140 2xl:h-186"
        onError={(e) => handleImageLoadError(e, DUMMY_IMAGE_PATH)}
      />
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-black shadow-sm backdrop-blur-md transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
    </div>
  );
};

export default EventHeroSection;
