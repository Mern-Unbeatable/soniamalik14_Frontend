import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import JoinMarketplaceModal from './JoinMarketplaceModal';

const BrandsProductsSection = ({ section }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const sectionImage = section?.brandImg || '';
    const sectionDescription = section?.brandDescription || '';

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:block">

            {/* Mobile Image (Visible only on small screens) */}
            <div className="h-64 sm:h-80 w-full md:hidden relative">
                {sectionImage ? (
                    <img
                        src={sectionImage}
                        alt="For Brands & Products"
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                        No image
                    </div>
                )}
                {/* Subtle gradient to transition to white content below on mobile */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
            </div>

            {/* Desktop Background Image (Hidden on small screens) */}
            <div className="hidden md:block absolute inset-0 z-0 w-full h-full">
                {sectionImage && (
                    <img
                        src={sectionImage}
                        alt="For Brands & Products"
                        className="absolute inset-0 w-full h-full object-cover object-right-bottom"
                    />
                )}
                {/* Smooth Gradient Overlay exactly like the image (Fades Left to Right) */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] w-[90%] lg:w-[80%]" />
            </div>

            {/* Content Container */}
           
            <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 w-full md:w-[65%] lg:w-[55%] bg-white md:bg-transparent  min-h-112.5] md:min-h-125 xl:min-h-137.5 flex flex-col justify-center">

                <h2 className="text-3xl md:text-[32px] leading-tight font-medium text-[#0B544E] mb-5 tracking-tight">
                    For Brands & Products
                </h2>

                {sectionDescription ? (
                    <p className="text-[#333333] text-base md:text-lg mb-8 leading-relaxed pr-4 md:pr-10 max-w-md">
                        {sectionDescription}
                    </p>
                ) : null}

                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#107C66] hover:bg-[#0c6150] transition-colors duration-200 text-white text-[15px] font-medium py-3 px-6 rounded-md inline-flex items-center group shadow-sm"
                    >
                        Join the marketplace
                        <ArrowRight className="w-4 h-4 ml-2 mt-[1px] transform group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Modal Component */}
            <JoinMarketplaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default BrandsProductsSection;