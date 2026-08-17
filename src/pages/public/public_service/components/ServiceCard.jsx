// import React from 'react';
// import { Link } from 'react-router-dom';
// import Card from '../../../../components/ui/Card';
// import Button from '../../../../components/ui/Button';
// import { MapPin, Calendar, Clock } from 'lucide-react';
// import { useAuth } from '../../../../context/AuthContext';

// const ServiceCard = ({ item }) => {
//   const { isAuthenticated } = useAuth();

//   const typeLabel = item.serviceType || item.type || item.service_type || '';

//   const formatLabel = (v) => {
//     if (!v) return '';
//     return String(v).replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
//   };

//   return (
//     <Card className="p-4 h-full flex flex-col justify-between" style={{ backgroundColor: '#E7F1F180' }}>
//       <div>
//         <div className="relative">
//           <div className="absolute top-0 left-0 m-3 bg-secondary text-btn-primary rounded-full px-3 py-2 text-base font-semibold">{formatLabel(typeLabel)}</div>
//           <div className="h-64 bg-gray-200 rounded-md mb-4 overflow-hidden flex items-center justify-center">
//             {item.image ? (
//               <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-md" />
//             ) : (
//               <div className="text-gray-400">Image</div>
//             )}
//           </div>
//         </div>

//         <h3 className="text-[#282828] font-semibold text-lg mb-2">{item.title}</h3>

//         <div className="text-base text-[#363636] mb-1 flex items-center gap-2">
//           <MapPin className="w-4 h-4 text-[#363636]" />
//           <span className="text-base">{item.location}</span>
//         </div>

//         <div className="text-base text-[#363636] mb-3 flex items-start gap-2 flex-col">
//           <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#363636]" /> <span className="text-base">{item.day}</span></div>
//           <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#363636]" /> <span className="text-base">{item.time}</span></div>
//         </div>

//         {/* Show only the View Details button; signin receives return state when unauthenticated */}
//       </div>

//       <div className="mt-2">
//         <Link
//           to={isAuthenticated ? `/services/${item.id}` : '/signin'}
//           state={isAuthenticated ? { item } : { from: `/services/${item.id}`, item }}
//         >
//           <Button variant="primary" className="w-full rounded-lg bg-btn-primary text-white hover:bg-[#0d655d]">
//             View Details
//           </Button>
//         </Link>
//       </div>
//     </Card>
//   );
// };

// export default ServiceCard;





import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../../components/ui/Card';
import { useAuth } from '../../../../context/AuthContext';
import {
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const DUMMY_IMAGE = '/service-placeholder.png';

const ServiceCard = ({ item }) => {
  const { isAuthenticated } = useAuth();

  // Safely extract type and sport from the data
  const typeLabel = item.serviceType || item.type || item.service_type || 'Service';
  const sportLabel = item.sport || 'General';
  const imageSrc = resolveImageUrl(
    pickImageSource(item.image, item.logo, item.coverImage),
    DUMMY_IMAGE
  );

  const formatLabel = (v) => {
    if (!v) return '';
    return String(v).replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
  };

  return (
    <Card className="p-4 h-full flex flex-col justify-between border-none rounded-[20px] bg-[#E7F1F1]!">
      <div className="flex flex-col flex-1">
        
        {/* Image / Placeholder Area */}
        <div className="relative w-full h-48 bg-[#DADADA] rounded-xl mb-5 overflow-hidden">
          <img
            src={imageSrc}
            alt={item.title || 'Service'}
            onError={(e) => handleImageLoadError(e, DUMMY_IMAGE)}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 left-3">
            <span className="bg-[#EAF2F1] text-[#147B6B] px-3.5 py-1.5 rounded-full text-[12px] font-medium">
              {formatLabel(typeLabel)}
            </span>
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="bg-[#EAF2F1] text-[#147B6B] px-3.5 py-1.5 rounded-full text-[12px] font-medium">
              {formatLabel(sportLabel)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-lg md:text-xl leading-snug mb-2.5"
          style={{ color: item.titleColor || '#1A1D1F' }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-[#4A5565] text-base leading-relaxed mb-6 line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Link
          to={isAuthenticated ? `/services/${item.id}` : '/signin'}
          state={isAuthenticated ? { item } : { from: `/services/${item.id}`, item }}
          className="block w-full"
        >
          <button className="w-full bg-[#147B6B] hover:bg-[#0D655D] text-white py-2.5 rounded-lg text-[14px] font-medium transition-colors">
            View details
          </button>
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;