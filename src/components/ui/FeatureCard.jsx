import React from 'react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  iconBgColor = 'bg-teal-50', 
  iconColor = 'text-teal-600',
  className = '' 
}) => {
  return (
    <div className={`group bg-white rounded-2xl p-5 shadow hover:border-teal-100 transition-all duration-300 ${className}`}>
      {/* Icon Container */}
      <div className={`w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 text-btn-primary`} />
      </div>

      {/* Title */}
      <h3 className="subtitle text-cardTitle font-semibold text-xl md:text-2xl mb-3">{title}</h3>
      
      {/* Description */}
      <p className="description ">{description}</p>
    </div>
  );
};

export default FeatureCard;
