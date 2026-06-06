import React from 'react';

const HeroTitle = ({ children, className = '' }) => {
    return (
        <div className={`${className} text-white text-[22px] sm:text-2xl md:text-3xl lg:text-[64px] font-semibold`}>
            {children}
        </div>
    );
};

export default HeroTitle;