import React from 'react';

const ImageFeatureCard = ({
  imgSrc,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-250 ${className}`}>
      <div className="flex flex-col">
        <div className="flex-1">
          <h4 className="text-2xl font-semibold text-[#111827] mb-2">{title}</h4>
          <p className="text-base text-[#6B7280]">{description}</p>
        </div>

        <div className=" w-full  rounded-lg overflow-hidden">
          <img src={imgSrc} alt={title} className="w-full h-full object-cover object-center" />
        </div>
      </div>
    </div>
  );
};

export default ImageFeatureCard;
