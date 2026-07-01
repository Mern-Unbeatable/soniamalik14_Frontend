import React from 'react';
import { ROLES } from '../../../../context/AuthContext';
import CollaborateListingButton from './CollaborateListingButton';
import {
  REGISTER_ROLE_KEYS,
  useCollaborateListingCta,
} from '../hooks/useCollaborateListingCta';

const ProfessionalSupportSection = ({ section }) => {
    const { handleClick, isDisabled } = useCollaborateListingCta({
        targetRole: ROLES.PROVIDER,
        registerRoleKey: REGISTER_ROLE_KEYS.SERVICE_PROVIDER,
        dashboardPath: '/provider',
        providerLabel: 'service provider',
    });
    const sectionImage = section?.supportImg || '';
    const sectionTitle = section?.sectionSubTitle || '';
    const sectionDescription = section?.supportDescription || '';

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:block mb-10">

            {/* Mobile Image (Visible only on small screens) */}
            <div className="h-64 sm:h-80 w-full md:hidden relative">
                {sectionImage ? (
                    <img
                        src={sectionImage}
                        alt="For Professional Support"
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200" />
                )}
                {/* Subtle gradient to transition to white content below on mobile */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
            </div>

            {/* Desktop Background Image (Hidden on small screens) */}
            <div className="hidden md:block absolute inset-0 z-0 w-full h-full xl:min-h-175">
                {sectionImage && (
                    <img
                        src={sectionImage}
                        alt="For Professional Support"
                        className="absolute inset-0 w-full h-full object-cover "
                    />
                )}
                {/* Smooth Gradient Overlay (Fades Right to Left this time) */}
                <div className="absolute inset-0 ml-auto bg-[linear-gradient(270deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] w-[90%] lg:w-[80%]" />
            </div>

            {/* Content Container (Right Side) */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 w-full md:w-[50%] lg:w-[40%] bg-white md:bg-transparent min-h-112.5] md:min-h-125 xl:min-h-137.5 flex flex-col justify-center ml-auto">

                {sectionTitle ? (
                    <h2 className="text-3xl md:text-[40px] leading-tight font-medium text-[#0B544E] mb-5 tracking-tight">
                        {sectionTitle}
                    </h2>
                ) : null}

                {sectionDescription ? (
                    <div
                        className="mb-8 max-w-md text-[#333333] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: sectionDescription }}
                    />
                ) : null}

                <div>
                    <CollaborateListingButton
                        label="List your business"
                        onClick={handleClick}
                        disabled={isDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfessionalSupportSection;
