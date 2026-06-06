import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Edit, Trash2 } from 'lucide-react';

const EventCard = ({ id, title, location, time, imageSrc, onViewDetails, onDelete }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/dashboard/my-events/${id}`);
    if (onViewDetails) onViewDetails();
  };

  return (
    <div className="bg-white border-2 border-[#B5D5D2] rounded-lg overflow-hidden  p-4">
      <div className="h-48 md:h-56 overflow-hidden bg-gray-200 rounded-lg mb-4">
        <img 
          src={imageSrc || "/api/placeholder/400/250"} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div>
        <h3 className="text-xl md:text-xl font-bold text-gray-900 mb-4">{title}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 shrink-0" />
            <span className="text-base ">{location}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5 shrink-0" />
            <span className="text-base ">{time}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleViewClick}
            className="flex-1 bg-btn-primary text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base  flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            <span>View</span>
          </button>
          
          <button
            onClick={onDelete}
            className="flex-1 border-2 border-btn-primary text-btn-primary py-3 px-4 rounded-lg font-semibold hover:bg-btn-primary/5 transition-colors text-base  flex items-center justify-center gap-2"
            title="Delete event"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
