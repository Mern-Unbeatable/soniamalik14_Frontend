import React from 'react';
import { useSelector } from 'react-redux';
import { IoLocationOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { selectAuthUser } from '../../../../../features/auth/authSlice';

const ProfileHeader = () => {
    const user = useSelector(selectAuthUser);

    const coachName =
        user?.organizationName ||
        user?.clubName ||
        user?.organization ||
        user?.name ||
        'Northside Elite Football';

    const city = user?.city || user?.townCity || '';
    const country = user?.country || user?.countryName || '';
    const locationText = [city, country].filter(Boolean).join(', ') || user?.location || 'Manchester, UK';

    const aboutText =
        user?.description ||
        user?.aboutService ||
        user?.aboutOrganization ||
        user?.bio ||
        'Leading the way in youth female development. Our mission is to provide professional-grade training and competition for girls aged 12-18 across the North West.';

    const coachImage = user?.logo || user?.avatar || user?.image ;

    return (
        <div className="flex flex-col lg:flex-row items-center gap-4">
            {coachImage ? (
                <img
                    src={coachImage}
                    alt="coach"
                    className="w-26 h-26 rounded-lg object-cover shadow-sm"
                />
            ) : (
                <div className="w-26 h-26 rounded-lg bg-gray-100 flex flex-col items-center justify-center border border-gray-200 shadow-sm text-gray-400 p-2 gap-1">
                    <FiUser className="w-8 h-8 text-gray-400" />
                    <span className="text-[10px] font-medium leading-tight text-center">No Image Added</span>
                </div>
            )}

            <div>
               <h1 className="text-2xl font-bold text-btn-primary">{coachName}</h1>
                <p className="text-base text-secondary-text mt-1 flex items-center gap-1 ">
                    <IoLocationOutline />{locationText}
                </p>
                <p className="text-base text-description mt-2 max-w-2xl">
                    {aboutText}
                </p>
            </div>
        </div>
    );
};

export default ProfileHeader;
