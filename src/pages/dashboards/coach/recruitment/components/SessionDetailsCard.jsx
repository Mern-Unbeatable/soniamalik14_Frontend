import React from 'react';

const SessionDetailsCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#000000] mb-3">Session Details</h2>
            <div className="text-[#272727] text-base md:max-w-7xl">
                {item.about || item.description}
            </div>

            {/* <div className='text-base mt-4'>
                <p>No trials. No pressure.</p>
            </div> */}
        </div>
    );
};

export default SessionDetailsCard;
