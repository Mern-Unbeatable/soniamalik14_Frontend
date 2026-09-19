import React from 'react';
import {
    DUMMY_IMAGE_PATH,
    handleImageLoadError,
    pickImageSource,
    resolveImageUrl,
} from '../../../../../utils/resolveImageUrl';

const DISCOVER_PLACEHOLDER = '/discover-placeholder.png';

const HeroBanner = ({ item = {} }) => {
    const bannerSrc = resolveImageUrl(
        pickImageSource(item.image),
        DISCOVER_PLACEHOLDER
    );
    const avatarSrc = resolveImageUrl(
        pickImageSource(item.avatar, item.logo),
        DUMMY_IMAGE_PATH
    );

    return (
        <div className="relative mb-16">
            <div className="h-64 w-full overflow-hidden rounded-2xl shadow-sm md:h-180">
                <img
                    src={bannerSrc}
                    alt={item.title || 'Listing'}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageLoadError(e, DISCOVER_PLACEHOLDER)}
                />
            </div>

            <div className="absolute -bottom-10 left-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#F8FAFC] bg-gray-200 md:left-10 md:h-24 md:w-24">
                <img
                    src={avatarSrc}
                    alt={item.coach || 'Organisation'}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageLoadError(e, DUMMY_IMAGE_PATH)}
                />
            </div>
        </div>
    );
};

export default HeroBanner;
