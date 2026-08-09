import React from 'react';
import { User } from 'lucide-react';
import {
    DUMMY_IMAGE_PATH,
    handleImageLoadError,
    pickImageSource,
    resolveImageUrl,
} from '../../../../../utils/resolveImageUrl';

const RECRUITMENT_PLACEHOLDER = '/recruitment-placeholder.png';

const HeroBanner = ({ item = {} }) => {
    const bannerSrc = resolveImageUrl(
        pickImageSource(item.image, item.logo),
        RECRUITMENT_PLACEHOLDER
    );
    const avatarSource = pickImageSource(item.avatar);

    return (
        <div className="relative mb-16">
            <div className="h-64 w-full overflow-hidden rounded-2xl shadow-sm md:h-180">
                <img
                    src={bannerSrc}
                    alt={item.title || 'Listing'}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageLoadError(e, RECRUITMENT_PLACEHOLDER)}
                />
            </div>

            <div className="absolute -bottom-10 left-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#F8FAFC] bg-gray-200 md:left-10 md:h-24 md:w-24">
                {avatarSource ? (
                    <img
                        src={resolveImageUrl(avatarSource, DUMMY_IMAGE_PATH)}
                        alt={item.coach || 'Organiser'}
                        className="h-full w-full object-cover"
                        onError={(e) => handleImageLoadError(e, DUMMY_IMAGE_PATH)}
                    />
                ) : (
                    <User className="h-10 w-10 text-gray-500" />
                )}
            </div>
        </div>
    );
};

export default HeroBanner;
