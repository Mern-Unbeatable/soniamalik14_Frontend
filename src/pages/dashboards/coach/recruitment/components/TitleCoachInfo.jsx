import React from 'react';

const TitleCoachInfo = ({ item }) => {
    const coachName = String(item?.coach || item?.headCoach || '').trim();

    return (
        <div className="px-2 md:px-4 mb-8">
            <h1 className="text-2xl md:text-[32px] font-bold text-[#1A1D1F] leading-tight">
                {item.title}
            </h1>
            {coachName ? (
                <p className="mt-2 text-base font-bold text-[#33383F]">{coachName}</p>
            ) : null}
        </div>
    );
};

export default TitleCoachInfo;
