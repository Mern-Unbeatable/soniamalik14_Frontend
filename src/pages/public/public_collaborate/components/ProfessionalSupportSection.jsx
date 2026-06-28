import React from 'react';
import { Check } from 'lucide-react';
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
    const sectionImage = section?.supportImg || '/ProfessionalSupport1.webp';
    const sectionDescription =
        section?.supportDescription ||
        "We want to work with professionals whose expertise supports women in sport — including physiotherapy, strength and conditioning, nutrition, women's health and wellbeing.";

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:block mb-10">

            {/* Mobile Image (Visible only on small screens) */}
            <div className="h-64 sm:h-80 w-full md:hidden relative">
                <img
                    src={sectionImage}
                    alt="For Professional Support"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                />
                {/* Subtle gradient to transition to white content below on mobile */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
            </div>

            {/* Desktop Background Image (Hidden on small screens) */}
            <div className="hidden md:block absolute inset-0 z-0 w-full h-full xl:min-h-175">
                <img
                    // Replace with your original image: "/ProfessionalSupport1.png"
                    src={sectionImage}
                    alt="For Professional Support"
                    className="absolute inset-0 w-full h-full object-cover "
                />
                {/* Smooth Gradient Overlay (Fades Right to Left this time) */}
                <div className="absolute inset-0 ml-auto bg-[linear-gradient(270deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] w-[90%] lg:w-[80%]" />
            </div>

            {/* Content Container (Right Side) */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 w-full md:w-[50%] lg:w-[40%] bg-white md:bg-transparent min-h-112.5] md:min-h-125 xl:min-h-137.5 flex flex-col justify-center ml-auto">

                <h2 className="text-3xl md:text-[40px] leading-tight font-medium text-[#0B544E] mb-5 tracking-tight">
                    For Professional Support
                </h2>

                <p className="text-[#333333] text-base md:text-lg  mb-8 leading-relaxed pr-4 md:pr-10 max-w-md">
                    {sectionDescription}
                </p>

                <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                        <Check className="w-5.5 h-5.5] text-[#107C66] mr-3 mt-0.5 shrink-0" strokeWidth={2.5} />
                        <span className="text-[#1A1A1A] text-base font-medium tracking-tight">
                            Connect with a targeted audience
                        </span>
                    </li>
                    <li className="flex items-start">
                        <Check className="w-5.5 h-5.5] text-[#107C66] mr-3 mt-0.5 shrink-0" strokeWidth={2.5} />
                        <span className="text-[#1A1A1A] text-base font-medium tracking-tight">
                            Increase visibility within a trusted platform
                        </span>
                    </li>
                </ul>

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
