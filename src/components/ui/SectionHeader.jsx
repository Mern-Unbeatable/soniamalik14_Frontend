import React from 'react';

const SectionHeader = ({ 
  subtitle, 
  title, 
  description, 
  align = 'left',
  className = '' 
}) => {
  const alignmentClasses = {
    center: 'text-center mx-auto',
    left: 'text-left',
    right: 'text-right ml-auto'
  };

  return (
    <div className={`max-w-4xl ${alignmentClasses[align]} ${className}`}>
      {subtitle}
      
      {title && (
        <h2 className="sectiontitle mb-2 tracking-tight">
          {title}
        </h2>
      )}
      
      {description && (
        <p className="description text-base sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
