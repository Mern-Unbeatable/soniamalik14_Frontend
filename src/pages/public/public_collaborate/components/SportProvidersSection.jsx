import React from 'react';
import { Check } from 'lucide-react';
import { ROLES } from '../../../../context/AuthContext';
import CollaborateListingButton from './CollaborateListingButton';
import {
  REGISTER_ROLE_KEYS,
  useCollaborateListingCta,
} from '../hooks/useCollaborateListingCta';

const SportProvidersSection = () => {
    const { handleClick, isDisabled } = useCollaborateListingCta({
        targetRole: ROLES.COACH,
        registerRoleKey: REGISTER_ROLE_KEYS.SPORT_PROVIDER,
        dashboardPath: '/coach',
        providerLabel: 'sport provider',
    });

    return (        <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:block">

            {/* Mobile Image (Visible only on small screens) */}
            <div className="h-64 sm:h-80 w-full md:hidden relative">
                <img
                    src="/sportProviderOrginal.webp"
                    alt="For Sport Providers"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                />
                {/* Subtle gradient to transition to white content below on mobile */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
            </div>

            {/* Desktop Background Image (Hidden on small screens) */}
            <div className="hidden md:block absolute inset-0 z-0 w-full h-full xl:min-h-[700px]">
                <img

                    src="/sportProviderOrginal.webp"
                    alt="For Sport Providers"
                    className="absolute inset-0  object-cover object-right"
                />
                {/* Smooth Gradient Overlay exactly like the image (Fades Left to Right) */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] w-[90%] lg:w-[80%]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 w-full md:w-[65%] lg:w-[55%] bg-white md:bg-transparent  min-h-112.5] md:min-h-125 xl:min-h-137.5 flex flex-col justify-center">

                <h2 className="text-3xl md:text-[40px] leading-tight font-medium text-[#0B544E] mb-5 tracking-tight">
                    For Sport Providers
                </h2>

                <p className="text-[#333333] text-base md:text-lg mb-8 leading-relaxed pr-4 md:pr-10 max-w-lg">
                    If you run sessions, teams or training opportunities, ESSA Hub can help make them easier to find.
                </p>

                <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                        <Check className="w-[22px] h-[22px] text-[#107C66] mr-3 mt-[2px] shrink-0" strokeWidth={2.5} />
                        <span className="text-[#1A1A1A] text-base font-medium tracking-tight">
                            Promote women-only or inclusive sessions
                        </span>
                    </li>
                    <li className="flex items-start">
                        <Check className="w-[22px] h-[22px] text-[#107C66] mr-3 mt-[2px] shrink-0" strokeWidth={2.5} />
                        <span className="text-[#1A1A1A] text-base font-medium tracking-tight">
                            Increase visibility within your local area
                        </span>
                    </li>
                </ul>

                <p className="text-[#333333] text-base md:text-lg mb-8 leading-relaxed pr-4 md:pr-10 max-w-lg">
                    If you deliver sport and want to reach more women, we'd love to hear from you.
                </p>

                <div>
                    <CollaborateListingButton
                        label="List your club or sessions"
                        onClick={handleClick}
                        disabled={isDisabled}
                    />
                </div>            </div>
        </div>
    );
};
export default SportProvidersSection;
