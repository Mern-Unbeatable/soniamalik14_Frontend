import React from 'react';

const TitleCoachInfo = ({ item }) => {
    return (
        <div className="px-2 md:px-4 mb-8">
            <h1 className="text-2xl md:text-[32px] font-bold text-[#1A1D1F] leading-tight">
                {item.title}
            </h1>
            <p className="text-[#33383F] mt-2 text-base">
                Coach: <span className="font-bold">{item.coach || item.headCoach}</span>
            </p>
        </div>
    );
};

export default TitleCoachInfo;
