import React from 'react';
import { MapPin, Clock, Bookmark } from 'lucide-react';

const SavedCard = ({ title, location, time, imageSrc, onViewDetails, onRemove, isRemoving = false }) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl  p-4">
    <div className="h-48 md:h-56 overflow-hidden bg-gray-200 rounded-lg mb-4 relative">
      <img 
        src={imageSrc || "/api/placeholder/400/250"} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow disabled:opacity-60 disabled:cursor-not-allowed"
        title="Remove from saved"
      >
        <Bookmark className="w-5 h-5 text-btn-primary fill-btn-primary" />
      </button>
    </div>
    
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="w-5 h-5 shrink-0" />
          <span className="text-base md:text-lg">{location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-5 h-5 shrink-0" />
          <span className="text-base md:text-lg">{time}</span>
        </div>
      </div>
      
      <button 
        onClick={onViewDetails}
        className="w-full bg-btn-primary text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base md:text-lg"
      >
        View Details
      </button>
    </div>
  </div>
);

export default SavedCard;
