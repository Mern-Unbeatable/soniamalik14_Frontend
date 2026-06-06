import React from 'react';

const HeroImage = ({ src, alt }) => {
    return (
        <div className="w-full h-64 md:h-[520px] relative rounded-xl overflow-hidden mb-6">
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
    );
};

export default HeroImage;
